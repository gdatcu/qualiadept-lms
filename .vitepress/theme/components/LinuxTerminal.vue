<template>
  <div class="linux-terminal-container" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Top Bar / Header -->
    <div class="terminal-header">
      <div class="terminal-title-box">
        <div class="terminal-traffic-lights" aria-hidden="true">
          <span class="light red"></span>
          <span class="light yellow"></span>
          <span class="light green"></span>
        </div>
        <div class="terminal-meta">
          <div class="terminal-title-row">
            <span class="terminal-title">{{ title || (isEn ? 'Linux Practice Terminal' : 'Terminal Practic Linux QA') }}</span>
            <span v-if="isSolved" class="terminal-solved-badge">✓ {{ isEn ? 'Solved' : 'Rezolvat' }}</span>
          </div>
          <span class="terminal-badge">Ubuntu 22.04 LTS &bull; Virtual Bash Sandbox</span>
        </div>
      </div>

      <div class="terminal-actions">
        <!-- Mode Switch: Script Editor vs Live CLI -->
        <div class="terminal-mode-switch">
          <button 
            type="button" 
            class="mode-btn" 
            :class="{ active: viewMode === 'editor' }" 
            @click="viewMode = 'editor'"
            :title="isEn ? 'Script / Command Editor' : 'Editor de Script / Comenzi'"
          >
            📝 {{ isEn ? 'Script' : 'Script' }}
          </button>
          <button 
            type="button" 
            class="mode-btn" 
            :class="{ active: viewMode === 'interactive' }" 
            @click="viewMode = 'interactive'"
            :title="isEn ? 'Interactive Live Shell' : 'Terminal Interactiv Live'"
          >
            ⚡ {{ isEn ? 'Live CLI' : 'Live CLI' }}
          </button>
        </div>

        <button
          type="button"
          class="term-btn term-btn-secondary"
          @click.stop="toggleFullscreen"
          :title="isFullscreen ? (isEn ? 'Exit Full Screen (Esc)' : 'Ieși din ecran complet (Esc)') : (isEn ? 'Full Screen' : 'Ecran Complet')"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 10H4m6 0V4m0 6L3 3m14 7h6m-6 0V4m0 6l7-7" />
          </svg>
        </button>

        <button
          type="button"
          class="term-btn term-btn-secondary term-btn-gh"
          @click="showGhModal = true"
          :title="isEn ? 'GitHub Portfolio & Sync' : 'Portofoliu GitHub & Sincronizare'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>{{ ghUser ? '@' + ghUser.username : 'GitHub' }}</span>
        </button>

        <button
          type="button"
          class="term-btn term-btn-secondary"
          @click="resetTerminal"
          :title="isEn ? 'Reset terminal and filesystem' : 'Resetează terminalul și fișierele'"
        >
          <span>Reset</span>
        </button>

        <button
          v-if="viewMode === 'editor'"
          class="term-btn term-btn-run"
          @click="runCurrentScript"
          :disabled="isRunning"
        >
          <span>▶ {{ isRunning ? '...' : (isEn ? 'Run' : 'Rulează') }}</span>
        </button>

        <button
          v-if="hasTests"
          class="term-btn term-btn-test"
          @click="gradeChallenge"
          :disabled="isTesting"
        >
          <span>✓ {{ isTesting ? '...' : (isEn ? 'Test Solution' : 'Verifică Soluția') }}</span>
        </button>
      </div>
    </div>

    <!-- Description -->
    <div v-if="description" class="terminal-description">
      <p>{{ description }}</p>
    </div>

    <!-- Main Workspace (Editor or Live CLI) -->
    <div class="terminal-workspace">
      <!-- Mode 1: Script Editor -->
      <div v-if="viewMode === 'editor'" class="editor-pane">
        <div class="line-numbers" aria-hidden="true">
          <span v-for="n in lineCount" :key="n">{{ n }}</span>
        </div>
        <textarea
          ref="editorRef"
          v-model="userCode"
          class="script-editor"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          @keydown="handleKeydown"
          :placeholder="isEn ? '# Type your bash command or script here\n' : '# Scrie comanda sau scriptul Bash aici\n'"
        ></textarea>
      </div>

      <!-- Mode 2: Interactive Live Shell -->
      <div v-else class="interactive-pane" @click="focusCliInput">
        <div class="cli-history">
          <div class="cli-welcome">
            Linux qa-sandbox 6.5.0-42-generic #42-Ubuntu SMP x86_64 GNU/Linux<br>
            {{ isEn ? 'Type your Linux commands below (e.g. ls, pwd, cat /var/log/app.log):' : 'Introdu comenzi Linux mai jos (ex: ls, pwd, cat /var/log/app.log):' }}
          </div>
          <div v-for="(entry, idx) in interactiveLogs" :key="idx" class="cli-entry">
            <div class="cli-prompt-line">
              <span class="prompt-user">qa-tester@linux-sandbox</span>:<span class="prompt-path">{{ entry.cwd }}</span>$ <span class="prompt-cmd">{{ entry.cmd }}</span>
            </div>
            <div v-if="entry.stdout" class="cli-out">{{ entry.stdout }}</div>
            <div v-if="entry.stderr" class="cli-err">{{ entry.stderr }}</div>
          </div>
        </div>
        <div class="cli-input-row">
          <span class="prompt-user">qa-tester@linux-sandbox</span>:<span class="prompt-path">{{ currentCwd }}</span>$ 
          <input
            ref="cliInputRef"
            v-model="cliCurrentInput"
            type="text"
            class="cli-input"
            spellcheck="false"
            autocomplete="off"
            @keydown="handleCliKeydown"
            autofocus
          />
        </div>
      </div>
    </div>

    <!-- Output & Results Navigation Bar -->
    <div class="terminal-tabs-bar">
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'output' }"
          @click="activeTab = 'output'"
        >
          🖥️ {{ isEn ? 'Output' : 'Ieșire Consolă' }}
        </button>

        <button
          v-if="hasTests"
          class="tab-btn"
          :class="{ active: activeTab === 'tests', 'tab-has-fail': testReport && !testReport.success }"
          @click="activeTab = 'tests'"
        >
          📋 {{ isEn ? 'Verification' : 'Raport Teste' }}
          <span v-if="testReport" class="tab-badge" :class="testReport.success ? 'badge-pass' : 'badge-fail'">
            {{ testReport.passed_count }}/{{ testReport.total_count }}
          </span>
        </button>

        <button
          class="tab-btn"
          :class="{ active: activeTab === 'files' }"
          @click="activeTab = 'files'"
        >
          📁 {{ isEn ? 'Virtual Filesystem' : 'Fișiere Virtuale' }}
        </button>

        <button
          v-if="hint"
          class="tab-btn"
          :class="{ active: activeTab === 'hint' }"
          @click="activeTab = 'hint'"
        >
          💡 {{ isEn ? 'Hint' : 'Indiciu' }}
        </button>
      </div>

      <div class="tab-meta">
        <span v-if="lastExitCode !== null" class="exit-status" :class="lastExitCode === 0 ? 'exit-ok' : 'exit-err'">
          exit: {{ lastExitCode }}
        </span>
      </div>
    </div>

    <!-- Output Panels -->
    <div class="terminal-panels">
      <!-- Output Tab -->
      <div v-if="activeTab === 'output'" class="panel-content output-panel">
        <pre v-if="latestOutput" class="code-output">{{ latestOutput }}</pre>
        <pre v-if="latestError" class="code-error">{{ latestError }}</pre>
        <div v-if="!latestOutput && !latestError" class="output-placeholder">
          {{ isEn ? 'Click "Run" or press Enter in Live CLI to view output.' : 'Apasă "Rulează" sau Enter în Live CLI pentru a vedea rezultatele.' }}
        </div>
      </div>

      <!-- Tests Verification Tab -->
      <div v-if="activeTab === 'tests'" class="panel-content tests-panel">
        <div v-if="!testReport" class="tests-placeholder">
          {{ isEn ? 'Click "Test Solution" to run automated verification checks.' : 'Apasă "Verifică Soluția" pentru a rula testele automate.' }}
        </div>
        <div v-else class="test-report-box">
          <div class="report-header" :class="testReport.success ? 'header-success' : 'header-failed'">
            <h4>{{ testReport.success ? (isEn ? '🎉 Challenge Completed!' : '🎉 Provocare Rezolvată cu Succes!') : (isEn ? '❌ Some checks failed' : '❌ Una sau mai multe verificări au eșuat') }}</h4>
            <span>{{ testReport.passed_count }} / {{ testReport.total_count }} {{ isEn ? 'tests passed' : 'verificări validate' }}</span>
          </div>

          <div class="test-cards-list">
            <div v-for="t in testReport.tests" :key="t.id" class="test-item-card" :class="t.passed ? 'pass' : 'fail'">
              <div class="test-item-top">
                <span>{{ t.passed ? '✅' : '❌' }} {{ t.name }}</span>
                <span class="item-pill">{{ t.passed ? 'PASSED' : 'FAILED' }}</span>
              </div>
              <div v-if="!t.passed && t.expected" class="test-item-diff">
                <div><strong>{{ isEn ? 'Expected:' : 'Așteptat:' }}</strong> <code>{{ t.expected }}</code></div>
                <div v-if="t.actual"><strong>{{ isEn ? 'Actual:' : 'Primit:' }}</strong> <code>{{ t.actual }}</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Virtual Filesystem Explorer -->
      <div v-if="activeTab === 'files'" class="panel-content files-panel">
        <div class="vfs-header">
          <strong>{{ isEn ? 'Available Files in Virtual Sandbox:' : 'Fișiere disponibile în sandbox-ul virtual:' }}</strong>
          <span class="vfs-tip">{{ isEn ? 'Use cat, head, or grep to inspect' : 'Folosește cat, head sau grep pentru inspectare' }}</span>
        </div>
        <div class="vfs-tree">
          <div v-for="(node, path) in session.fs" :key="path" class="vfs-row">
            <span class="vfs-type">{{ node.type === 'dir' ? '📁' : '📄' }}</span>
            <code class="vfs-path">{{ path }}</code>
            <span class="vfs-perms">{{ node.permissions }}</span>
          </div>
        </div>
      </div>

      <!-- Hint Tab -->
      <div v-if="activeTab === 'hint'" class="panel-content hint-panel">
        <div class="hint-card">
          <span class="hint-icon">💡</span>
          <div class="hint-body">
            <strong>{{ isEn ? 'Helpful Solution Hint' : 'Indiciu de Rezolvare' }}</strong>
            <p>{{ hint }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- GitHub Sync Modal -->
    <GitHubSyncModal v-model="showGhModal" :lang="isEn ? 'en' : 'ro'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { LinuxSession, verifyLinuxChallenge } from '../linuxEmulator.mjs'
import {
  resolveChallengeId,
  saveChallengeCode,
  loadChallengeCode,
  resetChallengeCode,
  markChallengeCompleted,
  isChallengeCompleted
} from '../challengeProgress.mjs'
import {
  getCachedGitHubUser,
  syncChallengeToGitHub,
  initializeGitHubSession
} from '../githubPortfolio.mjs'
import GitHubSyncModal from './GitHubSyncModal.vue'

const props = defineProps({
  challengeId: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  initialCode: { type: String, default: '' },
  testCases: { type: Array, default: () => [] },
  solution: { type: String, default: '' },
  hint: { type: String, default: '' },
  lang: { type: String, default: '' }
})

const isEn = computed(() => {
  if (props.lang) return props.lang === 'en'
  if (typeof window !== 'undefined') return window.location.pathname.startsWith('/en/')
  return false
})

const viewMode = ref('editor')
const activeTab = ref('output')
const isFullscreen = ref(false)
const isRunning = ref(false)
const isTesting = ref(false)

const session = ref(new LinuxSession())
const currentCwd = computed(() => session.value.cwd)
const lastExitCode = ref(0)

const userCode = ref('')
const latestOutput = ref('')
const latestError = ref('')
const testReport = ref(null)
const isSolved = ref(false)

// GitHub Portfolio State
const showGhModal = ref(false)
const ghUser = ref(null)
const isSyncingGh = ref(false)
const ghSyncResult = ref(null)

// Interactive Shell State
const cliCurrentInput = ref('')
const interactiveLogs = ref([])
const cliHistory = ref([])
const historyIdx = ref(-1)
const cliInputRef = ref(null)
const editorRef = ref(null)

const effectiveChallengeId = computed(() => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  return resolveChallengeId(props.challengeId, props.title, currentPath)
})

const hasTests = computed(() => props.testCases && props.testCases.length > 0)
const lineCount = computed(() => Math.max(userCode.value.split('\n').length, 4))

function handleGlobalKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

onMounted(() => {
  userCode.value = loadChallengeCode(effectiveChallengeId.value, props.initialCode.trim())
  isSolved.value = isChallengeCompleted(effectiveChallengeId.value)

  if (typeof window !== 'undefined') {
    ghUser.value = getCachedGitHubUser()
    initializeGitHubSession().then(u => {
      if (u) ghUser.value = u
    })
    window.addEventListener('qualiadept-github-auth-changed', (e) => {
      ghUser.value = e.detail
    })
    window.addEventListener('keydown', handleGlobalKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown)
    document.body.style.overflow = ''
  }
})

watch(userCode, (newVal) => {
  saveChallengeCode(effectiveChallengeId.value, newVal)
})

function handleKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = editorRef.value
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const spaces = '  '
    userCode.value = userCode.value.substring(0, start) + spaces + userCode.value.substring(end)
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length
    }, 0)
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
  }
}

function resetTerminal() {
  if (confirm(isEn.value ? 'Reset terminal, code, and virtual filesystem?' : 'Resetezi codul, terminalul și fișierele virtuale?')) {
    session.value = new LinuxSession()
    userCode.value = props.initialCode.trim()
    resetChallengeCode(effectiveChallengeId.value)
    isSolved.value = isChallengeCompleted(effectiveChallengeId.value)
    latestOutput.value = ''
    latestError.value = ''
    testReport.value = null
    interactiveLogs.value = []
    lastExitCode.value = 0
  }
}

function runCurrentScript() {
  isRunning.value = true
  activeTab.value = 'output'
  latestOutput.value = ''
  latestError.value = ''

  try {
    const res = session.value.execute(userCode.value)
    latestOutput.value = res.stdout
    latestError.value = res.stderr
    lastExitCode.value = res.exitCode
  } catch (err) {
    latestError.value = err.message
    lastExitCode.value = 1
  } finally {
    isRunning.value = false
  }
}

function gradeChallenge() {
  if (!hasTests.value) return
  isTesting.value = true
  activeTab.value = 'tests'

  try {
    const report = verifyLinuxChallenge(userCode.value, props.testCases)
    testReport.value = report
    latestOutput.value = report.stdout
    latestError.value = report.stderr
    lastExitCode.value = report.exitCode

    if (report.success) {
      isSolved.value = true
      markChallengeCompleted(effectiveChallengeId.value, {
        code: userCode.value,
        title: props.title
      })

      // Automatic 1-Click GitHub Portfolio Sync if connected
      if (ghUser.value) {
        isSyncingGh.value = true
        syncChallengeToGitHub({
          challengeId: effectiveChallengeId.value,
          title: props.title,
          code: userCode.value,
          language: 'bash',
          sessionNumber: 1,
          sessionTitle: typeof document !== 'undefined' ? document.title.split('|')[0].trim() : 'Linux for Testing'
        }).then(res => {
          ghSyncResult.value = res
        }).catch(err => {
          console.warn('[GitHub Sync] Error during Linux auto-commit:', err)
        }).finally(() => {
          isSyncingGh.value = false
        })
      }
    }
  } catch (err) {
    latestError.value = err.message
  } finally {
    isTesting.value = false
  }
}

function focusCliInput() {
  if (cliInputRef.value) cliInputRef.value.focus()
}

function handleCliKeydown(e) {
  if (e.key === 'Enter') {
    const cmd = cliCurrentInput.value.trim()
    if (!cmd) return
    cliHistory.value.push(cmd)
    historyIdx.value = cliHistory.value.length

    const res = session.value.execute(cmd)
    interactiveLogs.value.push({
      cwd: currentCwd.value,
      cmd,
      stdout: res.stdout,
      stderr: res.stderr,
      exitCode: res.exitCode
    })
    lastExitCode.value = res.exitCode
    latestOutput.value = res.stdout
    latestError.value = res.stderr
    cliCurrentInput.value = ''
  } else if (e.key === 'ArrowUp') {
    if (cliHistory.value.length === 0) return
    if (historyIdx.value > 0) historyIdx.value--
    cliCurrentInput.value = cliHistory.value[historyIdx.value] || ''
  } else if (e.key === 'ArrowDown') {
    if (historyIdx.value < cliHistory.value.length - 1) {
      historyIdx.value++
      cliCurrentInput.value = cliHistory.value[historyIdx.value] || ''
    } else {
      historyIdx.value = cliHistory.value.length
      cliCurrentInput.value = ''
    }
  }
}
</script>

<style scoped>
.linux-terminal-container {
  margin: 1.5rem 0;
  border-radius: 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  overflow: hidden;
}

.linux-terminal-container.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  border-radius: 0;
  margin: 0;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  gap: 0.75rem;
}

.terminal-title-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.terminal-traffic-lights {
  display: flex;
  gap: 6px;
}

.light {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.light.red { background: #ff5f56; }
.light.yellow { background: #ffbd2e; }
.light.green { background: #27c93f; }

.terminal-meta {
  display: flex;
  flex-direction: column;
}

.terminal-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terminal-title {
  color: #f0f6fc;
  font-weight: 600;
  font-size: 0.875rem;
}

.terminal-badge {
  color: #8b949e;
  font-size: 0.72rem;
}

.terminal-solved-badge {
  background: rgba(35, 134, 54, 0.25);
  color: #3fb950;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 99px;
  border: 1px solid #238636;
}

.terminal-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.terminal-mode-switch {
  display: flex;
  background: #21262d;
  border-radius: 6px;
  padding: 2px;
}

.mode-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.mode-btn.active {
  background: #388bfd;
  color: #ffffff;
  font-weight: 600;
}

.term-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.term-btn-secondary {
  background: #21262d;
  color: #c9d1d9;
  border-color: #30363d;
}

.term-btn-secondary:hover {
  background: #30363d;
}

.term-btn-gh {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #21262d;
  color: #c9d1d9;
  border-color: #30363d;
}

.term-btn-gh:hover {
  background: #30363d;
  color: #58a6ff;
  border-color: #58a6ff;
}

.term-btn-run {
  background: #1f6feb;
  color: #ffffff;
}

.term-btn-run:hover {
  background: #388bfd;
}

.term-btn-test {
  background: #238636;
  color: #ffffff;
}

.term-btn-test:hover {
  background: #2ea043;
}

.terminal-description {
  padding: 0.65rem 1rem;
  background: #11161d;
  border-bottom: 1px solid #21262d;
  color: #c9d1d9;
  font-size: 0.825rem;
}

.terminal-workspace {
  min-height: 140px;
  max-height: 280px;
  overflow: auto;
  background: #090d13;
}

.editor-pane {
  display: flex;
  font-size: 0.85rem;
  line-height: 1.5;
}

.line-numbers {
  padding: 0.75rem 0.6rem;
  color: #484f58;
  text-align: right;
  user-select: none;
  display: flex;
  flex-direction: column;
}

.script-editor {
  flex: 1;
  background: transparent;
  color: #58a6ff;
  border: none;
  outline: none;
  padding: 0.75rem 0.5rem;
  font-family: inherit;
  font-size: 0.85rem;
  line-height: 1.5;
  resize: none;
  min-height: 120px;
}

.interactive-pane {
  padding: 0.75rem 1rem;
  color: #e6edf3;
  font-size: 0.825rem;
  line-height: 1.5;
  cursor: text;
}

.cli-welcome {
  color: #8b949e;
  margin-bottom: 0.75rem;
}

.prompt-user {
  color: #3fb950;
  font-weight: 600;
}

.prompt-path {
  color: #58a6ff;
  font-weight: 600;
}

.prompt-cmd {
  color: #f0f6fc;
}

.cli-out {
  color: #c9d1d9;
  white-space: pre-wrap;
  margin: 3px 0 6px 0;
}

.cli-err {
  color: #f85149;
  white-space: pre-wrap;
  margin: 3px 0 6px 0;
}

.cli-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cli-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.825rem;
}

.terminal-tabs-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #161b22;
  border-top: 1px solid #30363d;
  border-bottom: 1px solid #21262d;
  padding: 0 0.5rem;
}

.tab-buttons {
  display: flex;
  gap: 2px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  padding: 7px 12px;
  font-size: 0.75rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn.active {
  color: #f0f6fc;
  border-bottom-color: #58a6ff;
  background: rgba(88, 166, 255, 0.08);
}

.exit-status {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.exit-ok {
  color: #3fb950;
  background: rgba(35, 134, 54, 0.2);
}

.exit-err {
  color: #f85149;
  background: rgba(218, 54, 51, 0.2);
}

.terminal-panels {
  background: #0d1117;
  max-height: 220px;
  overflow: auto;
}

.panel-content {
  padding: 0.75rem 1rem;
}

.code-output {
  color: #7ee787;
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.8rem;
}

.code-error {
  color: #f85149;
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.8rem;
}

.output-placeholder, .tests-placeholder {
  color: #8b949e;
  font-size: 0.8rem;
  font-style: italic;
}

.report-header {
  padding: 0.6rem 0.85rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.header-success {
  background: rgba(35, 134, 54, 0.15);
  color: #3fb950;
  border: 1px solid #238636;
}

.header-failed {
  background: rgba(218, 54, 51, 0.15);
  color: #f85149;
  border: 1px solid #da3633;
}

.test-item-card {
  background: #161b22;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.45rem;
  font-size: 0.78rem;
  border-left: 3px solid transparent;
}

.test-item-card.pass {
  border-left-color: #3fb950;
}

.test-item-card.fail {
  border-left-color: #f85149;
}

.test-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f0f6fc;
}

.item-pill {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
}

.test-item-card.pass .item-pill {
  color: #3fb950;
  background: rgba(35, 134, 54, 0.2);
}

.test-item-card.fail .item-pill {
  color: #f85149;
  background: rgba(218, 54, 51, 0.2);
}

.test-item-diff {
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px dashed #30363d;
  color: #8b949e;
}

.vfs-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #c9d1d9;
  margin-bottom: 0.5rem;
}

.vfs-tree {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vfs-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.vfs-path {
  color: #58a6ff;
  flex: 1;
}

.vfs-perms {
  color: #8b949e;
}

.hint-card {
  display: flex;
  gap: 0.75rem;
  background: #161b22;
  border-left: 3px solid #e3b341;
  padding: 0.75rem;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 0.8rem;
}

.hint-icon {
  font-size: 1.25rem;
}
</style>

