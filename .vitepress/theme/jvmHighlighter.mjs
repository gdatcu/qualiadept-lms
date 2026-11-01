/**
 * QualiAdept LMS - JVM (Java & Kotlin) Real-time Syntax Highlighter
 * Tokenizes and converts Java and Kotlin code into syntax-colored HTML spans.
 */

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
  'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
  'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof',
  'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected',
  'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized',
  'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while', 'record',
  'var', 'yield', 'sealed', 'permits', 'non-sealed'
])

const KOTLIN_KEYWORDS = new Set([
  'as', 'break', 'class', 'continue', 'do', 'else', 'false', 'for', 'fun', 'if',
  'in', 'interface', 'is', 'null', 'object', 'package', 'return', 'super', 'this',
  'throw', 'true', 'try', 'typealias', 'val', 'var', 'when', 'while', 'by', 'catch',
  'constructor', 'delegate', 'dynamic', 'field', 'file', 'finally', 'get', 'import',
  'init', 'param', 'property', 'receiver', 'set', 'setparam', 'where', 'actual',
  'abstract', 'annotation', 'companion', 'const', 'crossinline', 'data', 'enum',
  'expect', 'external', 'final', 'infix', 'inline', 'inner', 'internal', 'lateinit',
  'noinline', 'open', 'operator', 'out', 'override', 'private', 'protected', 'public',
  'reified', 'sealed', 'suspend', 'tailrec', 'vararg', 'it'
])

const BUILTIN_TYPES = new Set([
  'String', 'Int', 'Boolean', 'Double', 'Float', 'Long', 'Short', 'Byte', 'Char',
  'Unit', 'Any', 'Nothing', 'Array', 'List', 'Set', 'Map', 'Collection', 'Iterable',
  'ArrayList', 'HashSet', 'HashMap', 'LinkedHashMap', 'LinkedHashSet', 'Arrays',
  'Collections', 'System', 'Integer', 'Object', 'Optional', 'Stream', 'Character',
  'StringBuilder', 'StringBuffer', 'Exception', 'RuntimeException', 'Throwable'
])

/**
 * Tokenize and format JVM code into styled HTML
 */
export function highlightJvmCode(code = '', language = 'java') {
  if (!code) return ''

  const isKotlin = String(language).toLowerCase() === 'kotlin'
  const keywords = isKotlin ? KOTLIN_KEYWORDS : JAVA_KEYWORDS

  // Comprehensive tokenizer regex
  // 1: Multi-line comment
  // 2: Single-line comment
  // 3: Kotlin triple-quoted string
  // 4: Regular double-quoted string
  // 5: Single-quoted char
  // 6: Annotation
  // 7: Number
  // 8: Word / Identifier
  // 9: Operators & punctuation
  const tokenRegex = /(\/\*[\s\S]*?\*\/)|(\/\/[^\n]*)|("""[\s\S]*?""")|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(@[A-Za-z0-9_]+)|(\b\d+(?:\.\d+)?[fFlLdD]?\b)|([A-Za-z_][A-Za-z0-9_]*)|(->|::|\?:|\+\+|--|&&|\|\||==|!=|<=|>=|[+\-*/%=<>!&|^~?:;.,()[\]{}])/g

  let result = ''
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(code)) !== null) {
    // Plain text before token (whitespace, newlines, etc.)
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }
    lastIndex = tokenRegex.lastIndex

    const [
      token,
      multiComment,
      singleComment,
      tripleString,
      doubleString,
      charLiteral,
      annotation,
      numberLiteral,
      identifier,
      operator
    ] = match

    if (multiComment || singleComment) {
      result += `<span class="tok-comment">${escapeHtml(token)}</span>`
    } else if (tripleString || doubleString || charLiteral) {
      // In Kotlin strings, highlight interpolated variables ${expr} or $var
      if (isKotlin && (doubleString || tripleString)) {
        const highlightedStr = highlightKotlinStringInterpolation(token)
        result += `<span class="tok-string">${highlightedStr}</span>`
      } else {
        result += `<span class="tok-string">${escapeHtml(token)}</span>`
      }
    } else if (annotation) {
      result += `<span class="tok-annotation">${escapeHtml(token)}</span>`
    } else if (numberLiteral) {
      result += `<span class="tok-number">${escapeHtml(token)}</span>`
    } else if (identifier) {
      if (token === 'true' || token === 'false' || token === 'null') {
        result += `<span class="tok-boolean">${escapeHtml(token)}</span>`
      } else if (keywords.has(token)) {
        result += `<span class="tok-keyword">${escapeHtml(token)}</span>`
      } else if (BUILTIN_TYPES.has(token) || /^[A-Z][A-Za-z0-9_]*$/.test(token)) {
        result += `<span class="tok-type">${escapeHtml(token)}</span>`
      } else {
        // Peek ahead to check if followed by `(` -> function call
        const rest = code.slice(tokenRegex.lastIndex)
        if (/^\s*\(/.test(rest)) {
          result += `<span class="tok-function">${escapeHtml(token)}</span>`
        } else {
          result += `<span class="tok-variable">${escapeHtml(token)}</span>`
        }
      }
    } else if (operator) {
      result += `<span class="tok-operator">${escapeHtml(token)}</span>`
    } else {
      result += escapeHtml(token)
    }
  }

  // Trailing text
  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  // Ensure trailing newline renders properly in <pre>
  if (code.endsWith('\n')) {
    result += ' '
  }

  return result
}

function highlightKotlinStringInterpolation(rawString) {
  // Finds ${...} or $identifier
  const parts = []
  let last = 0
  const interpRegex = /(\$\{[^}]+\})|(\$[A-Za-z_][A-Za-z0-9_]*)/g
  let m

  while ((m = interpRegex.exec(rawString)) !== null) {
    if (m.index > last) {
      parts.push(escapeHtml(rawString.slice(last, m.index)))
    }
    last = interpRegex.lastIndex
    parts.push(`<span class="tok-interpolation">${escapeHtml(m[0])}</span>`)
  }

  if (last < rawString.length) {
    parts.push(escapeHtml(rawString.slice(last)))
  }

  return parts.join('')
}

