import { describe, it, expect, beforeEach } from 'vitest'
import {
  resolveChallengeId,
  saveChallengeCode,
  loadChallengeCode,
  resetChallengeCode,
  isChallengeCompleted,
  markChallengeCompleted,
  exportProgressData,
  importProgressData,
  getStoredProgressStats
} from '../../.vitepress/theme/challengeProgress.mjs'

describe('challengeProgress engine', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('resolves deterministic challenge IDs', () => {
    expect(resolveChallengeId('py-s1-c1')).toBe('py-s1-c1')
    expect(resolveChallengeId('', 'Variabile & Tipuri', '/ro/sessions/python-for-testing/session-1')).toContain('chal_')
  })

  it('saves, loads, and resets user code', () => {
    const id = 'test-challenge-1'
    expect(loadChallengeCode(id, 'default')).toBe('default')

    saveChallengeCode(id, 'print("Hello world")')
    expect(loadChallengeCode(id, 'default')).toBe('print("Hello world")')

    resetChallengeCode(id)
    expect(loadChallengeCode(id, 'default')).toBe('default')
  })

  it('marks challenge completed and updates stats', () => {
    const id = 'challenge-vars'
    expect(isChallengeCompleted(id)).toBe(false)

    markChallengeCompleted(id, { code: 'x = 10', durationMs: 42, title: 'Variables' })

    expect(isChallengeCompleted(id)).toBe(true)
    const stats = getStoredProgressStats(10)
    expect(stats.completed).toBe(1)
    expect(stats.percentage).toBe(10)
  })

  it('exports and imports progress seamlessly for cross-device sync', () => {
    markChallengeCompleted('chal-1', { code: 'code1' })
    markChallengeCompleted('chal-2', { code: 'code2' })

    const exported = exportProgressData()
    expect(exported.completedChallenges['chal-1']).toBeDefined()
    expect(exported.completedChallenges['chal-2']).toBeDefined()
    expect(exported.codeSnippets['chal-1']).toBe('code1')

    // Clear and restore
    localStorage.clear()
    expect(isChallengeCompleted('chal-1')).toBe(false)

    const success = importProgressData(exported)
    expect(success).toBe(true)
    expect(isChallengeCompleted('chal-1')).toBe(true)
    expect(isChallengeCompleted('chal-2')).toBe(true)
    expect(loadChallengeCode('chal-1')).toBe('code1')
  })
})
