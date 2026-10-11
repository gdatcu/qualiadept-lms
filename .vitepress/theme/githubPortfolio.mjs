/**
 * QualiAdept LMS - 1-Click GitHub Portfolio & Cross-Device Progress Sync Engine
 * 
 * Features:
 * 1. 1-Click Supabase GitHub OAuth (public_repo scope)
 * 2. Automated Portfolio Repository Creation (qualiadept-python-automation)
 * 3. Auto-commit passing challenge solutions with metadata & docstrings
 * 4. Auto-generated, recruiter-ready README.md showcase portfolio
 * 5. Cross-Device progress restoration directly from GitHub repository
 */

import { getSupabaseClient } from './supabase.mjs'

const GH_TOKEN_KEY = 'qualiadept_gh_token'
const GH_USER_KEY = 'qualiadept_gh_user'
const GH_REPO_NAME = 'qualiadept-python-automation'

/**
 * 1-Click Login via Supabase GitHub OAuth
 */
export async function signInWithGitHub(redirectToUrl) {
  if (typeof window === 'undefined') return { error: 'Not in browser' }
  const client = getSupabaseClient()
  if (!client) {
    return { error: 'Supabase client not initialized' }
  }

  const redirect = redirectToUrl || window.location.href
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'github',
    options: {
      scopes: 'public_repo read:user',
      redirectTo: redirect
    }
  })

  if (error) {
    console.error('[GitHub Auth] OAuth signIn error:', error)
    return { error: error.message }
  }
  return { data }
}

/**
 * Capture and persist GitHub provider token from Supabase session
 * Call on application mount / router change
 */
export async function initializeGitHubSession() {
  if (typeof window === 'undefined') return null
  const client = getSupabaseClient()
  if (!client) return getCachedGitHubUser()

  try {
    const { data: { session } } = await client.auth.getSession()
    if (session?.provider_token) {
      localStorage.setItem(GH_TOKEN_KEY, session.provider_token)
    }

    if (session?.user) {
      const metadata = session.user.user_metadata || {}
      const ghUser = {
        username: metadata.user_name || metadata.preferred_username || session.user.email?.split('@')[0],
        name: metadata.full_name || metadata.name || '',
        avatarUrl: metadata.avatar_url || '',
        email: session.user.email || '',
        repoUrl: `https://github.com/${metadata.user_name || metadata.preferred_username}/${GH_REPO_NAME}`
      }
      localStorage.setItem(GH_USER_KEY, JSON.stringify(ghUser))

      window.dispatchEvent(new CustomEvent('qualiadept-github-auth-changed', { detail: ghUser }))
      return ghUser
    }
  } catch (err) {
    console.warn('[GitHub Auth] Session check error:', err)
  }

  return getCachedGitHubUser()
}

/**
 * Get current connected GitHub user from cache
 */
export function getCachedGitHubUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (_) {
    return null
  }
}

/**
 * Get saved GitHub OAuth token
 */
export function getGitHubToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(GH_TOKEN_KEY) || null
}

/**
 * Disconnect GitHub account
 */
export async function signOutGitHub() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(GH_TOKEN_KEY)
    localStorage.removeItem(GH_USER_KEY)
    const client = getSupabaseClient()
    if (client) {
      await client.auth.signOut()
    }
    window.dispatchEvent(new CustomEvent('qualiadept-github-auth-changed', { detail: null }))
  } catch (err) {
    console.warn('[GitHub Auth] SignOut error:', err)
  }
}

/**
 * Generate a friendly slug from challenge ID or title
 */
export function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Format clean Python code with QualiAdept portfolio docstrings
 */
export function formatSolutionPythonFile({ title, challengeId, code, sessionTitle }) {
  const dateStr = new Date().toISOString().split('T')[0]
  const cleanCode = (code || '').trim()

  return `"""
=============================================================================
QualiAdept LMS - Python for QA Automation Portfolio
=============================================================================
Challenge : ${title || challengeId}
Session   : ${sessionTitle || 'Python for Test Automation'}
Challenge ID: ${challengeId}
Completed : ${dateStr}
Status    : PASSED (Verified via in-browser Pyodide test suite)
Platform  : https://qualiadept.eu
=============================================================================
"""

${cleanCode}
`
}

/**
 * Generate a recruiter-ready README.md for the portfolio repository
 */
export function generatePortfolioReadme({ username, completedChallenges = [] }) {
  const total = 10
  const count = completedChallenges.length
  const percent = Math.round((count / total) * 100)
  const lastUpdated = new Date().toISOString().split('T')[0]

  let tableRows = ''
  if (completedChallenges.length > 0) {
    tableRows = completedChallenges.map((c, idx) => {
      const fileName = `sessions/session-${String(c.sessionNumber || 1).padStart(2, '0')}/${slugify(c.challengeId)}.py`
      return `| ${idx + 1} | [${c.title || c.challengeId}](${fileName}) | Session ${c.sessionNumber || 1} | \`PASSED\` | ${c.completedAt || lastUpdated} |`
    }).join('\n')
  } else {
    tableRows = `| - | *No challenges synced yet* | - | - | - |`
  }

  return `# 🐍 Python Test Automation Portfolio

[![QualiAdept LMS](https://img.shields.io/badge/QualiAdept-Certified_QA_Automation-4f46e5?style=for-the-badge&logo=python&logoColor=white)](https://qualiadept.eu)
[![Progress](https://img.shields.io/badge/Challenges-${count}%2F${total}_Completed_${percent}%25-10b981?style=for-the-badge)](https://qualiadept.eu)
[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

This repository showcases my hands-on solutions, algorithmic parsing routines, and test automation frameworks developed as part of the **Python for Test Automation** curriculum on [QualiAdept LMS](https://qualiadept.eu).

---

## 🎯 Demonstrated QA Automation Skills
- **Core Python for QA:** Strong typing, dynamic casting, and floating-point assertion precision (IEEE 754).
- **Text & Log Extraction:** Advanced string slicing, sanitization (\`strip\`, \`replace\`, \`split\`), and non-greedy Regular Expressions (\`re\`).
- **Data Structures in Testing:** Dictionaries, Tuples, Sets, and List Comprehensions for test data mapping.
- **Modern Test Architecture:** \`pytest\` fixtures, parameterized data-driven testing, and native assertions.
- **REST API Automation:** HTTP client patterns, status codes, bearer token authentication, and JSON schema validation.
- **Web UI Automation:** Selenium WebDriver 4 & Selene (Python Selenide) utilizing Page Object Model (POM) and explicit waits.

---

## 🏆 Completed Challenges & Solutions

| # | Challenge Name | Session | Status | Completed Date |
| :---: | :--- | :---: | :---: | :---: |
${tableRows}

---

## 🚀 How to Run Locally

1. Clone this repository:
\`\`\`bash
git clone https://github.com/${username}/${GH_REPO_NAME}.git
cd ${GH_REPO_NAME}
\`\`\`

2. Execute any session solution directly with Python:
\`\`\`bash
python sessions/session-01/${slugify(completedChallenges[0]?.challengeId || 'example')}.py
\`\`\`

---
*Automatically verified and published via [QualiAdept LMS](https://qualiadept.eu) 1-Click GitHub Portfolio Sync.*
`
}

/**
 * Base64 encode UTF-8 string safely for GitHub API
 */
export function utf8ToBase64(str) {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(unescape(encodeURIComponent(str)))
  }
  return Buffer.from(str, 'utf-8').toString('base64')
}

/**
 * Base64 decode UTF-8 string safely from GitHub API
 */
export function base64ToUtf8(b64) {
  if (typeof window !== 'undefined' && window.atob) {
    return decodeURIComponent(escape(window.atob(b64)))
  }
  return Buffer.from(b64, 'base64').toString('utf-8')
}

/**
 * Check if the portfolio repository exists, or create it automatically
 */
export async function ensurePortfolioRepo({ token, username }) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }

  // 1. Check if repo already exists
  const checkRes = await fetch(`https://api.github.com/repos/${username}/${GH_REPO_NAME}`, { headers })
  if (checkRes.ok) {
    return { ok: true, isNew: false }
  }

  if (checkRes.status === 404) {
    // 2. Create the repo
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: GH_REPO_NAME,
        description: '🐍 Python Test Automation Portfolio: Solved Challenges & Frameworks | QualiAdept LMS',
        homepage: 'https://qualiadept.eu',
        private: false,
        auto_init: true
      })
    })

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}))
      throw new Error(`Failed to create GitHub repository: ${errData.message || createRes.statusText}`)
    }

    return { ok: true, isNew: true }
  }

  throw new Error(`GitHub API error: ${checkRes.status}`)
}

/**
 * Commit or update a file in the user's GitHub portfolio repository
 */
export async function commitFileToRepo({ token, username, path, content, commitMessage }) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }

  // Check if file exists to obtain current SHA
  let sha = undefined
  const fileRes = await fetch(`https://api.github.com/repos/${username}/${GH_REPO_NAME}/contents/${path}`, { headers })
  if (fileRes.ok) {
    const fileData = await fileRes.json()
    sha = fileData.sha
  }

  // Create or update file
  const putRes = await fetch(`https://api.github.com/repos/${username}/${GH_REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage || `feat: update ${path}`,
      content: utf8ToBase64(content),
      sha: sha
    })
  })

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}))
    throw new Error(`Failed to commit file ${path}: ${errData.message || putRes.statusText}`)
  }

  return await putRes.json()
}

/**
 * 1-Click Sync: Commit a passing challenge to the student's GitHub portfolio
 */
export async function syncChallengeToGitHub({
  challengeId,
  title,
  code,
  sessionNumber = 1,
  sessionTitle = 'Session 1: First Steps in Python'
}) {
  const token = getGitHubToken()
  const user = getCachedGitHubUser()

  if (!token || !user?.username) {
    return { synced: false, reason: 'not_authenticated' }
  }

  try {
    // 1. Ensure repository exists
    await ensurePortfolioRepo({ token, username: user.username })

    // 2. Format code and commit challenge file
    const fileContent = formatSolutionPythonFile({ title, challengeId, code, sessionTitle })
    const sessionDir = `sessions/session-${String(sessionNumber).padStart(2, '0')}`
    const fileName = `${sessionDir}/${slugify(challengeId)}.py`

    await commitFileToRepo({
      token,
      username: user.username,
      path: fileName,
      content: fileContent,
      commitMessage: `feat(session-${sessionNumber}): solve ${title || challengeId}`
    })

    // 3. Update central registry of challenges in localStorage
    const registryKey = 'qa_synced_challenges_registry'
    let registry = []
    try {
      const raw = localStorage.getItem(registryKey)
      if (raw) registry = JSON.parse(raw)
    } catch (_) {}

    const existingIdx = registry.findIndex(c => c.challengeId === challengeId)
    const item = {
      challengeId,
      title: title || challengeId,
      sessionNumber,
      completedAt: new Date().toISOString().split('T')[0]
    }
    if (existingIdx >= 0) {
      registry[existingIdx] = item
    } else {
      registry.push(item)
    }
    localStorage.setItem(registryKey, JSON.stringify(registry))

    // 4. Update README.md
    const readmeContent = generatePortfolioReadme({ username: user.username, completedChallenges: registry })
    await commitFileToRepo({
      token,
      username: user.username,
      path: 'README.md',
      content: readmeContent,
      commitMessage: `docs: update portfolio showcase progress (${registry.length} challenges)`
    })

    return {
      synced: true,
      repoUrl: `https://github.com/${user.username}/${GH_REPO_NAME}`,
      fileUrl: `https://github.com/${user.username}/${GH_REPO_NAME}/blob/main/${fileName}`
    }
  } catch (err) {
    console.error('[GitHub Sync] Error syncing challenge to GitHub:', err)
    return { synced: false, error: err.message }
  }
}

/**
 * Cross-Device Restore: Fetch solutions from the user's GitHub portfolio
 * and restore them into localStorage on a new device
 */
export async function restoreProgressFromGitHub() {
  const token = getGitHubToken()
  const user = getCachedGitHubUser()

  if (!token || !user?.username) {
    return { restored: 0, error: 'Not authenticated with GitHub' }
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }

  try {
    // 1. Check if repo exists
    const repoRes = await fetch(`https://api.github.com/repos/${user.username}/${GH_REPO_NAME}`, { headers })
    if (!repoRes.ok) {
      return { restored: 0, error: 'Portfolio repository not found yet' }
    }

    // 2. Fetch sessions folder
    const sessionsRes = await fetch(`https://api.github.com/repos/${user.username}/${GH_REPO_NAME}/contents/sessions`, { headers })
    if (!sessionsRes.ok) {
      return { restored: 0, count: 0 }
    }

    const sessionDirs = await sessionsRes.json()
    let restoredCount = 0

    for (const dir of sessionDirs) {
      if (dir.type !== 'dir') continue
      const filesRes = await fetch(dir.url, { headers })
      if (!filesRes.ok) continue
      const files = await filesRes.json()

      for (const f of files) {
        if (!f.name.endsWith('.py')) continue
        // Fetch raw file content
        const rawRes = await fetch(f.download_url)
        if (!rawRes.ok) continue
        const pythonCode = await rawRes.text()

        // Extract challenge ID from docstrings or filename
        const match = pythonCode.match(/Challenge ID:\s*([a-zA-Z0-9_-]+)/)
        const chalId = match ? match[1].trim() : f.name.replace('.py', '')

        // Restore into localStorage
        localStorage.setItem(`qa_py_code_${chalId}`, pythonCode)
        localStorage.setItem(`qa_py_status_${chalId}`, JSON.stringify({ passed: true, restoredFromGitHub: true }))
        restoredCount++
      }
    }

    if (restoredCount > 0) {
      window.dispatchEvent(new CustomEvent('qualiadept-progress-updated'))
    }

    return { restored: restoredCount }
  } catch (err) {
    console.error('[GitHub Restore] Error restoring from GitHub:', err)
    return { restored: 0, error: err.message }
  }
}
