import { describe, it, expect } from 'vitest'
import {
  slugify,
  formatSolutionPythonFile,
  generatePortfolioReadme,
  utf8ToBase64,
  base64ToUtf8
} from '../../.vitepress/theme/githubPortfolio.mjs'

describe('githubPortfolio utility functions', () => {
  it('correctly creates clean slugs for files', () => {
    expect(slugify('Provocarea 1: Curățare Preț')).toBe('provocarea_1_cur_are_pre')
    expect(slugify('py-s1-c1')).toBe('py-s1-c1')
    expect(slugify('Auth Token Extractions!!!')).toBe('auth_token_extractions')
  })

  it('formats python solution file with metadata docstrings', () => {
    const formatted = formatSolutionPythonFile({
      title: 'Cart Price Parser',
      challengeId: 'py-s1-c1',
      code: 'def parse(x): return float(x)',
      sessionTitle: 'Session 1'
    })

    expect(formatted).toContain('QualiAdept LMS - Python for QA Automation Portfolio')
    expect(formatted).toContain('Challenge : Cart Price Parser')
    expect(formatted).toContain('Challenge ID: py-s1-c1')
    expect(formatted).toContain('Status    : PASSED')
    expect(formatted).toContain('def parse(x): return float(x)')
  })

  it('generates a recruiter-ready README with badges and table', () => {
    const readme = generatePortfolioReadme({
      username: 'studentqa',
      completedChallenges: [
        { challengeId: 'py-s1-c1', title: 'Cart Parser', sessionNumber: 1, completedAt: '2026-10-11' }
      ]
    })

    expect(readme).toContain('# 🐍 Python Test Automation Portfolio')
    expect(readme).toContain('studentqa')
    expect(readme).toContain('QualiAdept-Certified_QA_Automation')
    expect(readme).toContain('| 1 | [Cart Parser](sessions/session-01/py-s1-c1.py) | Session 1 | `PASSED` | 2026-10-11 |')
  })

  it('handles safe base64 utf-8 encoding/decoding without corruption', () => {
    const testString = 'def verifică_preț(): return "100 lei & diacritice: ș, ț, â"'
    const encoded = utf8ToBase64(testString)
    const decoded = base64ToUtf8(encoded)
    expect(decoded).toBe(testString)
  })
})
