/**
 * Pyodide WebAssembly Python Runtime Manager
 * Provides a client-side singleton instance to execute Python code and grade QA challenges
 * with detailed per-test assertions (inputs, expected vs actual values, error tracebacks).
 */

let pyodideInstance = null;
let loadPromise = null;

export function _resetPyodideInstanceForTesting() {
  pyodideInstance = null;
  loadPromise = null;
}

const PYTHON_HARNESS_CODE = `
import sys
import io
import json
import traceback

class MockWebElement:
    def __init__(self, tag='div', text='', attributes=None):
        self.tag_name = tag
        self.text = text
        self.attributes = attributes or {}
    
    def get_attribute(self, name):
        return self.attributes.get(name, None)
        
    def click(self):
        return f"Clicked on <{self.tag_name}>"
        
    def send_keys(self, value):
        self.text += str(value)
        return f"Typed '{value}' into <{self.tag_name}>"

def __qa_exec_runner(code):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    sys.stdout = stdout_buf
    sys.stderr = stderr_buf
    
    res = {
        "success": False,
        "stdout": "",
        "stderr": "",
        "error": None
    }
    
    scope = {
        "__name__": "__main__",
        "MockWebElement": MockWebElement
    }
    
    try:
        exec(code, scope)
        res["success"] = True
    except Exception as e:
        res["error"] = {
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }
    except SyntaxError as e:
        res["error"] = {
            "type": "SyntaxError",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        res["stdout"] = stdout_buf.getvalue()
        res["stderr"] = stderr_buf.getvalue()
        
    return json.dumps(res)

def __qa_test_runner(user_code, test_cases_json_str, raw_test_code):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    sys.stdout = stdout_buf
    sys.stderr = stderr_buf
    
    res = {
        "success": False,
        "runtime_error": None,
        "tests": [],
        "passed_count": 0,
        "total_count": 0,
        "stdout": "",
        "stderr": ""
    }
    
    scope = {
        "__name__": "__main__",
        "MockWebElement": MockWebElement
    }
    
    try:
        exec(user_code, scope)
    except Exception as e:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        res["runtime_error"] = {
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        res["stdout"] = stdout_buf.getvalue()
        res["stderr"] = stderr_buf.getvalue()
        return json.dumps(res)
    except SyntaxError as e:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        res["runtime_error"] = {
            "type": "SyntaxError",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        res["stdout"] = stdout_buf.getvalue()
        res["stderr"] = stderr_buf.getvalue()
        return json.dumps(res)
        
    test_cases = []
    if test_cases_json_str:
        try:
            test_cases = json.loads(test_cases_json_str)
        except Exception:
            test_cases = []
            
    if test_cases:
        res["total_count"] = len(test_cases)
        for idx, tc in enumerate(test_cases, 1):
            name = tc.get("name", f"Test Case {idx}")
            call_code = tc.get("call", "")
            expected = tc.get("expected")
            description = tc.get("description", "")
            
            tc_res = {
                "id": idx,
                "name": name,
                "call": call_code,
                "expected": expected,
                "actual": None,
                "passed": False,
                "error": None,
                "description": description
            }
            
            try:
                actual = eval(call_code, scope)
                tc_res["actual"] = actual
                if actual == expected:
                    tc_res["passed"] = True
                    res["passed_count"] += 1
                else:
                    tc_res["passed"] = False
                    tc_res["error"] = f"Așteptat {expected!r}, dar funcția a returnat {actual!r}"
            except Exception as e:
                tc_res["passed"] = False
                tc_res["error"] = f"{type(e).__name__}: {str(e)}"
                
            res["tests"].append(tc_res)
            
        res["success"] = (res["passed_count"] == res["total_count"])
    elif raw_test_code:
        # First execute any setup statements in raw_test_code into scope
        # Then evaluate assertions
        try:
            exec(raw_test_code, scope)
            res["success"] = True
            res["passed_count"] = 1
            res["total_count"] = 1
            res["tests"].append({
                "id": 1,
                "name": "Suite assertions",
                "passed": True
            })
        except AssertionError as ae:
            res["success"] = False
            res["passed_count"] = 0
            res["total_count"] = 1
            res["tests"].append({
                "id": 1,
                "name": str(ae) or "AssertionError",
                "passed": False,
                "error": str(ae) or "AssertionError"
            })
        except Exception as e:
            res["success"] = False
            res["runtime_error"] = {
                "type": type(e).__name__,
                "message": str(e),
                "traceback": traceback.format_exc()
            }

    sys.stdout = old_stdout
    sys.stderr = old_stderr
    res["stdout"] = stdout_buf.getvalue()
    res["stderr"] = stderr_buf.getvalue()
    return json.dumps(res)
`;

async function ensureHarness(pyodide) {
  try {
    const hasRunner = pyodide.globals.get('__qa_exec_runner');
    if (!hasRunner) {
      await pyodide.runPythonAsync(PYTHON_HARNESS_CODE);
    }
  } catch (e) {
    await pyodide.runPythonAsync(PYTHON_HARNESS_CODE);
  }
}

export async function getPyodide(onProgress) {
  if (typeof window === 'undefined') return null;

  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (loadPromise) {
    return await loadPromise;
  }

  loadPromise = (async () => {
    try {
      if (!window.loadPyodide) {
        if (onProgress) onProgress('loading_script');
        await new Promise((resolve, reject) => {
          const existing = document.querySelector('script[src*="pyodide.js"]');
          if (existing) {
            existing.addEventListener('load', resolve);
            existing.addEventListener('error', reject);
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Pyodide WebAssembly script from CDN.'));
          document.head.appendChild(script);
        });
      }

      if (onProgress) onProgress('initializing_wasm');
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      });

      await ensureHarness(pyodide);
      pyodideInstance = pyodide;
      return pyodide;
    } catch (err) {
      loadPromise = null;
      throw err;
    }
  })();

  return await loadPromise;
}

/**
 * Execute arbitrary Python code capturing stdout/stderr and detailed error traceback
 */
export async function executePython(code) {
  const pyodide = await getPyodide();
  if (!pyodide) throw new Error('Python runtime unavailable');

  await ensureHarness(pyodide);
  pyodide.globals.set('__user_code_exec', code);

  const startTime = performance.now();
  let rawJson = '';
  try {
    rawJson = await pyodide.runPythonAsync(`
__qa_exec_runner(__user_code_exec)
`);
  } catch (runErr) {
    return {
      success: false,
      stdout: '',
      stderr: '',
      error: {
        type: runErr.name || 'PythonError',
        message: runErr.message || String(runErr),
        traceback: runErr.stack || String(runErr)
      },
      durationMs: 0
    };
  }

  const durationMs = Math.round(performance.now() - startTime);

  try {
    const report = JSON.parse(rawJson);
    report.durationMs = durationMs;
    return report;
  } catch (err) {
    return {
      success: false,
      stdout: '',
      stderr: '',
      error: {
        type: 'RunnerError',
        message: 'Could not parse runner output.',
        traceback: String(rawJson)
      },
      durationMs
    };
  }
}

/**
 * Run a challenge with user solution + automated verification test assertions
 */
export async function verifyPythonChallenge(userCode, testCode = '', testCases = null) {
  const pyodide = await getPyodide();
  if (!pyodide) throw new Error('Python runtime unavailable');

  await ensureHarness(pyodide);
  const testCasesJsonStr = testCases ? JSON.stringify(testCases) : '';

  pyodide.globals.set('__user_code_input', userCode);
  pyodide.globals.set('__test_cases_input', testCasesJsonStr);
  pyodide.globals.set('__raw_test_input', testCode || '');

  const startTime = performance.now();
  let rawJson = '';
  try {
    rawJson = await pyodide.runPythonAsync(`
__qa_test_runner(__user_code_input, __test_cases_input, __raw_test_input)
`);
  } catch (runErr) {
    return {
      success: false,
      runtime_error: {
        type: runErr.name || 'PythonError',
        message: runErr.message || String(runErr),
        traceback: runErr.stack || String(runErr)
      },
      tests: [],
      passed_count: 0,
      total_count: 0,
      stdout: '',
      stderr: '',
      durationMs: 0
    };
  }

  const durationMs = Math.round(performance.now() - startTime);

  try {
    const report = JSON.parse(rawJson);
    report.durationMs = durationMs;
    return report;
  } catch (err) {
    return {
      success: false,
      runtime_error: {
        type: 'RunnerError',
        message: 'Could not parse test runner JSON output.',
        traceback: String(rawJson)
      },
      tests: [],
      passed_count: 0,
      total_count: 0,
      stdout: '',
      stderr: '',
      durationMs
    };
  }
}
