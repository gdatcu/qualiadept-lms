import { describe, it, expect } from 'vitest'
import { highlightJvmCode } from '../../.vitepress/theme/jvmHighlighter.mjs'

describe('jvmHighlighter (Java & Kotlin syntax highlighting)', () => {
  it('correctly highlights Java keywords, types, strings and numbers', () => {
    const code = 'public class Solution {\n    public static boolean isSuccess(int statusCode) {\n        return statusCode >= 200;\n    }\n}'
    const html = highlightJvmCode(code, 'java')

    expect(html).toContain('<span class="tok-keyword">public</span>')
    expect(html).toContain('<span class="tok-keyword">class</span>')
    expect(html).toContain('<span class="tok-type">Solution</span>')
    expect(html).toContain('<span class="tok-keyword">static</span>')
    expect(html).toContain('<span class="tok-keyword">boolean</span>')
    expect(html).toContain('<span class="tok-function">isSuccess</span>')
    expect(html).toContain('<span class="tok-keyword">int</span>')
    expect(html).toContain('<span class="tok-keyword">return</span>')
    expect(html).toContain('<span class="tok-number">200</span>')
  })

  it('correctly highlights Kotlin keywords, fun, val, and string interpolation', () => {
    const code = 'fun format(name: String?): String {\n    val safe = name ?: "UNKNOWN"\n    return "[TEST: $safe]"\n}'
    const html = highlightJvmCode(code, 'kotlin')

    expect(html).toContain('<span class="tok-keyword">fun</span>')
    expect(html).toContain('<span class="tok-function">format</span>')
    expect(html).toContain('<span class="tok-type">String</span>')
    expect(html).toContain('<span class="tok-keyword">val</span>')
    expect(html).toContain('<span class="tok-operator">?:</span>')
    expect(html).toContain('<span class="tok-string">"UNKNOWN"</span>')
    expect(html).toContain('<span class="tok-interpolation">$safe</span>')
  })

  it('handles comments without executing or corrupting code tokens', () => {
    const code = '// This is a comment\nval count = 42 /* block */'
    const html = highlightJvmCode(code, 'kotlin')

    expect(html).toContain('<span class="tok-comment">// This is a comment</span>')
    expect(html).toContain('<span class="tok-comment">/* block */</span>')
    expect(html).toContain('<span class="tok-number">42</span>')
  })
})
