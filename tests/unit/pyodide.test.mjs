import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executePython, verifyPythonChallenge, _resetPyodideInstanceForTesting } from '../../.vitepress/theme/pyodide.mjs'

describe('Pyodide Utility & Browser Runner', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    _resetPyodideInstanceForTesting()
  })

  it('handles execution and captures stdout cleanly', async () => {
    const mockReport = JSON.stringify({
      success: true,
      stdout: 'Hello QA\n',
      stderr: '',
      error: null
    })

    const mockPyodide = {
      globals: {
        get: vi.fn().mockReturnValue(true),
        set: vi.fn()
      },
      runPythonAsync: vi.fn().mockResolvedValue(mockReport)
    }

    global.window = global.window || {}
    global.window.loadPyodide = vi.fn().mockResolvedValue(mockPyodide)

    const result = await executePython('print("Hello QA")')
    expect(result.success).toBe(true)
    expect(result.stdout).toBe('Hello QA\n')
    expect(typeof result.durationMs).toBe('number')
  })

  it('captures syntax/runtime errors and details cleanly', async () => {
    const mockReport = JSON.stringify({
      success: false,
      stdout: '',
      stderr: '',
      error: {
        type: 'SyntaxError',
        message: 'invalid syntax',
        traceback: 'Traceback: line 1\nSyntaxError: invalid syntax'
      }
    })

    const mockPyodide = {
      globals: {
        get: vi.fn().mockReturnValue(true),
        set: vi.fn()
      },
      runPythonAsync: vi.fn().mockResolvedValue(mockReport)
    }

    global.window = global.window || {}
    global.window.loadPyodide = vi.fn().mockResolvedValue(mockPyodide)

    const result = await executePython('def invalid(')
    expect(result.success).toBe(false)
    expect(result.error.type).toBe('SyntaxError')
    expect(result.error.message).toContain('invalid syntax')
  })

  it('runs challenge validation harness with structured test cases and detects passed tests', async () => {
    const mockReport = JSON.stringify({
      success: true,
      runtime_error: null,
      tests: [
        { id: 1, name: 'Test 1', call: 'add(1, 2)', expected: 3, actual: 3, passed: true, error: null }
      ],
      passed_count: 1,
      total_count: 1,
      stdout: '',
      stderr: ''
    })

    const mockPyodide = {
      globals: {
        get: vi.fn().mockReturnValue(true),
        set: vi.fn()
      },
      runPythonAsync: vi.fn().mockResolvedValue(mockReport)
    }

    global.window = global.window || {}
    global.window.loadPyodide = vi.fn().mockResolvedValue(mockPyodide)

    const testCases = [{ name: 'Test 1', call: 'add(1, 2)', expected: 3 }]
    const result = await verifyPythonChallenge('def add(a, b): return a + b', '', testCases)
    expect(result.success).toBe(true)
    expect(result.passed_count).toBe(1)
    expect(result.tests[0].passed).toBe(true)
    expect(result.tests[0].actual).toBe(3)
  })

  it('reports granular failure with expected vs actual values when assertions fail', async () => {
    const mockReport = JSON.stringify({
      success: false,
      runtime_error: null,
      tests: [
        { id: 1, name: 'Test 1', call: 'add(1, 2)', expected: 5, actual: 3, passed: false, error: "Așteptat 5, dar s-a primit 3" }
      ],
      passed_count: 0,
      total_count: 1,
      stdout: '',
      stderr: ''
    })

    const mockPyodide = {
      globals: {
        get: vi.fn().mockReturnValue(true),
        set: vi.fn()
      },
      runPythonAsync: vi.fn().mockResolvedValue(mockReport)
    }

    global.window = global.window || {}
    global.window.loadPyodide = vi.fn().mockResolvedValue(mockPyodide)

    const testCases = [{ name: 'Test 1', call: 'add(1, 2)', expected: 5 }]
    const result = await verifyPythonChallenge('def add(a, b): return a + b', '', testCases)
    expect(result.success).toBe(false)
    expect(result.passed_count).toBe(0)
    expect(result.tests[0].passed).toBe(false)
    expect(result.tests[0].expected).toBe(5)
    expect(result.tests[0].actual).toBe(3)
    expect(result.tests[0].error).toContain('Așteptat 5')
  })
})
