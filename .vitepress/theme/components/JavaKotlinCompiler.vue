<template>
  <div class="jvm-compiler-container" :class="{ 'is-fullscreen': isFullscreen, 'lang-kotlin': activeLang === 'kotlin', 'lang-java': activeLang === 'java' }">
    <!-- Top Header -->
    <div class="jvm-header">
      <div class="jvm-title-box">
        <div class="jvm-lang-switcher">
          <button
            type="button"
            class="lang-pill-btn"
            :class="{ active: activeLang === 'java' }"
            @click="switchLanguage('java')"
            title="Switch to Java 21 LTS"
          >
            <span class="lang-icon">☕</span>
            <span class="lang-text">Java 21</span>
          </button>
          <button
            type="button"
            class="lang-pill-btn"
            :class="{ active: activeLang === 'kotlin' }"
            @click="switchLanguage('kotlin')"
            title="Switch to Kotlin 2.0"
          >
            <span class="lang-icon">🟣</span>
            <span class="lang-text">Kotlin 2.0</span>
          </button>
        </div>

        <div class="jvm-meta">
          <span class="jvm-title">{{ title || (activeLang === 'java' ? 'Java Playground' : 'Kotlin Playground') }}</span>
          <span v-if="challengeId" class="jvm-id-tag">
            ID: {{ challengeId }} • {{ activeLang.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="jvm-actions">
        <!-- Compare Both Languages Button -->
        <button
          type="button"
          class="jvm-btn jvm-btn-compare"
          @click="compareBothLanguages"
          :disabled="isRunning || isTesting"
          :title="isEn ? 'Run and compare both Java and Kotlin implementations' : 'Rulează și compară implementările Java și Kotlin'"
        >
          <span>⚔️ {{ isEn ? 'Compare Both' : 'Compară Java vs Kotlin' }}</span>
        </button>

        <!-- GitHub Portfolio Button -->
        <button
          type="button"
          class="jvm-btn jvm-btn-icon jvm-btn-gh"
          @click="showGhModal = true"
          :title="isEn ? 'GitHub Portfolio & Sync' : 'Portofoliu GitHub & Sincronizare'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>{{ ghUser ? '@' + ghUser.username : 'GitHub' }}</span>
        </button>

        <!-- Reset Button -->
        <button
          type="button"
          class="jvm-btn jvm-btn-icon"
          @click="resetActiveCode"
          :title="isEn ? 'Reset code to template' : 'Resetează codul la șablonul inițial'"
          :disabled="isRunning || isTesting"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <!-- Fullscreen Button -->
        <button
          type="button"
          class="jvm-btn jvm-btn-icon"
          @click.stop="toggleFullscreen"
          :title="isFullscreen ? (isEn ? 'Exit Fullscreen (Esc)' : 'Ieși din ecran complet (Esc)') : (isEn ? 'Fullscreen IDE' : 'Ecran complet')"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        </button>

        <!-- Run Active Code Button -->
        <button
          type="button"
          class="jvm-btn jvm-btn-run"
          :class="activeLang === 'kotlin' ? 'btn-kotlin' : 'btn-java'"
          @click="runActiveCode"
          :disabled="isRunning || isTesting"
        >
          <svg v-if="!isRunning" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span v-else class="jvm-spinner"></span>
          <span>{{ isRunning ? (isEn ? 'Compiling...' : 'Se compilează...') : (isEn ? `Run ${activeLang === 'java' ? 'Java' : 'Kotlin'}` : `Rulează ${activeLang === 'java' ? 'Java' : 'Kotlin'}`) }}</span>
        </button>

        <!-- Test Solution Button -->
        <button
          v-if="hasTests"
          type="button"
          class="jvm-btn jvm-btn-test"
          @click="testActiveSolution"
          :disabled="isRunning || isTesting"
        >
          <svg v-if="!isTesting" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else class="jvm-spinner"></span>
          <span>{{ isTesting ? (isEn ? 'Testing...' : 'Verificare...') : (isEn ? 'Verify Solution' : 'Verifică Soluția') }}</span>
        </button>
      </div>
    </div>

    <!-- Description Banner (if provided) -->
    <div v-if="description" class="jvm-description-card">
      <div class="desc-header">
        <span class="desc-badge">🎯 {{ isEn ? 'Challenge Objective' : 'Obiectivul Provocării' }}</span>
        <span class="desc-sub">{{ isEn ? 'Solve in either Java or Kotlin — compare both!' : 'Rezolvă în Java sau Kotlin — compară ambele sintaxe!' }}</span>
      </div>
      <p class="desc-text">{{ description }}</p>
    </div>

    <!-- Code Editor Area with Real-time Syntax Highlighting -->
    <div class="jvm-editor-wrapper">
      <div ref="lineNumbersRef" class="jvm-line-numbers" aria-hidden="true">
        <span v-for="n in lineCount" :key="n">{{ n }}</span>
      </div>
      <div class="jvm-code-viewport">
        <pre ref="highlightRef" class="jvm-code-highlight" aria-hidden="true"><code v-html="highlightedCode"></code></pre>
        <textarea
          ref="editorRef"
          v-model="currentCode"
          class="jvm-editor-input"
          :placeholder="activeLang === 'java' ? '// Scrie cod Java aici...' : '// Scrie cod Kotlin aici...'"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          @keydown="handleEditorKeyDown"
          @scroll="syncScroll"
        ></textarea>
      </div>
    </div>

    <!-- Console & Results Card -->
    <div class="jvm-console-card">
      <div class="jvm-console-header">
        <div class="jvm-tabs">
          <button
            type="button"
            class="jvm-tab-btn"
            :class="{ active: activeTab === 'console' }"
            @click="activeTab = 'console'"
          >
            <span>💻 {{ isEn ? 'Console Output' : 'Consolă Execuție' }}</span>
          </button>
          <button
            v-if="hasTests"
            type="button"
            class="jvm-tab-btn"
            :class="{ active: activeTab === 'tests' }"
            @click="activeTab = 'tests'"
          >
            <span>🧪 {{ isEn ? 'Test Results' : 'Teste de Verificare' }}</span>
            <span v-if="testReport" class="tab-badge" :class="testReport.allPassed ? 'pass' : 'fail'">
              {{ testReport.passedCount }}/{{ testReport.totalCount }}
            </span>
          </button>
          <button
            v-if="hint"
            type="button"
            class="jvm-tab-btn"
            :class="{ active: activeTab === 'hint' }"
            @click="activeTab = 'hint'"
          >
            <span>💡 {{ isEn ? 'Hint' : 'Indiciu' }}</span>
          </button>
          <button
            v-if="javaSolution || kotlinSolution"
            type="button"
            class="jvm-tab-btn"
            :class="{ active: activeTab === 'solution' }"
            @click="activeTab = 'solution'"
          >
            <span>🔑 {{ isEn ? 'Model Solution' : 'Soluție Model' }}</span>
          </button>
        </div>

        <div v-if="executionMetrics" class="jvm-metrics">
          <span>⚡ {{ executionMetrics.executionTimeMs }}ms</span>
          <span class="metrics-lang">{{ executionMetrics.language.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Tab: Console Output -->
      <div v-if="activeTab === 'console'" class="jvm-tab-pane">
        <div v-if="!consoleOutput && !consoleError" class="jvm-empty-output">
          {{ isEn ? 'Click "Run Java" / "Run Kotlin" to execute, or "Compare Both" to see both side-by-side.' : 'Apasă pe "Rulează Codul" sau "Compară Java vs Kotlin" pentru a vedea rezultatele.' }}
        </div>
        <pre v-if="consoleOutput" class="jvm-terminal-stdout">{{ consoleOutput }}</pre>
        <div v-if="consoleError" class="jvm-error-box">
          <span class="err-icon">💥</span>
          <pre class="err-text">{{ consoleError }}</pre>
        </div>
      </div>

      <!-- Tab: Test Results -->
      <div v-if="activeTab === 'tests'" class="jvm-tab-pane">
        <div v-if="!testReport" class="jvm-empty-output">
          {{ isEn ? 'Click "Verify Solution" to run automated validation tests against your implementation.' : 'Apasă pe "Verifică Soluția" pentru a rula testele automate.' }}
        </div>
        <div v-else class="jvm-test-results">
          <div class="test-summary-bar" :class="testReport.allPassed ? 'summary-pass' : 'summary-fail'">
            <span class="summary-title">
              {{ testReport.allPassed ? (isEn ? '🎉 All Tests Passed!' : '🎉 Toate Testele au Trecut!') : (isEn ? '⚠️ Some Tests Failed' : '⚠️ Unele Teste au Eșuat') }}
            </span>
            <span class="summary-score">{{ testReport.passedCount }} / {{ testReport.totalCount }} {{ isEn ? 'passed' : 'trecute' }} ({{ testReport.durationMs }}ms)</span>
          </div>

          <div class="jvm-test-cards">
            <div
              v-for="test in testReport.tests"
              :key="test.id"
              class="jvm-test-card"
              :class="{ 'card-pass': test.passed, 'card-fail': !test.passed }"
            >
              <div class="test-card-header">
                <span class="test-status-pill">{{ test.passed ? '✅ PASSED' : '❌ FAILED' }}</span>
                <strong class="test-name">{{ test.name }}</strong>
              </div>
              <div class="test-card-body">
                <div v-if="test.call" class="test-row">
                  <span class="row-label">{{ isEn ? 'Call:' : 'Apel:' }}</span>
                  <code class="row-code">{{ test.call }}</code>
                </div>
                <div v-if="test.expected !== undefined" class="test-row">
                  <span class="row-label">{{ isEn ? 'Expected:' : 'Așteptat:' }}</span>
                  <code class="row-code exp">{{ JSON.stringify(test.expected) }}</code>
                </div>
                <div v-if="test.actual !== undefined" class="test-row">
                  <span class="row-label">{{ isEn ? 'Actual:' : 'Primit:' }}</span>
                  <code class="row-code act" :class="test.passed ? 'act-pass' : 'act-fail'">{{ JSON.stringify(test.actual) }}</code>
                </div>
                <div v-if="test.error" class="test-error-row">
                  <span>⚠️ {{ test.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Hint -->
      <div v-if="activeTab === 'hint'" class="jvm-tab-pane hint-pane">
        <div class="hint-card">
          <span class="hint-bulb">💡</span>
          <div>
            <strong>{{ isEn ? 'Architecture Hint' : 'Indiciu de Rezolvare' }}</strong>
            <p>{{ hint }}</p>
          </div>
        </div>
      </div>

      <!-- Tab: Solution -->
      <div v-if="activeTab === 'solution'" class="jvm-tab-pane solution-pane">
        <div class="solution-card">
          <div class="solution-header">
            <span>🔑 {{ isEn ? 'Official Model Solution (Java & Kotlin)' : 'Soluție Model Oficială (Java & Kotlin)' }}</span>
            <button type="button" class="load-sol-btn" @click="loadCurrentLanguageSolution">
              {{ isEn ? `Load ${activeLang.toUpperCase()} into Editor` : `Încarcă în Editor (${activeLang.toUpperCase()})` }}
            </button>
          </div>
          <div class="solution-previews">
            <div class="sol-col">
              <span class="col-tag java-tag">☕ Java 21</span>
              <pre class="jvm-preview-pre"><code v-html="highlightJvmCode(javaSolution, 'java')"></code></pre>
            </div>
            <div class="sol-col">
              <span class="col-tag kotlin-tag">🟣 Kotlin 2.0</span>
              <pre class="jvm-preview-pre"><code v-html="highlightJvmCode(kotlinSolution, 'kotlin')"></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GitHub Sync Modal -->
    <GitHubSyncModal v-model="showGhModal" :lang="isEn ? 'en' : 'ro'" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { executeJvmCode, verifyJvmChallenge } from '../jvmRunner.mjs'
import { highlightJvmCode } from '../jvmHighlighter.mjs'
import {
  resolveChallengeId,
  saveChallengeCode,
  loadChallengeCode,
  resetChallengeCode,
  isChallengeCompleted,
  markChallengeCompleted
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
  initialJava: { type: String, default: '' },
  initialKotlin: { type: String, default: '' },
  javaSolution: { type: String, default: '' },
  kotlinSolution: { type: String, default: '' },
  hint: { type: String, default: '' },
  testCases: { type: Array, default: () => [] }
})

const route = useRoute()
const isEn = computed(() => route.path.startsWith('/en/'))

const activeLang = ref('java')
const activeTab = ref('console')
const isFullscreen = ref(false)
const isRunning = ref(false)
const isTesting = ref(false)
const showGhModal = ref(false)

const ghUser = ref(null)
const isSyncingGh = ref(false)
const ghSyncResult = ref(null)

const javaCode = ref(props.initialJava)
const kotlinCode = ref(props.initialKotlin)
const consoleOutput = ref('')
const consoleError = ref('')
const executionMetrics = ref(null)
const testReport = ref(null)
const editorRef = ref(null)
const highlightRef = ref(null)
const lineNumbersRef = ref(null)

const currentCode = computed({
  get() {
    return activeLang.value === 'java' ? javaCode.value : kotlinCode.value
  },
  set(val) {
    if (activeLang.value === 'java') javaCode.value = val
    else kotlinCode.value = val
    persistCode()
  }
})

const highlightedCode = computed(() => {
  return highlightJvmCode(currentCode.value || '', activeLang.value)
})

function syncScroll(e) {
  const target = e.target
  if (!target) return
  if (highlightRef.value) {
    highlightRef.value.scrollTop = target.scrollTop
    highlightRef.value.scrollLeft = target.scrollLeft
  }
  if (lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = target.scrollTop
  }
}

const lineCount = computed(() => {
  return Math.max(8, (currentCode.value || '').split('\n').length)
})

const hasTests = computed(() => Array.isArray(props.testCases) && props.testCases.length > 0)

function switchLanguage(lang) {
  activeLang.value = lang
  consoleOutput.value = ''
  consoleError.value = ''
  executionMetrics.value = null
  if (editorRef.value) {
    editorRef.value.scrollTop = 0
    editorRef.value.scrollLeft = 0
  }
  if (highlightRef.value) {
    highlightRef.value.scrollTop = 0
    highlightRef.value.scrollLeft = 0
  }
  if (lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = 0
  }
}

function handleEditorKeyDown(e) {
  const textarea = editorRef.value || e.target
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const val = textarea.value

  // 1. Smart Indentation on Enter
  if (e.key === 'Enter') {
    e.preventDefault()
    const textBefore = val.substring(0, start)
    const textAfter = val.substring(end)
    const lineStart = textBefore.lastIndexOf('\n') + 1
    const currentLineBeforeCursor = textBefore.substring(lineStart)

    // Extract leading spaces
    const indentMatch = currentLineBeforeCursor.match(/^\s*/)
    const currentIndent = indentMatch ? indentMatch[0] : ''
    const trimmedBefore = currentLineBeforeCursor.trimEnd()
    const nextChar = textAfter.length > 0 ? textAfter[0] : ''

    // Between { and } -> create indented body + closing brace on next line
    if (trimmedBefore.endsWith('{') && nextChar === '}') {
      const innerIndent = currentIndent + '    '
      const insertion = '\n' + innerIndent + '\n' + currentIndent
      textarea.value = textBefore + insertion + textAfter
      const newCursorPos = start + 1 + innerIndent.length
      textarea.selectionStart = textarea.selectionEnd = newCursorPos
    } else if (trimmedBefore.endsWith('{') || trimmedBefore.endsWith('(') || trimmedBefore.endsWith('[')) {
      // Opening brace/parenthesis/bracket -> indent +4 spaces
      const extraIndent = currentIndent + '    '
      const insertion = '\n' + extraIndent
      textarea.value = textBefore + insertion + textAfter
      textarea.selectionStart = textarea.selectionEnd = start + insertion.length
    } else {
      // Normal newline -> preserve current line indentation
      const insertion = '\n' + currentIndent
      textarea.value = textBefore + insertion + textAfter
      textarea.selectionStart = textarea.selectionEnd = start + insertion.length
    }

    if (activeLang.value === 'java') javaCode.value = textarea.value
    else kotlinCode.value = textarea.value
    persistCode()
    return
  }

  // 2. Tab & Shift+Tab handling
  if (e.key === 'Tab') {
    e.preventDefault()
    if (e.shiftKey) {
      // Dedent 4 spaces
      const textBefore = val.substring(0, start)
      const lineStart = textBefore.lastIndexOf('\n') + 1
      const currentLine = val.substring(lineStart, end)
      if (currentLine.startsWith('    ')) {
        textarea.value = val.substring(0, lineStart) + currentLine.substring(4) + val.substring(end)
        textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4)
      }
    } else {
      // Indent 4 spaces
      const spaces = '    '
      textarea.value = val.substring(0, start) + spaces + val.substring(end)
      textarea.selectionStart = textarea.selectionEnd = start + 4
    }

    if (activeLang.value === 'java') javaCode.value = textarea.value
    else kotlinCode.value = textarea.value
    persistCode()
    return
  }

  // 3. Auto-close brackets & quotes
  const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'"
  }
  if (pairs[e.key]) {
    const close = pairs[e.key]
    const nextChar = val[start]

    // Skip over closing quote if already present
    if ((e.key === '"' || e.key === "'") && nextChar === e.key) {
      e.preventDefault()
      textarea.selectionStart = textarea.selectionEnd = start + 1
      return
    }

    // Auto-insert pair
    if (start === end) {
      e.preventDefault()
      textarea.value = val.substring(0, start) + e.key + close + val.substring(end)
      textarea.selectionStart = textarea.selectionEnd = start + 1
      if (activeLang.value === 'java') javaCode.value = textarea.value
      else kotlinCode.value = textarea.value
      persistCode()
      return
    }
  }

  // 4. Skip closing bracket when typed
  if ([')', ']', '}', '"', "'"].includes(e.key) && val[start] === e.key && start === end) {
    e.preventDefault()
    textarea.selectionStart = textarea.selectionEnd = start + 1
    return
  }

  // 5. Smart Backspace over 4-space indentations
  if (e.key === 'Backspace' && start === end) {
    const textBefore = val.substring(0, start)
    const lineStart = textBefore.lastIndexOf('\n') + 1
    const lineBeforeCursor = textBefore.substring(lineStart)
    if (lineBeforeCursor.length > 0 && lineBeforeCursor.endsWith('    ') && /^\s+$/.test(lineBeforeCursor)) {
      e.preventDefault()
      textarea.value = val.substring(0, start - 4) + val.substring(start)
      textarea.selectionStart = textarea.selectionEnd = start - 4
      if (activeLang.value === 'java') javaCode.value = textarea.value
      else kotlinCode.value = textarea.value
      persistCode()
      return
    }
  }
}

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

function persistCode() {
  if (!props.challengeId) return
  saveChallengeCode(`${props.challengeId}_java`, javaCode.value)
  saveChallengeCode(`${props.challengeId}_kotlin`, kotlinCode.value)
}

function resetActiveCode() {
  if (activeLang.value === 'java') {
    javaCode.value = props.initialJava
    resetChallengeCode(`${props.challengeId}_java`)
  } else {
    kotlinCode.value = props.initialKotlin
    resetChallengeCode(`${props.challengeId}_kotlin`)
  }
  consoleOutput.value = ''
  consoleError.value = ''
  testReport.value = null
}

function loadCurrentLanguageSolution() {
  if (activeLang.value === 'java' && props.javaSolution) {
    javaCode.value = props.javaSolution
  } else if (activeLang.value === 'kotlin' && props.kotlinSolution) {
    kotlinCode.value = props.kotlinSolution
  }
  persistCode()
  activeTab.value = 'console'
}

function runActiveCode() {
  isRunning.value = true
  activeTab.value = 'console'
  consoleOutput.value = ''
  consoleError.value = ''

  setTimeout(() => {
    const code = activeLang.value === 'java' ? javaCode.value : kotlinCode.value
    const res = executeJvmCode(code, activeLang.value)
    isRunning.value = false
    consoleOutput.value = res.stdout
    consoleError.value = res.error
    executionMetrics.value = {
      executionTimeMs: res.executionTimeMs,
      language: res.language
    }
  }, 40)
}

function compareBothLanguages() {
  isRunning.value = true
  activeTab.value = 'console'
  consoleOutput.value = ''
  consoleError.value = ''

  setTimeout(() => {
    const javaRes = executeJvmCode(javaCode.value, 'java')
    const kotlinRes = executeJvmCode(kotlinCode.value, 'kotlin')
    isRunning.value = false

    const divider = '─'.repeat(48)
    const headerJava = `☕ [JAVA 21 OUTPUT] (${javaRes.executionTimeMs}ms)\n${divider}\n`
    const bodyJava = javaRes.error ? `💥 Error: ${javaRes.error}` : (javaRes.stdout || '(no stdout)')
    const headerKotlin = `\n\n🟣 [KOTLIN 2.0 OUTPUT] (${kotlinRes.executionTimeMs}ms)\n${divider}\n`
    const bodyKotlin = kotlinRes.error ? `💥 Error: ${kotlinRes.error}` : (kotlinRes.stdout || '(no stdout)')

    consoleOutput.value = headerJava + bodyJava + headerKotlin + bodyKotlin
    executionMetrics.value = {
      executionTimeMs: javaRes.executionTimeMs + kotlinRes.executionTimeMs,
      language: 'JAVA & KOTLIN'
    }
  }, 60)
}

function testActiveSolution() {
  if (!hasTests.value) return
  isTesting.value = true
  activeTab.value = 'tests'

  setTimeout(() => {
    const code = activeLang.value === 'java' ? javaCode.value : kotlinCode.value
    const report = verifyJvmChallenge({
      code,
      language: activeLang.value,
      testCases: props.testCases
    })

    isTesting.value = false
    testReport.value = report

    if (report.allPassed && props.challengeId) {
      markChallengeCompleted(`${props.challengeId}_${activeLang.value}`, {
        code,
        durationMs: report.durationMs,
        title: props.title
      })

      // Automatic 1-Click GitHub Portfolio Sync if connected
      if (ghUser.value) {
        isSyncingGh.value = true
        syncChallengeToGitHub({
          challengeId: `${props.challengeId}_${activeLang.value}`,
          title: `${props.title} (${activeLang.value.toUpperCase()})`,
          code,
          language: activeLang.value,
          sessionNumber: 1,
          sessionTitle: typeof document !== 'undefined' ? document.title.split('|')[0].trim() : 'Java vs Kotlin'
        }).then(res => {
          ghSyncResult.value = res
        }).catch(err => {
          console.warn('[GitHub Sync] Error during JVM auto-commit:', err)
        }).finally(() => {
          isSyncingGh.value = false
        })
      }
    }
  }, 50)
}

onMounted(() => {
  if (props.challengeId) {
    let savedJava = loadChallengeCode(`${props.challengeId}_java`, props.initialJava)
    let savedKotlin = loadChallengeCode(`${props.challengeId}_kotlin`, props.initialKotlin)

    // Clear stale cached code if it was mistakenly saved as the full solution before completion
    if (savedJava && props.javaSolution && savedJava.trim() === props.javaSolution.trim() && !isChallengeCompleted(`${props.challengeId}_java`)) {
      savedJava = props.initialJava
      saveChallengeCode(`${props.challengeId}_java`, props.initialJava)
    }
    if (savedKotlin && props.kotlinSolution && savedKotlin.trim() === props.kotlinSolution.trim() && !isChallengeCompleted(`${props.challengeId}_kotlin`)) {
      savedKotlin = props.initialKotlin
      saveChallengeCode(`${props.challengeId}_kotlin`, props.initialKotlin)
    }

    if (savedJava) javaCode.value = savedJava
    if (savedKotlin) kotlinCode.value = savedKotlin
  }

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
</script>

<style scoped>
.jvm-compiler-container {
  margin: 28px 0;
  border-radius: 18px;
  background: #0e111a;
  border: 1px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: var(--vp-font-family-base, sans-serif);
  transition: all 0.28s ease;
}

.jvm-compiler-container.lang-java {
  border-color: rgba(249, 115, 22, 0.35);
}

.jvm-compiler-container.lang-kotlin {
  border-color: rgba(168, 85, 247, 0.38);
}

.jvm-compiler-container.is-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  z-index: 999999 !important;
  border-radius: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  background: #0e111a !important;
  overflow: hidden !important;
}

/* Header */
.jvm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  background: #141724;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.jvm-title-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.jvm-lang-switcher {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.35);
  padding: 3px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 9px;
  background: transparent;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-pill-btn.active {
  background: #1e2238;
  color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.jvm-compiler-container.lang-java .lang-pill-btn.active {
  color: #fdba74;
  border: 1px solid rgba(249, 115, 22, 0.4);
}

.jvm-compiler-container.lang-kotlin .lang-pill-btn.active {
  color: #d8b4fe;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.jvm-meta {
  display: flex;
  flex-direction: column;
}

.jvm-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: #f1f5f9;
}

.jvm-id-tag {
  font-size: 0.68rem;
  color: #94a3b8;
}

/* Actions */
.jvm-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.jvm-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 9px;
  font-size: 0.76rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.jvm-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.jvm-btn-icon {
  padding: 6px 9px;
}

.jvm-btn-compare {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(129, 140, 248, 0.45);
  color: #a5b4fc;
}

.jvm-btn-compare:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.36);
  color: #fff;
}

.jvm-btn-run.btn-java {
  background: #ea580c;
  border-color: #f97316;
  color: #fff;
}

.jvm-btn-run.btn-java:hover:not(:disabled) {
  background: #c2410c;
}

.jvm-btn-run.btn-kotlin {
  background: #9333ea;
  border-color: #a855f7;
  color: #fff;
}

.jvm-btn-run.btn-kotlin:hover:not(:disabled) {
  background: #7e22ce;
}

.jvm-btn-test {
  background: #059669;
  border-color: #10b981;
  color: #fff;
}

.jvm-btn-test:hover:not(:disabled) {
  background: #047857;
}

/* Description Card */
.jvm-description-card {
  padding: 12px 18px;
  background: rgba(30, 41, 59, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.desc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.desc-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: #38bdf8;
  text-transform: uppercase;
}

.desc-sub {
  font-size: 0.7rem;
  color: #94a3b8;
}

.desc-text {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.5;
  color: #e2e8f0;
}

/* Editor */
.jvm-editor-wrapper {
  position: relative;
  display: flex;
  height: 340px;
  min-height: 240px;
  max-height: 520px;
  background: #090b12;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.is-fullscreen .jvm-editor-wrapper {
  flex: 1 1 auto !important;
  height: auto !important;
  min-height: 200px !important;
  max-height: none !important;
  overflow: hidden !important;
}

.jvm-line-numbers {
  width: 46px;
  height: 100%;
  padding: 14px 8px;
  background: rgba(0, 0, 0, 0.35);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: #475569;
  font-family: inherit;
  font-size: 0.86rem;
  line-height: 1.6;
  text-align: right;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

.jvm-line-numbers span {
  display: block;
}

.jvm-code-viewport {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  background: #0d1117;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.jvm-code-highlight,
.jvm-editor-input {
  grid-area: 1 / 1 / 2 / 2;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.86rem;
  line-height: 1.6;
  tab-size: 4;
  white-space: pre;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-radius: 0;
}

.jvm-code-highlight {
  pointer-events: none;
  z-index: 1;
  background: transparent;
  overflow: hidden;
  color: #abb2bf;
}

.jvm-code-highlight code {
  font-family: inherit;
  background: transparent !important;
  padding: 0 !important;
}

.jvm-editor-input {
  z-index: 2;
  background: transparent;
  color: transparent !important;
  caret-color: #38bdf8;
  resize: none !important;
  overflow: auto;
  -webkit-text-fill-color: transparent;
}

.jvm-editor-input::selection {
  background: rgba(56, 189, 248, 0.3) !important;
  color: transparent !important;
}

/* Syntax Color Tokens (JetBrains / VS Code Dark Pro) */
:deep(.tok-keyword) {
  color: #c678dd;
  font-weight: 700;
}
:deep(.tok-type) {
  color: #e5c07b;
  font-weight: 600;
}
:deep(.tok-string) {
  color: #98c379;
}
:deep(.tok-interpolation) {
  color: #e06c75;
  font-weight: 600;
}
:deep(.tok-number) {
  color: #d19a66;
}
:deep(.tok-comment) {
  color: #6a737d;
  font-style: italic;
}
:deep(.tok-annotation) {
  color: #e5c07b;
  font-style: italic;
}
:deep(.tok-function) {
  color: #61afef;
  font-weight: 600;
}
:deep(.tok-operator) {
  color: #56b6c2;
  font-weight: 600;
}
:deep(.tok-boolean) {
  color: #d19a66;
  font-weight: 700;
}
:deep(.tok-variable) {
  color: #abb2bf;
}

.jvm-preview-pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #abb2bf;
  white-space: pre-wrap;
  word-break: break-word;
  background: transparent;
}

/* Console Card */
.jvm-console-card {
  background: #0c0e18;
}

.is-fullscreen .jvm-console-card {
  flex: 0 0 44% !important;
  min-height: 200px !important;
  max-height: 48vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.jvm-console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #111422;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 14px;
}

.jvm-tabs {
  display: flex;
  gap: 4px;
}

.jvm-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.jvm-tab-btn.active {
  color: #f1f5f9;
  border-bottom-color: #38bdf8;
  background: rgba(255, 255, 255, 0.03);
}

.tab-badge {
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
}

.tab-badge.pass {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.tab-badge.fail {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.jvm-metrics {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #94a3b8;
}

.metrics-lang {
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 800;
}

/* Tab Panes */
.jvm-tab-pane {
  padding: 14px 18px;
  min-height: 140px;
  max-height: 340px;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.is-fullscreen .jvm-tab-pane {
  flex: 1 1 0 !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow-y: auto !important;
}

.jvm-empty-output {
  color: #64748b;
  font-size: 0.8rem;
  font-style: italic;
  padding: 14px 0;
}

.jvm-terminal-stdout {
  margin: 0;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.84rem;
  line-height: 1.5;
  color: #a7f3d0;
  white-space: pre-wrap;
}

.jvm-error-box {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.err-icon {
  font-size: 1rem;
}

.err-text {
  margin: 0;
  color: #fca5a5;
  font-size: 0.8rem;
  white-space: pre-wrap;
}

/* Test Results */
.test-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-weight: 800;
  font-size: 0.82rem;
}

.summary-pass {
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #34d399;
}

.summary-fail {
  background: rgba(239, 68, 68, 0.16);
  border: 1px solid rgba(239, 68, 68, 0.45);
  color: #f87171;
}

.jvm-test-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jvm-test-card {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.jvm-test-card.card-pass {
  border-left: 3px solid #10b981;
}

.jvm-test-card.card-fail {
  border-left: 3px solid #ef4444;
}

.test-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.test-status-pill {
  font-size: 0.68rem;
  font-weight: 800;
}

.test-name {
  font-size: 0.82rem;
  color: #f1f5f9;
}

.test-row {
  display: flex;
  gap: 8px;
  font-size: 0.78rem;
  margin-top: 3px;
}

.row-label {
  color: #94a3b8;
  min-width: 65px;
}

.row-code {
  font-family: var(--vp-font-family-mono, monospace);
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.35);
}

.row-code.exp {
  color: #93c5fd;
}

.row-code.act-pass {
  color: #86efac;
}

.row-code.act-fail {
  color: #fca5a5;
}

.test-error-row {
  margin-top: 6px;
  font-size: 0.76rem;
  color: #fca5a5;
}

/* Hint & Solution */
.hint-card {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #e0f2fe;
}

.hint-bulb {
  font-size: 1.3rem;
}

.hint-card p {
  margin: 4px 0 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
}

.solution-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #f1f5f9;
}

.load-sol-btn {
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.45);
  color: #7dd3fc;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.load-sol-btn:hover {
  background: #0284c7;
  color: #fff;
}

.solution-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.solution-previews {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: 0;
}

@media (max-width: 680px) {
  .solution-previews {
    grid-template-columns: 1fr;
  }
}

.sol-col {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 0;
  max-height: 270px;
  overflow-y: auto !important;
}

.is-fullscreen .sol-col {
  max-height: calc(48vh - 90px) !important;
}

.col-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.java-tag {
  background: rgba(249, 115, 22, 0.2);
  color: #fdba74;
}

.kotlin-tag {
  background: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
}

.sol-col pre {
  margin: 0;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.8rem;
  color: #f8fafc;
  white-space: pre-wrap;
  word-break: break-word;
}

.jvm-btn-gh {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
}

.jvm-btn-gh:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.jvm-tab-pane::-webkit-scrollbar,
.sol-col::-webkit-scrollbar,
.jvm-test-cards::-webkit-scrollbar,
.jvm-editor-input::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.jvm-tab-pane::-webkit-scrollbar-track,
.sol-col::-webkit-scrollbar-track,
.jvm-test-cards::-webkit-scrollbar-track,
.jvm-editor-input::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.jvm-tab-pane::-webkit-scrollbar-thumb,
.sol-col::-webkit-scrollbar-thumb,
.jvm-test-cards::-webkit-scrollbar-thumb,
.jvm-editor-input::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.jvm-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: jvm-spin 0.6s linear infinite;
}

@keyframes jvm-spin {
  to { transform: rotate(360deg); }
}
</style>

