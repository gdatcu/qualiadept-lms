/**
 * QualiAdept LMS - Challenge Progress & Solution Persistence Engine
 * Combines:
 * 1. Local-First (localStorage autosave, instant restore, offline-first)
 * 2. Anonymous / Authenticated Cloud Telemetry (Supabase sync via visitor ID & Kinde)
 * 3. Cross-Device Backup (Export & Import JSON / sync token)
 */

import { getVisitorIdentifier, getSupabaseClient } from './supabase.mjs'

const CODE_PREFIX = 'qa_py_code_'
const STATUS_PREFIX = 'qa_py_status_'
const CENTRAL_PROGRESS_KEY = 'qa_python_progress'

/**
 * Returns a deterministic challenge ID from explicit prop or title/path
 */
export function resolveChallengeId(explicitId, title = '', path = '') {
  if (explicitId && typeof explicitId === 'string' && explicitId.trim()) {
    return explicitId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
  }
  const source = `${path}_${title}`.trim().toLowerCase()
  return 'chal_' + source.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 48)
}

/**
 * 1. Local-First: Save code to localStorage (debounced helper)
 */
export function saveChallengeCode(challengeId, code) {
  if (typeof window === 'undefined' || !challengeId) return
  try {
    localStorage.setItem(CODE_PREFIX + challengeId, code)
  } catch (e) {
    console.warn('[Progress] Could not save code to localStorage:', e)
  }
}

/**
 * 1. Local-First: Load saved code or return initial fallback
 */
export function loadChallengeCode(challengeId, fallback = '') {
  if (typeof window === 'undefined' || !challengeId) return fallback
  try {
    const saved = localStorage.getItem(CODE_PREFIX + challengeId)
    return saved !== null ? saved : fallback
  } catch (e) {
    return fallback
  }
}

/**
 * 1. Local-First: Reset code for a specific challenge
 */
export function resetChallengeCode(challengeId) {
  if (typeof window === 'undefined' || !challengeId) return
  try {
    localStorage.removeItem(CODE_PREFIX + challengeId)
  } catch (e) {}
}

/**
 * 1. Local-First: Check if a challenge is completed
 */
export function isChallengeCompleted(challengeId) {
  if (typeof window === 'undefined' || !challengeId) return false
  try {
    const raw = localStorage.getItem(STATUS_PREFIX + challengeId)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed?.passed)
  } catch (e) {
    return false
  }
}

/**
 * 1. Local-First: Mark challenge as completed and update central registry
 */
export function markChallengeCompleted(challengeId, { code = '', durationMs = 0, title = '' } = {}) {
  if (typeof window === 'undefined' || !challengeId) return null
  const payload = {
    passed: true,
    completedAt: new Date().toISOString(),
    durationMs,
    title
  }

  try {
    // 1. Save specific status
    localStorage.setItem(STATUS_PREFIX + challengeId, JSON.stringify(payload))
    if (code) {
      localStorage.setItem(CODE_PREFIX + challengeId, code)
    }

    // 2. Update central progress registry
    let central = {}
    try {
      const raw = localStorage.getItem(CENTRAL_PROGRESS_KEY)
      if (raw) central = JSON.parse(raw)
    } catch (_) {}

    central[challengeId] = payload
    localStorage.setItem(CENTRAL_PROGRESS_KEY, JSON.stringify(central))

    // 3. Dispatch global browser event for instant UI reactivity across components
    window.dispatchEvent(new CustomEvent('qualiadept-progress-updated', {
      detail: { challengeId, ...payload }
    }))
  } catch (e) {
    console.warn('[Progress] Failed to save completion to localStorage:', e)
  }

  // 2. Fire-and-forget Cloud Sync (Supabase)
  syncProgressToSupabase({ challengeId, passed: true, code, title, durationMs }).catch(() => {})

  return payload
}

/**
 * 2. Cloud Telemetry & Visitor Sync (Supabase)
 * Fire-and-forget: never blocks UI, captures anonymous visitor ID or Kinde user
 */
export async function syncProgressToSupabase({ challengeId, passed, code, title, durationMs }) {
  if (typeof window === 'undefined') return
  const client = getSupabaseClient()
  if (!client) return // Local-only mode if Supabase not configured

  try {
    const visitorId = getVisitorIdentifier()
    let userEmail = null

    try {
      const authUserRaw = sessionStorage.getItem('qualiadept_user')
      if (authUserRaw) {
        const u = JSON.parse(authUserRaw)
        userEmail = u?.email || null
      }
    } catch (_) {}

    // Upsert into challenge_progress table
    await client
      .from('challenge_progress')
      .upsert({
        challenge_id: challengeId,
        visitor_id: visitorId,
        user_email: userEmail,
        status: passed ? 'completed' : 'in_progress',
        code_snippet: code ? code.slice(0, 4000) : null,
        title: title || challengeId,
        duration_ms: durationMs || 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'visitor_id,challenge_id' })
  } catch (err) {
    // Graceful silent fallback to keep offline / zero-network fully functional
  }
}

/**
 * 3. Cross-Device Backup: Export full progress as JSON string or file
 */
export function exportProgressData() {
  if (typeof window === 'undefined') return null

  let completedChallenges = {}
  let codeSnippets = {}

  try {
    const centralRaw = localStorage.getItem(CENTRAL_PROGRESS_KEY)
    if (centralRaw) completedChallenges = JSON.parse(centralRaw)

    // Collect all saved challenge code
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CODE_PREFIX)) {
        const id = key.replace(CODE_PREFIX, '')
        codeSnippets[id] = localStorage.getItem(key)
      }
    }
  } catch (e) {}

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    visitorId: getVisitorIdentifier(),
    completedChallenges,
    codeSnippets
  }
}

/**
 * Trigger browser download of progress JSON
 */
export function downloadProgressFile() {
  const data = exportProgressData()
  if (!data) return
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `qualiadept-python-progress-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 3. Cross-Device Backup: Import progress JSON and restore state
 */
export function importProgressData(jsonStringOrObject) {
  if (typeof window === 'undefined') return false

  try {
    const data = typeof jsonStringOrObject === 'string' 
      ? JSON.parse(jsonStringOrObject) 
      : jsonStringOrObject

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid format')
    }

    const { completedChallenges = {}, codeSnippets = {} } = data

    // 1. Restore completed challenges
    let currentCentral = {}
    try {
      const raw = localStorage.getItem(CENTRAL_PROGRESS_KEY)
      if (raw) currentCentral = JSON.parse(raw)
    } catch (_) {}

    const mergedCentral = { ...currentCentral, ...completedChallenges }
    localStorage.setItem(CENTRAL_PROGRESS_KEY, JSON.stringify(mergedCentral))

    for (const [id, payload] of Object.entries(completedChallenges)) {
      localStorage.setItem(STATUS_PREFIX + id, JSON.stringify(payload))
    }

    // 2. Restore saved code
    for (const [id, code] of Object.entries(codeSnippets)) {
      if (typeof code === 'string') {
        localStorage.setItem(CODE_PREFIX + id, code)
      }
    }

    // 3. Notify app components
    window.dispatchEvent(new CustomEvent('qualiadept-progress-updated', {
      detail: { imported: true, count: Object.keys(completedChallenges).length }
    }))

    return true
  } catch (e) {
    console.error('[Progress] Failed to import progress:', e)
    return false
  }
}

/**
 * Get aggregated progress counts
 */
export function getStoredProgressStats(totalKnownChallenges = 10) {
  if (typeof window === 'undefined') {
    return { completed: 0, total: totalKnownChallenges, percentage: 0 }
  }

  try {
    const raw = localStorage.getItem(CENTRAL_PROGRESS_KEY)
    const central = raw ? JSON.parse(raw) : {}
    const completed = Object.keys(central).length
    const percentage = Math.min(Math.round((completed / Math.max(totalKnownChallenges, 1)) * 100), 100)
    return { completed, total: totalKnownChallenges, percentage }
  } catch (e) {
    return { completed: 0, total: totalKnownChallenges, percentage: 0 }
  }
}
