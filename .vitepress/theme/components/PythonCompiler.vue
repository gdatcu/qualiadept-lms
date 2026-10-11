<template>
  <div class="py-compiler-container" :class="{ 'is-loading': isInitializing, 'is-fullscreen': isFullscreen }">
    <!-- Top Bar / Header -->
    <div class="py-header">
      <div class="py-title-box">
        <span class="py-logo">🐍</span>
        <div class="py-meta">
          <div class="py-title-row">
            <span class="py-title">{{ title || (isEn ? 'Python Practice Challenge' : 'Provocare Practică Python') }}</span>
            <span v-if="isSolved" class="py-solved-badge">✓ {{ isEn ? 'Solved' : 'Rezolvat' }}</span>
          </div>
          <span class="py-badge">Python 3.11 &bull; WebAssembly Sandbox</span>
        </div>
      </div>

      <div class="py-actions">
        <button
          class="py-btn py-btn-secondary"
          @click="toggleFullscreen"
          :title="isFullscreen ? (isEn ? 'Exit Full Screen (Esc)' : 'Ieși din ecran complet (Esc)') : (isEn ? 'Maximize (Full Screen)' : 'Maximizează (Ecran complet)')"
          :aria-label="isFullscreen ? 'Exit Full Screen' : 'Maximize Full Screen'"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 10H4m6 0V4m0 6L3 3m14 7h6m-6 0V4m0 6l7-7" />
          </svg>
          <span>{{ isFullscreen ? (isEn ? 'Exit' : 'Ieșire') : (isEn ? 'Full Screen' : 'Ecran Complet') }}</span>
        </button>

        <button
          class="py-btn py-btn-secondary"
          @click="resetCode"
          :title="isEn ? 'Reset to initial template' : 'Resetează la șablonul inițial'"
          :disabled="isRunning || isTesting"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>

        <button
          class="py-btn py-btn-run"
          @click="runCode"
          :disabled="isRunning || isTesting || isInitializing"
        >
          <svg v-if="!isRunning" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span v-else class="py-spinner"></span>
          <span>{{ isRunning ? (isEn ? 'Running...' : 'Se rulează...') : (isEn ? 'Run Code' : 'Rulează Codul') }}</span>
        </button>

        <button
          v-if="hasTests"
          class="py-btn py-btn-test"
          @click="testSolution"
          :disabled="isRunning || isTesting || isInitializing"
        >
          <svg v-if="!isTesting" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else class="py-spinner"></span>
          <span>{{ isTesting ? (isEn ? 'Grading...' : 'Verificare...') : (isEn ? 'Test Solution' : 'Verifică Soluția') }}</span>
        </button>
      </div>
    </div>

    <!-- Description (if provided) -->
    <div v-if="description" class="py-description">
      <p>{{ description }}</p>
    </div>

    <!-- Editor Area -->
    <div class="py-editor-wrapper">
      <div class="py-line-numbers" aria-hidden="true">
        <span v-for="n in lineCount" :key="n">{{ n }}</span>
      </div>
      <textarea
        ref="editorRef"
        v-model="userCode"
        class="py-editor"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        @keydown="handleKeydown"
        :placeholder="isEn ? '# Type your Python code here...' : '# Scrie codul tău Python aici...'"
      ></textarea>
    </div>

    <!-- Console Output & Test Results -->
    <div class="py-console-card">
      <div class="py-console-nav">
        <button
          class="py-tab-btn"
          :class="{ active: activeTab === 'console' }"
          @click="activeTab = 'console'"
        >
          <span>💻 {{ isEn ? 'Output Console' : 'Consolă Execuție' }}</span>
          <span v-if="execDuration" class="py-time-pill">{{ execDuration }}ms</span>
        </button>

        <button
          v-if="hasTests"
          class="py-tab-btn"
          :class="{ 
            active: activeTab === 'tests',
            'tab-success': testReport && testReport.success,
            'tab-error': testReport && !testReport.success
          }"
          @click="activeTab = 'tests'"
        >
          <span>🧪 {{ isEn ? 'Test Results' : 'Teste de Verificare' }}</span>
          <span 
            v-if="testReport" 
            class="py-result-pill" 
            :class="testReport.success ? 'passed' : 'failed'"
          >
            {{ testReport.passed_count }}/{{ testReport.total_count }} {{ testReport.success ? (isEn ? 'PASSED' : 'TRECUT') : (isEn ? 'FAILED' : 'EȘUAT') }}
          </span>
        </button>

        <button
          v-if="hint"
          class="py-tab-btn"
          :class="{ active: activeTab === 'hint' }"
          @click="activeTab = 'hint'"
        >
          <span>💡 {{ isEn ? 'Hint' : 'Indiciu' }}</span>
        </button>

        <button
          v-if="solution"
          class="py-tab-btn"
          :class="{ active: activeTab === 'solution' }"
          @click="activeTab = 'solution'"
        >
          <span>🔑 {{ isEn ? 'Solution' : 'Soluție Model' }}</span>
        </button>
      </div>

      <!-- Tab Content: Console -->
      <div v-if="activeTab === 'console'" class="py-tab-pane">
        <div v-if="isInitializing" class="py-msg-neutral">
          ⏳ {{ isEn ? 'Loading Python WebAssembly runtime into browser sandbox...' : 'Se încarcă motorul Python WebAssembly în browser...' }}
        </div>
        <div v-else-if="!consoleOutput && !consoleError" class="py-empty-output">
          {{ isEn ? 'Click "Run Code" to execute stdout or "Test Solution" to run automated assertions.' : 'Apasă pe "Rulează Codul" sau "Verifică Soluția" pentru a vedea rezultatele.' }}
        </div>
        <pre v-if="consoleOutput" class="py-terminal-stdout">{{ consoleOutput }}</pre>
        <div v-if="consoleError" class="py-error-box">
          <div class="py-error-tag">Eroare de Execuție</div>
          <pre class="py-terminal-stderr">{{ consoleError }}</pre>
        </div>
      </div>

      <!-- Tab Content: Test Suite Results -->
      <div v-if="activeTab === 'tests'" class="py-tab-pane">
        <!-- Not run yet -->
        <div v-if="!testReport" class="py-empty-output">
          {{ isEn ? 'No tests executed yet. Click "Test Solution" above to run automated test assertions.' : 'Nu a fost rulat niciun test încă. Apasă pe "Verifică Soluția" pentru a valida codul tău.' }}
        </div>

        <!-- Runtime or Syntax error before assertions -->
        <div v-else-if="testReport.runtime_error" class="py-test-runtime-error">
          <div class="py-error-banner">
            <span class="py-error-icon">⚠️</span>
            <div class="py-error-info">
              <h4 class="py-error-title">{{ testReport.runtime_error.type }}</h4>
              <p class="py-error-desc">{{ testReport.runtime_error.message }}</p>
            </div>
          </div>
          <div class="py-traceback-box">
            <div class="py-traceback-label">{{ isEn ? 'Traceback Details:' : 'Detalii Eroare Traceback:' }}</div>
            <pre class="py-terminal-stderr">{{ testReport.runtime_error.traceback }}</pre>
          </div>
        </div>

        <!-- Granular Test Cases List -->
        <div v-else class="py-tests-container">
          <!-- Summary Header -->
          <div 
            class="py-tests-summary" 
            :class="{ 'all-passed': testReport.success, 'has-failed': !testReport.success }"
          >
            <div class="py-summary-left">
              <span class="py-summary-icon">{{ testReport.success ? '🎉' : '❌' }}</span>
              <div class="py-summary-headings">
                <h4>
                  {{ testReport.success 
                    ? (isEn ? 'All Tests Passed! Excellent Job!' : 'Felicitări! Toate testele au trecut cu succes!') 
                    : (isEn ? 'Some Tests Failed' : 'Una sau mai multe asertări au eșuat') 
                  }}
                </h4>
                <p>
                  {{ testReport.passed_count }} / {{ testReport.total_count }} {{ isEn ? 'assertions satisfied' : 'asertări validate' }}
                  ({{ Math.round((testReport.passed_count / Math.max(testReport.total_count, 1)) * 100) }}%) &bull; {{ testReport.durationMs }}ms
                </p>
              </div>
            </div>
            <span class="py-summary-badge" :class="testReport.success ? 'badge-pass' : 'badge-fail'">
              {{ testReport.success ? '100% PASSED' : 'FAILED' }}
            </span>
          </div>

          <!-- Individual Test Items -->
          <div class="py-test-cards">
            <div
              v-for="test in testReport.tests"
              :key="test.id"
              class="py-test-card"
              :class="{ 'card-passed': test.passed, 'card-failed': !test.passed }"
            >
              <div class="py-card-header">
                <div class="py-card-title-group">
                  <span class="py-status-icon">{{ test.passed ? '✅' : '❌' }}</span>
                  <span class="py-test-title">Test {{ test.id }}: {{ test.name }}</span>
                </div>
                <span class="py-test-status-pill" :class="test.passed ? 'pill-pass' : 'pill-fail'">
                  {{ test.passed ? (isEn ? 'PASSED' : 'TRECUT') : (isEn ? 'FAILED' : 'EȘUAT') }}
                </span>
              </div>

              <div class="py-card-details">
                <div v-if="test.call" class="py-detail-row">
                  <span class="py-detail-label">{{ isEn ? 'Function Call:' : 'Apel Funcție:' }}</span>
                  <code class="py-detail-code">{{ test.call }}</code>
                </div>

                <div v-if="test.expected !== undefined" class="py-detail-row">
                  <span class="py-detail-label">{{ isEn ? 'Expected Value:' : 'Valoare Așteptată:' }}</span>
                  <code class="py-detail-code code-expected">{{ formatValue(test.expected) }}</code>
                </div>

                <div v-if="test.actual !== undefined" class="py-detail-row">
                  <span class="py-detail-label">{{ isEn ? 'Actual Received:' : 'Valoare Primită:' }}</span>
                  <code 
                    class="py-detail-code" 
                    :class="test.passed ? 'code-passed' : 'code-actual-fail'"
                  >
                    {{ formatValue(test.actual) }}
                  </code>
                </div>

                <div v-if="test.error" class="py-detail-error">
                  <span class="py-error-bullet">⚠️</span>
                  <span class="py-error-text">{{ test.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Hint -->
      <div v-if="activeTab === 'hint'" class="py-tab-pane py-hint-pane">
        <div class="py-hint-box">
          <span class="py-hint-icon">💡</span>
          <div>
            <div class="py-hint-title">{{ isEn ? 'Helpful Hint' : 'Indiciu de Rezolvare' }}</div>
            <p class="py-hint-text">{{ hint }}</p>
          </div>
        </div>
      </div>

      <!-- Tab Content: Solution -->
      <div v-if="activeTab === 'solution'" class="py-tab-pane py-solution-pane">
        <p class="py-solution-warning">
          ⚠️ {{ isEn ? 'Try solving the challenge on your own before looking at the model solution!' : 'Încearcă să rezolvi provocarea pe cont propriu înainte de a consulta soluția model!' }}
        </p>
        <pre class="py-solution-code"><code>{{ solution }}</code></pre>
        <button class="py-btn py-btn-secondary" @click="applySolution">
          {{ isEn ? 'Load Solution into Editor' : 'Încarcă Soluția în Editor' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { executePython, verifyPythonChallenge } from '../pyodide.mjs'
import {
  resolveChallengeId,
  saveChallengeCode,
  loadChallengeCode,
  resetChallengeCode,
  isChallengeCompleted,
  markChallengeCompleted
} from '../challengeProgress.mjs'

const props = defineProps({
  challengeId: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  initialCode: { type: String, default: '' },
  testCode: { type: String, default: '' },
  testCases: { type: Array, default: () => null },
  hint: { type: String, default: '' },
  solution: { type: String, default: '' },
  lang: { type: String, default: '' }
})

const editorRef = ref(null)
const userCode = ref(props.initialCode.trim() || '# Write your Python code here\n')
const isRunning = ref(false)
const isTesting = ref(false)
const isInitializing = ref(false)
const activeTab = ref('console')

const consoleOutput = ref('')
const consoleError = ref('')
const testReport = ref(null)
const execDuration = ref(null)
const isFullscreen = ref(false)
const isSolved = ref(false)
let autosaveTimer = null

const effectiveChallengeId = computed(() => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  return resolveChallengeId(props.challengeId, props.title, currentPath)
})

watch(userCode, (newCode) => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => {
    saveChallengeCode(effectiveChallengeId.value, newCode)
  }, 400)
})

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
  }
}

function handleGlobalKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

const isEn = computed(() => {
  if (props.lang) return props.lang === 'en'
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en/')
  }
  return false
})

const hasTests = computed(() => {
  return Boolean(props.testCode || (props.testCases && props.testCases.length > 0))
})

const lineCount = computed(() => {
  return Math.max(userCode.value.split('\n').length, 5)
})

function formatValue(val) {
  if (val === null || val === undefined) return 'None'
  if (typeof val === 'string') return `"${val}"`
  if (typeof val === 'boolean') return val ? 'True' : 'False'
  if (Array.isArray(val)) return JSON.stringify(val)
  return String(val)
}

function handleKeydown(e) {
  // Support 4 spaces indentation with Tab key
  if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const spaces = '    '

    userCode.value = userCode.value.substring(0, start) + spaces + userCode.value.substring(end)

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length
    }, 0)
  }
}

function resetCode() {
  if (confirm(isEn.value ? 'Reset your code to the initial template?' : 'Resetezi codul la starea inițială?')) {
    userCode.value = props.initialCode.trim() || '# Write your Python code here\n'
    resetChallengeCode(effectiveChallengeId.value)
    isSolved.value = isChallengeCompleted(effectiveChallengeId.value)
    consoleOutput.value = ''
    consoleError.value = ''
    testReport.value = null
    execDuration.value = null
    activeTab.value = 'console'
  }
}

function applySolution() {
  if (props.solution) {
    userCode.value = props.solution.trim()
    activeTab.value = 'console'
  }
}

async function runCode() {
  if (isRunning.value || isTesting.value) return
  isRunning.value = true
  activeTab.value = 'console'
  consoleOutput.value = ''
  consoleError.value = ''

  try {
    const res = await executePython(userCode.value)
    execDuration.value = res.durationMs

    if (res.success) {
      consoleOutput.value = res.stdout || (isEn.value ? 'Process finished with exit code 0.' : 'Execuție finalizată cu succes (exit code 0).')
      consoleError.value = res.stderr || ''
    } else {
      consoleOutput.value = res.stdout || ''
      if (res.error) {
        consoleError.value = typeof res.error === 'object' 
          ? (res.error.traceback || `${res.error.type}: ${res.error.message}`)
          : String(res.error)
      } else {
        consoleError.value = isEn.value ? 'Execution error.' : 'Eroare de execuție.'
      }
    }
  } catch (err) {
    consoleError.value = err.message || String(err)
  } finally {
    isRunning.value = false
  }
}

async function testSolution() {
  if (!hasTests.value || isRunning.value || isTesting.value) return
  isTesting.value = true
  activeTab.value = 'tests'
  consoleOutput.value = ''
  consoleError.value = ''

  try {
    const report = await verifyPythonChallenge(userCode.value, props.testCode, props.testCases)
    testReport.value = report
    execDuration.value = report.durationMs
    if (report.stdout) {
      consoleOutput.value = report.stdout
    }

    // Progress Tracking (Local-First + Telemetry Sync)
    if (report.success) {
      isSolved.value = true
      markChallengeCompleted(effectiveChallengeId.value, {
        code: userCode.value,
        durationMs: report.durationMs,
        title: props.title
      })
    }
  } catch (err) {
    testReport.value = {
      success: false,
      runtime_error: {
        type: 'Error',
        message: err.message || String(err),
        traceback: err.stack || String(err)
      },
      tests: [],
      passed_count: 0,
      total_count: 0
    }
  } finally {
    isTesting.value = false
  }
}

function onProgressUpdated(e) {
  if (e.detail?.challengeId === effectiveChallengeId.value || e.detail?.imported) {
    isSolved.value = isChallengeCompleted(effectiveChallengeId.value)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeydown)
    window.addEventListener('qualiadept-progress-updated', onProgressUpdated)

    // Restore saved code if user previously practiced this challenge
    const saved = loadChallengeCode(effectiveChallengeId.value, '')
    if (saved) {
      userCode.value = saved
    } else if (props.initialCode) {
      userCode.value = props.initialCode.trim()
    }

    isSolved.value = isChallengeCompleted(effectiveChallengeId.value)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown)
    window.removeEventListener('qualiadept-progress-updated', onProgressUpdated)
  }
})
</script>

<style scoped>
.py-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.py-solved-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}
.py-compiler-container {
  margin: 2rem 0;
  border-radius: 12px;
  background: #141417;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #f4f4f5;
  transition: all 0.25s ease;
}

/* Fullscreen (Maximize) Mode */
.py-compiler-container.is-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
  z-index: 999999 !important;
  display: flex !important;
  flex-direction: column !important;
  box-shadow: none !important;
  border: none !important;
  background: #121215 !important;
}

.py-compiler-container.is-fullscreen .py-header {
  padding: 12px 24px !important;
  background: #19191e !important;
}

.py-compiler-container.is-fullscreen .py-editor-wrapper {
  flex: 1 1 auto !important;
  min-height: 280px !important;
  height: auto !important;
  overflow: auto !important;
}

.py-compiler-container.is-fullscreen .py-editor {
  min-height: 100% !important;
  height: 100% !important;
  font-size: 0.95rem !important;
}

.py-compiler-container.is-fullscreen .py-console-card {
  flex: 0 0 42% !important;
  min-height: 180px !important;
  max-height: 48vh !important;
  display: flex !important;
  flex-direction: column !important;
  border-top: 2px solid rgba(255, 255, 255, 0.12) !important;
}

.py-compiler-container.is-fullscreen .py-tab-pane {
  flex: 1 !important;
  max-height: none !important;
  overflow-y: auto !important;
}

/* Header */
.py-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #1f1f24;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 12px;
}

.py-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.py-logo {
  font-size: 1.4rem;
  line-height: 1;
}

.py-meta {
  display: flex;
  flex-direction: column;
}

.py-title {
  font-weight: 700;
  font-size: 0.98rem;
  color: #f4f4f5;
  letter-spacing: -0.01em;
}

.py-badge {
  font-size: 0.73rem;
  color: #a1a1aa;
  font-family: 'Fira Code', monospace;
  margin-top: 2px;
}

/* Action Buttons */
.py-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.py-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.py-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.py-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #d4d4d8;
}

.py-btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.py-btn-run {
  background: #2563eb;
  color: #fff;
}

.py-btn-run:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.py-btn-test {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}

.py-btn-test:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

.py-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Description */
.py-description {
  padding: 12px 18px;
  background: rgba(79, 70, 229, 0.08);
  border-bottom: 1px solid rgba(79, 70, 229, 0.25);
  font-size: 0.88rem;
  color: #c7d2fe;
}

.py-description p {
  margin: 0;
  line-height: 1.5;
}

/* Editor */
.py-editor-wrapper {
  position: relative;
  display: flex;
  background: #141417;
  min-height: 170px;
}

.py-line-numbers {
  display: flex;
  flex-direction: column;
  padding: 14px 10px;
  font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #52525b;
  text-align: right;
  user-select: none;
  background: #18181c;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.py-editor {
  flex: 1;
  width: 100%;
  min-height: 170px;
  padding: 14px 16px;
  background: transparent;
  color: #38bdf8;
  font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
  font-size: 0.89rem;
  line-height: 1.5;
  border: none;
  resize: vertical;
  outline: none;
  tab-size: 4;
  white-space: pre;
}

/* Console Card */
.py-console-card {
  background: #0f0f12;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.py-console-nav {
  display: flex;
  background: #16161a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
}

.py-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #a1a1aa;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.py-tab-btn:hover {
  color: #f4f4f5;
  background: rgba(255, 255, 255, 0.03);
}

.py-tab-btn.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
  background: rgba(56, 189, 248, 0.06);
}

.py-tab-btn.tab-success.active {
  color: #10b981;
  border-bottom-color: #10b981;
  background: rgba(16, 185, 129, 0.06);
}

.py-tab-btn.tab-error.active {
  color: #ef4444;
  border-bottom-color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
}

.py-time-pill {
  font-size: 0.7rem;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #d4d4d8;
  font-family: monospace;
}

.py-result-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.03em;
}

.py-result-pill.passed {
  background: #065f46;
  color: #34d399;
}

.py-result-pill.failed {
  background: #7f1d1d;
  color: #f87171;
}

/* Tab Panes */
.py-tab-pane {
  padding: 16px 20px;
  min-height: 100px;
  max-height: 380px;
  overflow-y: auto;
}

.py-empty-output {
  font-size: 0.85rem;
  color: #71717a;
  font-style: italic;
  padding: 8px 0;
}

.py-msg-neutral {
  font-size: 0.85rem;
  color: #60a5fa;
}

.py-terminal-stdout {
  margin: 0;
  font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #e4e4e7;
  white-space: pre-wrap;
}

.py-error-box {
  margin-top: 10px;
}

.py-error-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #ef4444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.py-terminal-stderr {
  margin: 0;
  font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
  font-size: 0.84rem;
  line-height: 1.45;
  color: #fca5a5;
  white-space: pre-wrap;
  background: rgba(239, 68, 68, 0.1);
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
}

/* Runtime Error Banner */
.py-test-runtime-error {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.py-error-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
}

.py-error-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.py-error-info {
  display: flex;
  flex-direction: column;
}

.py-error-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f87171;
}

.py-error-desc {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #fca5a5;
  line-height: 1.4;
}

.py-traceback-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.py-traceback-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #a1a1aa;
}

/* Granular Test Cases UI */
.py-tests-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.py-tests-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.py-tests-summary.all-passed {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.py-tests-summary.has-failed {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.py-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.py-summary-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.py-summary-headings h4 {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 700;
}

.all-passed .py-summary-headings h4 {
  color: #34d399;
}

.has-failed .py-summary-headings h4 {
  color: #f87171;
}

.py-summary-headings p {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #a1a1aa;
}

.py-summary-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.badge-pass {
  background: #065f46;
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.badge-fail {
  background: #7f1d1d;
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

/* Test Cards */
.py-test-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.py-test-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.py-test-card.card-passed {
  background: rgba(24, 24, 27, 0.6);
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.py-test-card.card-failed {
  background: rgba(30, 20, 24, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.py-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.py-card-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.py-status-icon {
  font-size: 1rem;
  line-height: 1;
}

.py-test-title {
  font-weight: 600;
  font-size: 0.88rem;
  color: #f4f4f5;
}

.py-test-status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.pill-pass {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.pill-fail {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.py-card-details {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82rem;
}

.py-detail-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.py-detail-label {
  font-weight: 600;
  color: #a1a1aa;
  min-width: 105px;
}

.py-detail-code {
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #93c5fd;
  word-break: break-all;
}

.code-expected {
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.1);
}

.code-passed {
  color: #a7f3d0;
}

.code-actual-fail {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.15);
  font-weight: 700;
}

.py-detail-error {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fca5a5;
  font-size: 0.82rem;
  background: rgba(239, 68, 68, 0.08);
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 2px solid #ef4444;
}

/* Hint & Solution Panes */
.py-hint-box {
  display: flex;
  gap: 12px;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.25);
  padding: 14px 16px;
  border-radius: 8px;
}

.py-hint-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.py-hint-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #fde047;
  margin-bottom: 4px;
}

.py-hint-text {
  margin: 0;
  font-size: 0.86rem;
  color: #fef08a;
  line-height: 1.5;
}

.py-solution-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.py-solution-warning {
  margin: 0;
  font-size: 0.84rem;
  color: #fbbf24;
}

.py-solution-code {
  margin: 0;
  padding: 12px 14px;
  background: #18181c;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.86rem;
  color: #67e8f9;
  white-space: pre-wrap;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
