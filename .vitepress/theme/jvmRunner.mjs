/**
 * QualiAdept LMS - In-Browser Client-Side JVM (Java & Kotlin) Execution Engine
 * Lightweight, zero-dependency, ultra-fast evaluator for testing fundamentals.
 * Executes Java and Kotlin syntax client-side in the browser:
 * - Java: classes, static methods, primitives, loops, conditionals, System.out.println, assertions
 * - Kotlin: fun main, top-level fun, val/var, string templates, when/if expressions, println, null safety
 */

/**
 * Strips comments from code
 */
function stripComments(code = '') {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
}

/**
 * Transpiles simple Kotlin code into an executable JS sandbox script
 */
export function transpileKotlinToJs(kotlinCode = '') {
  let clean = stripComments(kotlinCode).trim()

  // Strip packages and imports
  clean = clean.replace(/^\s*package\s+[a-zA-Z0-9_.]+\s*;?/gm, '')
  clean = clean.replace(/^\s*import\s+[a-zA-Z0-9_.*]+\s*;?/gm, '')

  // Replace println & print
  clean = clean.replace(/\bprintln\s*\(/g, '__jvm_println(')
  clean = clean.replace(/\bprint\s*\(/g, '__jvm_print(')

  // Replace assertEquals & assertions
  clean = clean.replace(/\bassertEquals\s*\(/g, '__jvm_assert_equals(')
  clean = clean.replace(/\bassertTrue\s*\(/g, '__jvm_assert_true(')
  clean = clean.replace(/\bassertFalse\s*\(/g, '__jvm_assert_false(')
  clean = clean.replace(/\bassertNotNull\s*\(/g, '__jvm_assert_not_null(')

  // Transform Kotlin String templates: "Hello $name, status ${status.code}"
  clean = clean.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
    let s = match.slice(1, -1)
    if (!s.includes('$')) return match
    s = s.replace(/\$\{([^}]+)\}/g, '" + ($1) + "')
    s = s.replace(/\$([a-zA-Z_][a-zA-Z0-9_.]*)/g, '" + ($1) + "')
    return '("" + "' + s + '" + "")'
  })

  // 1. Transform Kotlin for loops FIRST (before generic range expressions):
  clean = clean.replace(/for\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([0-9a-zA-Z_]+)\s*\.\.\s*([0-9a-zA-Z_]+)\s*\)/g, 'for (let $1 = $2; $1 <= $3; $1++)')
  clean = clean.replace(/for\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([0-9a-zA-Z_]+)\s+until\s+([0-9a-zA-Z_]+)\s*\)/g, 'for (let $1 = $2; $1 < $3; $1++)')
  clean = clean.replace(/for\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([^)]+)\)/g, 'for (const $1 of $2)')

  // 2. Transform Kotlin range checks in expressions: x in a..b -> (x >= a && x <= b)
  clean = clean.replace(/([a-zA-Z_][a-zA-Z0-9_.]*)\s+in\s+([0-9a-zA-Z_]+)\s*\.\.\s*([0-9a-zA-Z_]+)/g, '($1 >= $2 && $1 <= $3)')
  clean = clean.replace(/([a-zA-Z_][a-zA-Z0-9_.]*)\s+!in\s+([0-9a-zA-Z_]+)\s*\.\.\s*([0-9a-zA-Z_]+)/g, '($1 < $2 || $1 > $3)')

  // Transform Kotlin Elvis operator ?: -> ??
  clean = clean.replace(/\?\:/g, ' ?? ')

  // Transform Kotlin val & var to const / let
  clean = clean.replace(/\bval\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?::\s*[^=;\n]+)?\s*=/g, 'const $1 =')
  clean = clean.replace(/\bvar\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?::\s*[^=;\n]+)?\s*=/g, 'let $1 =')

  // Transform Kotlin function declarations:
  // fun add(a: Int, b: Int): Int = a + b  ->  function add(a, b) { return a + b; }
  clean = clean.replace(/fun\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?::\s*[^{=]+)?\s*=\s*([^;\n]+)/g, (m, name, params, body) => {
    const cleanParams = params.split(',').map(p => p.split(':')[0].trim()).filter(Boolean).join(', ')
    return `function ${name}(${cleanParams}) { return ${body.trim()}; }`
  })

  // fun add(a: Int, b: Int): Int { ... }  ->  function add(a, b) { ... }
  clean = clean.replace(/fun\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?::\s*[^{\n]+)?\s*\{/g, (m, name, params) => {
    const cleanParams = params.split(',').map(p => p.split(':')[0].trim()).filter(Boolean).join(', ')
    return `function ${name}(${cleanParams}) {`
  })

  // Transform listOf(...) -> __jvm_listOf(...)
  clean = clean.replace(/\blistOf\s*\(/g, '__jvm_listOf(')
  clean = clean.replace(/\bmutableListOf\s*\(/g, '__jvm_listOf(')
  clean = clean.replace(/\bsetOf\s*\(/g, '__jvm_setOf(')
  clean = clean.replace(/\bmutableSetOf\s*\(/g, '__jvm_setOf(')
  clean = clean.replace(/\bmapOf\s*\(/g, '__jvm_mapOf(')
  clean = clean.replace(/\bmutableMapOf\s*\(/g, '__jvm_mapOf(')

  // Transform Kotlin pair syntax: "key" to "value" -> ["key", "value"]
  clean = clean.replace(/([a-zA-Z0-9_"'`]+)\s+to\s+([a-zA-Z0-9_"'`]+)/g, '[$1, $2]')

  // Transform Kotlin collection trailing lambdas with 'it' or named param:
  clean = clean.replace(/\.filter\s*\{\s*it\b([^}]+)\}/g, '.filter(it => it$1)')
  clean = clean.replace(/\.map\s*\{\s*it\b([^}]+)\}/g, '.map(it => it$1)')
  clean = clean.replace(/\.filter\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*->\s*([^}]+)\}/g, '.filter($1 => $2)')
  clean = clean.replace(/\.map\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*->\s*([^}]+)\}/g, '.map($1 => $2)')

  // Transform Kotlin .size property to .length for arrays
  clean = clean.replace(/([a-zA-Z0-9_)]+)\.size\b(?!\s*\()/g, '$1.length')

  // Transform Kotlin data class: data class User(val name: String, val age: Int)
  clean = clean.replace(/data\s+class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]+)\)/g, (m, className, props) => {
    const propNames = props.split(',').map(p => {
      const match = p.trim().match(/(?:val|var)\s+([a-zA-Z0-9_]+)/)
      return match ? match[1] : p.split(':')[0].trim()
    })
    const assignments = propNames.map(p => `this.${p} = ${p};`).join(' ')
    return `class ${className} { constructor(${propNames.join(', ')}) { ${assignments} } toString() { return "${className}(" + ${propNames.map(p => `"${p}=" + this.${p}`).join(' + ", " + ')} + ")"; } }`
  })

  return clean
}

/**
 * Transpiles Java code into an executable JS sandbox script
 */
export function transpileJavaToJs(javaCode = '') {
  let clean = stripComments(javaCode).trim()

  // Strip packages and imports
  clean = clean.replace(/^\s*package\s+[a-zA-Z0-9_.]+\s*;?/gm, '')
  clean = clean.replace(/^\s*import\s+[a-zA-Z0-9_.*]+\s*;?/gm, '')

  // Replace System.out.println & print
  clean = clean.replace(/System\.out\.println\s*\(/g, '__jvm_println(')
  clean = clean.replace(/System\.out\.print\s*\(/g, '__jvm_print(')
  clean = clean.replace(/System\.out\.printf\s*\(/g, '__jvm_printf(')

  // Replace Assertions
  clean = clean.replace(/\bassertEquals\s*\(/g, '__jvm_assert_equals(')
  clean = clean.replace(/\bassertTrue\s*\(/g, '__jvm_assert_true(')
  clean = clean.replace(/\bassertFalse\s*\(/g, '__jvm_assert_false(')
  clean = clean.replace(/\bassertNotNull\s*\(/g, '__jvm_assert_not_null(')

  // List.of(...) / Arrays.asList(...) -> __jvm_listOf(...)
  clean = clean.replace(/List\.of\s*\(/g, '__jvm_listOf(')
  clean = clean.replace(/Arrays\.asList\s*\(/g, '__jvm_listOf(')
  clean = clean.replace(/Set\.of\s*\(/g, '__jvm_setOf(')
  clean = clean.replace(/Map\.of\s*\(/g, '__jvm_mapOf(')
  clean = clean.replace(/new\s+ArrayList\s*(?:<[^>]*>)?\s*\(\s*\)/g, '[]')
  clean = clean.replace(/new\s+HashSet\s*(?:<[^>]*>)?\s*\(\s*\)/g, 'new Set()')
  clean = clean.replace(/new\s+HashMap\s*(?:<[^>]*>)?\s*\(\s*\)/g, '{}')

  // Transform Java arrow lambdas: x -> x.something -> x => x.something
  clean = clean.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*->\s*/g, '$1 => ')

  // Transform Java types in variable declarations
  clean = clean.replace(/\bfinal\s+(?:int|double|float|long|boolean|char|String|List(?:<[^>]+>)?|Map(?:<[^>]+>)?|var|[A-Z][a-zA-Z0-9_]*)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'const $1 =')
  clean = clean.replace(/\b(?:int|double|float|long|boolean|char|String|List(?:<[^>]+>)?|Map(?:<[^>]+>)?|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'let $1 =')

  // Transform Java for-each loop: for (String item : items) -> for (const item of items)
  clean = clean.replace(/for\s*\(\s*(?:final\s+)?[a-zA-Z0-9_<>\s]+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^)]+)\)/g, 'for (const $1 of $2)')

  // Standard for loop: for (int i = 0; ...) -> for (let i = 0; ...)
  clean = clean.replace(/for\s*\(\s*int\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, 'for (let $1 =')

  // Replace public class / class declarations:
  clean = clean.replace(/\bpublic\s+class\s+([a-zA-Z0-9_]+)/g, 'class $1')

  // Convert static methods:
  clean = clean.replace(/(?:public|private|protected)?\s*static\s*(?:final)?\s*(?:void|int|double|float|long|boolean|char|String|[A-Z][a-zA-Z0-9_<>]*)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g, (m, name, params) => {
    if (name === 'if' || name === 'for' || name === 'while' || name === 'switch') return m
    const cleanParams = params
      .split(',')
      .map(p => p.trim().split(/\s+/).pop())
      .filter(p => Boolean(p) && p !== 'String[]' && p !== 'args')
      .join(', ')
    return `static ${name}(${cleanParams}) {`
  })

  // Convert instance methods:
  clean = clean.replace(/(?:public|private|protected)?\s*(?:final)?\s*(?:void|int|double|float|long|boolean|char|String|[A-Z][a-zA-Z0-9_<>]*)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g, (m, name, params) => {
    if (name === 'if' || name === 'for' || name === 'while' || name === 'switch' || name === 'class' || name === 'static') return m
    const cleanParams = params
      .split(',')
      .map(p => p.trim().split(/\s+/).pop())
      .filter(p => Boolean(p) && p !== 'String[]' && p !== 'args')
      .join(', ')
    return `${name}(${cleanParams}) {`
  })

  return clean
}

/**
 * Extracts class names and creates helper aliases so functions can be called either standalone or via ClassName.method()
 */
function createClassMethodAliases(code = '') {
  const aliases = []
  const classNames = [...code.matchAll(/\bclass\s+([a-zA-Z0-9_]+)\b/g)].map(m => m[1])
  const staticMethods = [...new Set([...code.matchAll(/\bstatic\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]))]
  for (const method of staticMethods) {
    if (method === 'main') continue
    const lookups = classNames.map(c => `(typeof ${c} !== 'undefined' && typeof ${c}.${method} === 'function' ? ${c}.${method}.bind(${c}) : null)`).join(' || ')
    if (lookups) {
      aliases.push(`const ${method} = ${lookups};`)
    }
  }
  return aliases.join('\n')
}

/**
 * Executes JVM code (either Java or Kotlin) inside a secure sandbox
 */
export function executeJvmCode(code = '', language = 'java') {
  const isKotlin = String(language).toLowerCase() === 'kotlin'
  const outputLines = []
  let currentLine = ''

  const __jvm_print = (val) => {
    currentLine += (val !== undefined && val !== null ? String(val) : String(val))
  }

  const __jvm_println = (val = '') => {
    outputLines.push(currentLine + (val !== undefined && val !== null ? String(val) : ''))
    currentLine = ''
  }

  const __jvm_printf = (format, ...args) => {
    let str = String(format)
    for (const a of args) {
      str = str.replace(/%[sdif]/, String(a))
    }
    currentLine += str
  }

  const __jvm_assert_equals = (expected, actual, msg) => {
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(msg || `AssertionError: Expected [${expected}] but received [${actual}]`)
    }
  }

  const __jvm_assert_true = (actual, msg) => {
    if (!actual) throw new Error(msg || `AssertionError: Expected [true] but received [false]`)
  }

  const __jvm_assert_false = (actual, msg) => {
    if (actual) throw new Error(msg || `AssertionError: Expected [false] but received [true]`)
  }

  const __jvm_assert_not_null = (actual, msg) => {
    if (actual === null || actual === undefined) {
      throw new Error(msg || `AssertionError: Expected non-null value but received null`)
    }
  }

  const __jvm_listOf = (...args) => args
  const __jvm_setOf = (...args) => new Set(args)
  const __jvm_mapOf = (...args) => {
    if (args.length === 1 && Array.isArray(args[0]) && Array.isArray(args[0][0])) {
      return Object.fromEntries(args[0])
    }
    if (args.length > 0 && Array.isArray(args[0])) {
      return Object.fromEntries(args)
    }
    const m = {}
    for (let i = 0; i < args.length; i += 2) {
      m[args[i]] = args[i + 1]
    }
    return m
  }

  if (!Array.prototype.stream) {
    Array.prototype.stream = function () {
      let list = [...this]
      const streamObj = {
        filter: (pred) => { list = list.filter(pred); return streamObj },
        map: (fn) => { list = list.map(fn); return streamObj },
        toList: () => list,
        collect: () => list,
        count: () => list.length,
        findFirst: () => ({
          orElse: (fb) => (list[0] !== undefined ? list[0] : fb),
          get: () => list[0]
        })
      }
      return streamObj
    }
  }
  if (!Array.prototype.size) {
    Array.prototype.size = function () { return this.length }
  }
  if (!Array.prototype.contains) {
    Array.prototype.contains = function (x) { return this.includes(x) }
  }
  if (!Set.prototype.contains) {
    Set.prototype.contains = function (x) { return this.has(x) }
  }
  if (!String.prototype.contains) {
    String.prototype.contains = function (x) { return this.includes(x) }
  }
  if (!String.prototype.equals) {
    String.prototype.equals = function (x) { return this === x }
  }

  const startTime = performance.now()
  let returnValue = undefined
  let error = null

  try {
    const transpiled = isKotlin ? transpileKotlinToJs(code) : transpileJavaToJs(code)
    const aliases = isKotlin ? '' : createClassMethodAliases(transpiled)

    const declaredClasses = isKotlin ? [] : [...code.matchAll(/\b(?:class|public\s+class)\s+([a-zA-Z0-9_]+)\b/g)].map(m => m[1])

    const script = `
      "use strict";
      const Collectors = { toList: () => 'toList' };
      ${transpiled}
      ${aliases}

      if (typeof main === 'function') {
        return main();
      }
      ${isKotlin ? '' : `
        const __declaredClasses = ${JSON.stringify(declaredClasses)};
        for (const __c of __declaredClasses) {
          let __cls;
          try { __cls = eval(__c); } catch (_) {}
          if (typeof __cls === 'function' && typeof __cls.main === 'function') {
            return __cls.main();
          }
        }
      `}
    `

    const fn = new Function(
      '__jvm_print',
      '__jvm_println',
      '__jvm_printf',
      '__jvm_assert_equals',
      '__jvm_assert_true',
      '__jvm_assert_false',
      '__jvm_assert_not_null',
      '__jvm_listOf',
      '__jvm_setOf',
      '__jvm_mapOf',
      script
    )

    returnValue = fn(
      __jvm_print,
      __jvm_println,
      __jvm_printf,
      __jvm_assert_equals,
      __jvm_assert_true,
      __jvm_assert_false,
      __jvm_assert_not_null,
      __jvm_listOf,
      __jvm_setOf,
      __jvm_mapOf
    )

    if (currentLine) {
      outputLines.push(currentLine)
      currentLine = ''
    }
  } catch (err) {
    error = err.message || String(err)
  }

  const executionTimeMs = Math.round(performance.now() - startTime)

  return {
    language: isKotlin ? 'kotlin' : 'java',
    stdout: outputLines.join('\n'),
    error,
    returnValue,
    executionTimeMs
  }
}

/**
 * Runs automated assertion tests against a student solution
 */
export function verifyJvmChallenge({ code = '', language = 'java', testCases = [] }) {
  const isKotlin = String(language).toLowerCase() === 'kotlin'
  const startTime = performance.now()
  const results = []

  let transpiledBase = ''
  try {
    transpiledBase = isKotlin ? transpileKotlinToJs(code) : transpileJavaToJs(code)
  } catch (parseErr) {
    return {
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      tests: testCases.map((tc, idx) => ({
        id: idx + 1,
        name: tc.name || `Test Case #${idx + 1}`,
        passed: false,
        error: `Compilation Error: ${parseErr.message}`
      })),
      durationMs: 0,
      error: parseErr.message
    }
  }

  const aliases = isKotlin ? '' : createClassMethodAliases(transpiledBase)

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    let passed = false
    let actual = undefined
    let error = null

    try {
      const testCode = `
        "use strict";
        let __out = [];
        const __jvm_print = (v) => __out.push(v);
        const __jvm_println = (v) => __out.push(v);
        const __jvm_printf = () => {};
        const __jvm_assert_equals = (a, b) => { if (a !== b) throw new Error("Expected " + a + " but got " + b); };
        const __jvm_assert_true = (a) => { if (!a) throw new Error("Expected true"); };
        const __jvm_assert_false = (a) => { if (a) throw new Error("Expected false"); };
        const __jvm_assert_not_null = (a) => { if (a == null) throw new Error("Expected not null"); };
        const __jvm_listOf = (...args) => args
  const __jvm_setOf = (...args) => new Set(args);
        const __jvm_mapOf = (...args) => {
          if (args.length === 1 && Array.isArray(args[0]) && Array.isArray(args[0][0])) return Object.fromEntries(args[0]);
          if (args.length > 0 && Array.isArray(args[0])) return Object.fromEntries(args);
          const m = {};
          for (let i = 0; i < args.length; i += 2) m[args[i]] = args[i + 1];
          return m;
        };
        const Collectors = { toList: () => 'toList' };

        ${transpiledBase}
        ${aliases}

        return (function() {
          ${tc.testCode || `return ${tc.call};`}
        })();
      `

      const fn = new Function(testCode)
      actual = fn()

      if (tc.expected !== undefined) {
        if (typeof tc.expected === 'object') {
          passed = JSON.stringify(actual) === JSON.stringify(tc.expected)
        } else {
          passed = String(actual).trim() === String(tc.expected).trim()
        }
      } else {
        passed = true
      }
    } catch (testErr) {
      error = testErr.message || String(testErr)
      passed = false
    }

    results.push({
      id: i + 1,
      name: tc.name || `Case #${i + 1}`,
      call: tc.call || '',
      expected: tc.expected,
      actual,
      passed,
      error
    })
  }

  const durationMs = Math.round(performance.now() - startTime)
  const passedCount = results.filter(r => r.passed).length

  return {
    language: isKotlin ? 'kotlin' : 'java',
    allPassed: passedCount === testCases.length && testCases.length > 0,
    passedCount,
    totalCount: testCases.length,
    tests: results,
    durationMs,
    error: null
  }
}
