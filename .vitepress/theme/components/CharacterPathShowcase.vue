<template>
  <section class="qa-path-showcase">
    <div class="qa-showcase-container">
      <!-- Top Platform Metrics Bento Strip -->
      <div class="qa-stats-ribbon">
        <div class="qa-stat-item">
          <span class="qa-stat-val">06</span>
          <span class="qa-stat-lbl">{{ isEn ? 'Interactive Career Tracks' : 'Trasee & Cursuri Complete' }}</span>
        </div>
        <div class="qa-stat-divider"></div>
        <div class="qa-stat-item">
          <span class="qa-stat-val">{{ allHomepageTips.length }}+</span>
          <span class="qa-stat-lbl">{{ isEn ? 'Course & Mentor Pro-Tips' : 'Sfaturi din Cursuri & Articole' }}</span>
        </div>
        <div class="qa-stat-divider"></div>
        <div class="qa-stat-item">
          <span class="qa-stat-val">3D + IDE</span>
          <span class="qa-stat-lbl">{{ isEn ? 'In-Browser Python 3.11 Sandbox' : 'Compilator Python 3.11 în Browser' }}</span>
        </div>
        <div class="qa-stat-divider"></div>
        <div class="qa-stat-item">
          <span class="qa-stat-val">1-Click</span>
          <span class="qa-stat-lbl">{{ isEn ? 'GitHub Portfolio Auto-Sync' : 'Portofoliu GitHub Automat' }}</span>
        </div>
      </div>

      <!-- Section Heading -->
      <div class="qa-showcase-header">
        <span class="qa-eyebrow-pill">
          ⚡ {{ isEn ? 'INTERACTIVE 3D MENTORSHIP EXPERIENCE' : 'EXPERIENȚĂ EDUCAȚIONALĂ 3D INTERACTIVĂ' }}
        </span>
        <h2 class="qa-showcase-title">
          {{ isEn ? 'Choose Your 3D Mentor & Career Path' : 'Alege-ți Mentorul 3D & Traseul de Carieră' }}
        </h2>
        <p class="qa-showcase-subtitle">
          {{ isEn
            ? `Hover and interact with Mr. QA Wizard and Nova in real-time 3D. Select a mentor below to customize your learning path and explore ${allHomepageTips.length}+ real-world QA & Automation pro-tips extracted from all courses and articles!`
            : `Interacționează în timp real 3D cu Mr. QA Wizard și Nova. Alege un mentor pentru a filtra catalogul de mai jos și a explora cele ${allHomepageTips.length}+ sfaturi practice extrase din toate cursurile și articolele platformei!`
          }}
        </p>
      </div>

      <!-- Dual Interactive 3D Character Cards with 3D Perspective Tilt -->
      <div
        class="qa-characters-grid"
        :class="{
          'wiz-migrated-follow': !wizInCardUI && novaInCardUI && isFollowModeUI,
          'nova-migrated-follow': !novaInCardUI && wizInCardUI && isFollowModeUI
        }"
      >
        <!-- Character 1: Mr. QA Wizard -->
        <div
          class="qa-char-card wizard-theme"
          :class="{
            'is-selected': selectedPath === 'wizard',
            'is-migrated-empty': !wizInCardUI && isFollowModeUI,
            'is-centered-mentor': wizInCardUI && !novaInCardUI && isFollowModeUI
          }"
          :style="wizCardStyle"
          @mousemove="onCardMove($event, 'wizard')"
          @mouseleave="onCardLeave('wizard')"
          @click="selectMentor('wizard')"
        >
          <div class="char-card-glow"></div>
          <div class="char-top-row">
            <div class="char-3d-canvas-pod" :class="{ 'pod-empty-portal': !wizInCardUI }">
              <canvas ref="wizCanvasRef" class="mentor-3d-mini-canvas"></canvas>
              <span class="live-3d-tag">
                {{ !wizInCardUI && isFollowModeUI ? (isEn ? '🧲 FOLLOWING' : '🧲 PE ECRAN') : '3D LIVE' }}
              </span>
            </div>
            <div class="char-identity">
              <span class="char-role-badge wizard-badge">
                🧙‍♂️ {{ isEn ? 'QUALITY & ISTQB WIZARD' : 'MAESTRUL CALITĂȚII & ISTQB' }}
              </span>
              <h3 class="char-name">Mr. QA Wizard</h3>
              <p class="char-tagline">
                {{ isEn
                  ? 'Guardian of Software Architecture, SQL, APIs & Edge-Case Hunting'
                  : 'Gardianul Arhitecturii IT, Testării Manuale, SQL, API & Certificării ISTQB'
                }}
              </p>
            </div>
          </div>

          <blockquote class="char-quote">
            {{ isEn
              ? '“No bug escapes my 3D magnifying staff! First we master how CPUs, networks, databases, and APIs work under the hood—then we design bulletproof test suites.”'
              : '„Niciun bug nu trece de lupa mea 3D! Mai întâi demistificăm calculatoarele, rețelele, SQL și API-urile sub capotă — apoi stăpânim test design-ul ISTQB.”'
            }}
          </blockquote>

          <div class="char-skills">
            <span class="skill-chip">💻 {{ isEn ? 'Hardware & OS Internals' : 'Arhitectură IT & OS' }}</span>
            <span class="skill-chip">📐 {{ isEn ? 'ISTQB Test Design' : 'Test Design & ISTQB' }}</span>
            <span class="skill-chip">🐞 Jira &amp; Zephyr</span>
            <span class="skill-chip">🔌 Postman API &amp; SQL</span>
          </div>

          <div class="char-card-actions">
            <button
              type="button"
              class="char-select-btn wizard-btn"
              @click.stop="toggleFilter('wizard')"
            >
              <span>
                {{ selectedPath === 'wizard'
                  ? (isEn ? '✓ Mr. QA Wizard Track Active' : '✓ Traseul Mr. QA Wizard Activ')
                  : (isEn ? 'Activate Mr. QA Wizard Track' : 'Activează Traseul Mr. QA Wizard')
                }}
              </span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Character 2: Nova — The AI & Automation Cyber-Architect -->
        <div
          class="qa-char-card nova-theme"
          :class="{
            'is-selected': selectedPath === 'nova',
            'is-migrated-empty': !novaInCardUI && isFollowModeUI,
            'is-centered-mentor': novaInCardUI && !wizInCardUI && isFollowModeUI
          }"
          :style="novaCardStyle"
          @mousemove="onCardMove($event, 'nova')"
          @mouseleave="onCardLeave('nova')"
          @click="selectMentor('nova')"
        >
          <div class="char-card-glow"></div>
          <div class="char-top-row">
            <div class="char-3d-canvas-pod" :class="{ 'pod-empty-portal': !novaInCardUI }">
              <canvas ref="novaCanvasRef" class="mentor-3d-mini-canvas"></canvas>
              <span class="live-3d-tag nova-tag">
                {{ !novaInCardUI && isFollowModeUI ? (isEn ? '🧲 FOLLOWING' : '🧲 PE ECRAN') : '3D LIVE' }}
              </span>
            </div>
            <div class="char-identity">
              <span class="char-role-badge nova-badge">
                🤖 {{ isEn ? 'AI & E2E AUTOMATION ARCHITECT' : 'CYBER-ARHITECT AI & AUTOMATION' }}
              </span>
              <h3 class="char-name">Nova</h3>
              <p class="char-tagline">
                {{ isEn
                  ? 'Autonomous Engineer for Playwright, Python IDE & OpenAI RAG Pipelines'
                  : 'Specialist în TypeScript & Playwright, Framework-uri Python & Agenți AI RAG'
                }}
              </p>
            </div>
          </div>

          <blockquote class="char-quote">
            {{ isEn
              ? '“Why test manually 100 times when we can engineer resilient Playwright suites, in-browser Python scripts, and n8n + OpenAI RAG agents in seconds?”'
              : '„De ce să testezi manual de 100 de ori când putem construi suite E2E în Playwright, scripturi Python direct în browser și agenți AI cu n8n & RAG?”'
            }}
          </blockquote>

          <div class="char-skills">
            <span class="skill-chip">🎭 TypeScript &amp; Playwright</span>
            <span class="skill-chip">🐍 Python, Pytest &amp; Selene</span>
            <span class="skill-chip">🧠 n8n &amp; OpenAI RAG</span>
            <span class="skill-chip">🚀 CI/CD GitHub Actions</span>
          </div>

          <div class="char-card-actions">
            <button
              type="button"
              class="char-select-btn nova-btn"
              @click.stop="toggleFilter('nova')"
            >
              <span>
                {{ selectedPath === 'nova'
                  ? (isEn ? '✓ Nova Automation Track Active' : '✓ Traseul Nova Automation Activ')
                  : (isEn ? 'Activate Nova Automation Track' : 'Activează Traseul Nova Automation')
                }}
              </span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Dynamic LMS Knowledge Vault Deck (All Courses, Sessions, Articles + Mentor Vault) -->
      <div class="qa-tips-vault-deck">
        <div class="vault-header-row">
          <div class="vault-title-group">
            <span class="vault-badge-pill">
              💡 {{
                isEn
                  ? `LIVE LMS KNOWLEDGE VAULT (${allHomepageTips.length} TIPS AUTO-INDEXED)`
                  : `SEIFUL DINAMIC AL PLATFORMEI (${allHomepageTips.length} SFATURI DIN CURSURI & ARTICOLE)`
              }}
            </span>
            <h3 class="vault-heading">
              {{ isEn ? 'Daily QA, Playwright, Python, SQL & Interview Wisdom' : 'Sfaturi Esențiale Extrase din Toate Cursurile, Sesiunile & Articolele' }}
            </h3>
          </div>
          <div class="vault-nav-controls">
            <button type="button" class="vault-ctrl-btn" @click="prevVaultTip" :aria-label="isEn ? 'Previous tip' : 'Sfatul anterior'">
              ◀
            </button>
            <span class="vault-counter">
              {{ (currentTipIndex % Math.max(1, filteredVaultTips.length)) + 1 }} / {{ filteredVaultTips.length }}
            </span>
            <button type="button" class="vault-ctrl-btn" @click="nextVaultTip" :aria-label="isEn ? 'Next tip' : 'Sfatul următor'">
              ▶
            </button>
            <button type="button" class="vault-ctrl-btn random-btn" @click="randomVaultTip">
              🎲 {{ isEn ? 'Random Tip' : 'Sfat Aleatoriu' }}
            </button>
          </div>
        </div>

        <!-- Category Chips -->
        <div class="vault-categories-bar">
          <button
            v-for="cat in categoriesWithCounts"
            :key="cat.id"
            type="button"
            class="vault-cat-chip"
            :class="{ active: selectedTipCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ isEn ? cat.labelEn : cat.labelRo }}</span>
          </button>
        </div>

        <!-- Active Tip Spotlight Card -->
        <div v-if="activeTipObj" class="vault-active-tip-card" :class="activeTipObj.mentor">
          <div class="tip-mentor-badge-col">
            <span class="tip-mentor-avatar">{{ activeTipObj.mentor === 'wizard' ? '🧙‍♂️' : '🤖' }}</span>
            <div class="tip-mentor-meta">
              <strong>{{ activeTipObj.mentor === 'wizard' ? 'Mr. QA Wizard' : 'Nova Cyber-Architect' }}</strong>
              <span class="tip-id-tag">
                📘 {{ activeTipObj.sourceTitle || activeTipObj.courseLabel || 'QualiAdept Vault' }}
              </span>
            </div>
          </div>
          <div class="vault-tip-structured">
            <h4 v-if="activeTipObj.tipTitle" class="vault-tip-title">
              💡 {{ activeTipObj.tipTitle }}
            </h4>
            <p class="tip-body-text">
              {{ activeTipObj.tipBody || activeTipObj.text || (isEn ? activeTipObj.en : activeTipObj.ro) }}
            </p>
          </div>
          <div class="tip-card-footer">
            <button type="button" class="copy-tip-btn" @click="copyActiveTip">
              {{ copiedTip ? (isEn ? '✓ Copied!' : '✓ Copiat!') : (isEn ? '📋 Copy Tip' : '📋 Copiază Sfatul') }}
            </button>
            <a
              v-if="activeTipObj.url && !isHomePageRoute(activeTipObj.url)"
              :href="activeTipObj.url"
              class="open-source-lesson-btn"
            >
              📖 {{ isEn ? 'Open Material →' : 'Vezi Lecția →' }}
            </a>
            <button type="button" class="next-inline-btn" @click="nextVaultTip">
              {{ isEn ? 'Next Tip →' : 'Următorul Sfat →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Bar for Bento Grid Courses Below -->
      <div class="qa-courses-filter-bar">
        <div class="filter-bar-left">
          <span class="courses-eyebrow">BENTO CURRICULUM</span>
          <h3 class="courses-section-label">
            {{ isEn ? 'Interactive Course Architecture' : 'Arhitectura Cursurilor & Laboratoarelor' }}
          </h3>
        </div>
        <div class="filter-pills-group">
          <button
            type="button"
            class="track-pill"
            :class="{ active: selectedPath === 'all' }"
            @click="setFilter('all')"
          >
            {{ isEn ? 'All Tracks (06)' : 'Toate Cursurile (06)' }}
          </button>
          <button
            type="button"
            class="track-pill wizard-pill"
            :class="{ active: selectedPath === 'wizard' }"
            @click="setFilter('wizard')"
          >
            🧙‍♂️ {{ isEn ? 'Mr. QA Wizard Track' : 'Traseul Mr. QA Wizard' }}
          </button>
          <button
            type="button"
            class="track-pill nova-pill"
            :class="{ active: selectedPath === 'nova' }"
            @click="setFilter('nova')"
          >
            🤖 {{ isEn ? 'Nova Automation Track' : 'Traseul Nova Automation' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { renderWizard3D, renderNova3D, stageBridge, renderStagePortalPad } from './Scene3DEngine.mjs'
import { TIP_CATEGORIES, MENTOR_TIPS_VAULT } from '../mentorTipsVault.mjs'
import { data as lmsExtractedTips } from '../lmsContentTips.data.mjs'
import { getContextualTipsForRoute, isHomePageRoute } from '../lmsTipsExtractor.mjs'

const route = useRoute()
const selectedPath = ref('all')
const wizCanvasRef = ref(null)
const novaCanvasRef = ref(null)
const wizInCardUI = ref(true)
const novaInCardUI = ref(true)
const isFollowModeUI = ref(false)
let rafId = null

const selectedTipCategory = ref('all')
const currentTipIndex = ref(0)
const copiedTip = ref(false)

const isEn = computed(() => route.path.startsWith('/en/'))

const allHomepageTips = computed(() => {
  const res = getContextualTipsForRoute({
    routePath: isEn.value ? '/en/' : '/ro/',
    lang: isEn.value ? 'en' : 'ro',
    extractedTips: Array.isArray(lmsExtractedTips) ? lmsExtractedTips : [],
    baseVaultTips: MENTOR_TIPS_VAULT,
    requestedScope: 'all',
    categoryFilter: 'all'
  })
  return res.tips.length > 0 ? res.tips : MENTOR_TIPS_VAULT
})

const categoriesWithCounts = computed(() => {
  const all = allHomepageTips.value
  return TIP_CATEGORIES.map((cat) => {
    if (cat.id === 'all') {
      return {
        ...cat,
        labelRo: `Toate (${all.length})`,
        labelEn: `All Tips (${all.length})`
      }
    }
    const count = all.filter((t) => t.category === cat.id).length
    const cleanRo = cat.labelRo.replace(/\s*\(\d+\)$/, '')
    const cleanEn = cat.labelEn.replace(/\s*\(\d+\)$/, '')
    return {
      ...cat,
      labelRo: `${cleanRo} (${count})`,
      labelEn: `${cleanEn} (${count})`
    }
  })
})

const filteredVaultTips = computed(() => {
  let list = allHomepageTips.value
  if (selectedTipCategory.value !== 'all') {
    list = list.filter((t) => t.category === selectedTipCategory.value)
  }
  if (selectedPath.value === 'wizard' || selectedPath.value === 'nova') {
    const byMentor = list.filter((t) => t.mentor === selectedPath.value)
    if (byMentor.length > 0) list = byMentor
  }
  return list
})

const activeTipObj = computed(() => {
  const list = filteredVaultTips.value
  if (!list.length) return allHomepageTips.value[0] || MENTOR_TIPS_VAULT[0]
  return list[currentTipIndex.value % list.length]
})

function selectCategory(catId) {
  selectedTipCategory.value = catId
  currentTipIndex.value = 0
}

function nextVaultTip() {
  const len = filteredVaultTips.value.length || 1
  currentTipIndex.value = (currentTipIndex.value + 1) % len
}

function prevVaultTip() {
  const len = filteredVaultTips.value.length || 1
  currentTipIndex.value = (currentTipIndex.value - 1 + len) % len
}

function randomVaultTip() {
  const len = filteredVaultTips.value.length || 1
  if (len <= 1) return
  let nextIdx = Math.floor(Math.random() * len)
  if (nextIdx === currentTipIndex.value) {
    nextIdx = (nextIdx + 1) % len
  }
  currentTipIndex.value = nextIdx
}

function copyActiveTip() {
  if (!activeTipObj.value || typeof navigator === 'undefined') return
  const text = activeTipObj.value.text || (isEn.value ? activeTipObj.value.en : activeTipObj.value.ro)
  navigator.clipboard?.writeText(text)
  copiedTip.value = true
  setTimeout(() => {
    copiedTip.value = false
  }, 1800)
}

const wizTilt = reactive({ rx: 0, ry: 0, yaw: 0, pitch: 0, hovered: false })
const novaTilt = reactive({ rx: 0, ry: 0, yaw: 0, pitch: 0, hovered: false })

const wizCardStyle = computed(() => {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 860
  const isCentered = isDesktop && wizInCardUI.value && !novaInCardUI.value && isFollowModeUI.value
  const isMigrated = !wizInCardUI.value && isFollowModeUI.value
  const tx = isCentered ? '24%' : '0px'
  const sc = isMigrated ? 0.94 : (isCentered ? 1.02 : 1)
  return {
    transform: `perspective(900px) translateX(${tx}) translateY(${wizTilt.hovered ? -6 : 0}px) rotateX(${wizTilt.rx}deg) rotateY(${wizTilt.ry}deg) scale(${sc})`
  }
})

const novaCardStyle = computed(() => {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 860
  const isCentered = isDesktop && novaInCardUI.value && !wizInCardUI.value && isFollowModeUI.value
  const isMigrated = !novaInCardUI.value && isFollowModeUI.value
  const tx = isCentered ? '-24%' : '0px'
  const sc = isMigrated ? 0.94 : (isCentered ? 1.02 : 1)
  return {
    transform: `perspective(900px) translateX(${tx}) translateY(${novaTilt.hovered ? -6 : 0}px) rotateX(${novaTilt.rx}deg) rotateY(${novaTilt.ry}deg) scale(${sc})`
  }
})

function onCardMove(e, which) {
  const el = e.currentTarget
  if (!el) return
  const rect = el.getBoundingClientRect()
  const nx = (e.clientX - rect.left) / rect.width - 0.5
  const ny = (e.clientY - rect.top) / rect.height - 0.5
  const state = which === 'wizard' ? wizTilt : novaTilt
  state.hovered = true
  state.rx = -ny * 8
  state.ry = nx * 10
  state.yaw = nx * 0.95
  state.pitch = ny * 0.65
}

function onCardLeave(which) {
  const state = which === 'wizard' ? wizTilt : novaTilt
  state.hovered = false
  state.rx = 0
  state.ry = 0
  state.yaw = 0
  state.pitch = 0
}

function applyDomFilter(mode) {
  if (typeof document === 'undefined') return
  const homeEl = document.querySelector('.VPHome')
  if (homeEl) {
    homeEl.setAttribute('data-mentor-filter', mode)
  }
}

function broadcastMentor(mentorKey) {
  if (typeof window === 'undefined') return
  if (mentorKey === 'wizard' || mentorKey === 'nova') {
    localStorage.setItem('qualiadept_active_mentor', mentorKey)
    window.dispatchEvent(new CustomEvent('qualiadept-mentor-selected', { detail: { mentor: mentorKey } }))
  }
}

function selectMentor(mentorKey) {
  // If Follow Mouse is active and the user clicks on the card of the migrated mentor, recall them back into the 3D Card plane!
  if (stageBridge.roamMode === 'follow' && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('qualiadept-return-to-stage', { detail: { mentor: mentorKey } }))
  }
  selectedPath.value = mentorKey
  currentTipIndex.value = 0
  applyDomFilter(mentorKey)
  broadcastMentor(mentorKey)
}

function toggleFilter(mentorKey) {
  const next = selectedPath.value === mentorKey ? 'all' : mentorKey
  selectedPath.value = next
  currentTipIndex.value = 0
  applyDomFilter(next)
  if (next !== 'all') {
    broadcastMentor(next)
    if (typeof document !== 'undefined') {
      const featuresEl = document.querySelector('.VPFeatures')
      if (featuresEl) {
        featuresEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }
}

function setFilter(mode) {
  selectedPath.value = mode
  currentTipIndex.value = 0
  applyDomFilter(mode)
  if (mode !== 'all') {
    broadcastMentor(mode)
  }
}

onMounted(() => {
  applyDomFilter('all')
  if (typeof window === 'undefined') return

  stageBridge.isCardsMounted = true

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const size = 128
  const wizC = wizCanvasRef.value
  const novaC = novaCanvasRef.value
  if (!wizC || !novaC) return

  wizC.width = size * dpr
  wizC.height = size * dpr
  novaC.width = size * dpr
  novaC.height = size * dpr

  const wizCtx = wizC.getContext('2d')
  const novaCtx = novaC.getContext('2d')
  if (!wizCtx || !novaCtx) return

  let start = performance.now()
  const renderLoop = (now) => {
    const t = (now - start) / 1000

    // Measure card pod positions in viewport and sync to stageBridge
    const wizRect = wizC.getBoundingClientRect()
    const novaRect = novaC.getBoundingClientRect()
    const vh = window.innerHeight || 800

    stageBridge.isCardsMounted = true
    const wizPodVisible = wizRect.width > 0 && wizRect.bottom > 165 && wizRect.top < vh * 0.62
    const novaPodVisible = novaRect.width > 0 && novaRect.bottom > 165 && novaRect.top < vh * 0.62
    stageBridge.isCardsVisible = wizPodVisible || novaPodVisible

    if (wizRect.width > 0) {
      stageBridge.wizardCardScreen.x = wizRect.left + wizRect.width * 0.5
      stageBridge.wizardCardScreen.y = wizRect.top + wizRect.height * 0.55
    }
    if (novaRect.width > 0) {
      stageBridge.novaCardScreen.x = novaRect.left + novaRect.width * 0.5
      stageBridge.novaCardScreen.y = novaRect.top + novaRect.height * 0.55
    }

    const wizInPod = !stageBridge.wizInScreenPlane && !stageBridge.wizReturning
    const novaInPod = !stageBridge.novaInScreenPlane && !stageBridge.novaReturning

    if (wizInCardUI.value !== wizInPod) wizInCardUI.value = wizInPod
    if (novaInCardUI.value !== novaInPod) novaInCardUI.value = novaInPod
    const followNow = stageBridge.roamMode === 'follow'
    if (isFollowModeUI.value !== followNow) isFollowModeUI.value = followNow

    wizCtx.save()
    wizCtx.scale(dpr, dpr)
    wizCtx.clearRect(0, 0, size, size)
    if (wizInPod) {
      renderWizard3D(wizCtx, {
        cx: 64,
        cy: 72,
        scale: 0.78,
        pitch: wizTilt.pitch,
        yaw: wizTilt.hovered ? wizTilt.yaw : Math.sin(t * 1.6) * 0.35,
        t,
        isCasting: wizTilt.hovered || selectedPath.value === 'wizard',
        isHovered: wizTilt.hovered
      })
    } else {
      renderStagePortalPad(wizCtx, 64, 92, '#38bdf8', t, '')
    }
    wizCtx.restore()

    novaCtx.save()
    novaCtx.scale(dpr, dpr)
    novaCtx.clearRect(0, 0, size, size)
    if (novaInPod) {
      renderNova3D(novaCtx, {
        cx: 64,
        cy: 72,
        scale: 0.78,
        pitch: novaTilt.pitch,
        yaw: novaTilt.hovered ? novaTilt.yaw : Math.cos(t * 1.6) * 0.35,
        t,
        isCasting: novaTilt.hovered || selectedPath.value === 'nova',
        isHovered: novaTilt.hovered
      })
    } else {
      renderStagePortalPad(novaCtx, 64, 92, '#c084fc', t, '')
    }
    novaCtx.restore()

    rafId = requestAnimationFrame(renderLoop)
  }

  rafId = requestAnimationFrame(renderLoop)
})

onUnmounted(() => {
  stageBridge.isCardsMounted = false
  stageBridge.isCardsVisible = false
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.qa-path-showcase {
  padding: 20px 24px 36px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

.qa-showcase-container {
  max-width: 1152px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Metrics Ribbon */
.qa-stats-ribbon {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 22px 28px;
  margin-bottom: 48px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(17, 19, 36, 0.94), rgba(26, 22, 52, 0.96));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 20px 44px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.qa-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  min-width: 0;
}

.qa-stat-val {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  line-height: 1.05;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.qa-stat-lbl {
  font-size: 0.8rem;
  font-weight: 600;
  color: #cbd5e1;
}

.qa-stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(129, 140, 248, 0.22);
}

/* Section Header */
.qa-showcase-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 36px;
  padding: 0 8px;
}

.qa-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(79, 70, 229, 0.14);
  border: 1px solid rgba(79, 70, 229, 0.35);
  color: var(--vp-c-brand-1);
  margin-bottom: 14px;
}

.qa-showcase-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}

.qa-showcase-subtitle {
  margin: 0;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Character Cards Grid */
.qa-characters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 36px;
}

.qa-char-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 26px;
  border-radius: 26px;
  background: linear-gradient(155deg, rgba(16, 18, 34, 0.95) 0%, rgba(24, 21, 48, 0.97) 100%);
  border: 1px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 22px 44px -12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  color: #f8fafc;
  box-sizing: border-box;
}

.qa-char-card.is-migrated-empty {
  opacity: 0.52;
  border-style: dashed;
}

.qa-char-card.is-centered-mentor {
  z-index: 4;
  box-shadow: 0 30px 64px -12px rgba(56, 189, 248, 0.35), 0 0 0 1.5px rgba(129, 140, 248, 0.55);
}

.char-3d-canvas-pod.pod-empty-portal {
  border-style: dashed;
  animation: portal-pulse 2s infinite ease-in-out;
}

@keyframes portal-pulse {
  0%, 100% { box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.18); }
  50% { box-shadow: inset 0 0 32px rgba(56, 189, 248, 0.42); }
}

.char-card-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.55;
}

.wizard-theme .char-card-glow {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.5), rgba(79, 70, 229, 0.3), transparent 70%);
}

.nova-theme .char-card-glow {
  background: radial-gradient(circle, rgba(192, 132, 252, 0.5), rgba(34, 211, 238, 0.3), transparent 70%);
}

.wizard-theme:hover,
.wizard-theme.is-selected {
  border-color: #38bdf8;
  box-shadow: 0 26px 52px -14px rgba(56, 189, 248, 0.32), 0 0 0 1px rgba(56, 189, 248, 0.45);
}

.nova-theme:hover,
.nova-theme.is-selected {
  border-color: #c084fc;
  box-shadow: 0 26px 52px -14px rgba(192, 132, 252, 0.32), 0 0 0 1px rgba(192, 132, 252, 0.45);
}

.char-top-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}

.char-3d-canvas-pod {
  position: relative;
  width: 112px;
  height: 112px;
  border-radius: 22px;
  background: radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.22), rgba(9, 10, 20, 0.9));
  border: 1.5px solid rgba(56, 189, 248, 0.4);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.15);
}

.nova-theme .char-3d-canvas-pod {
  background: radial-gradient(circle at 50% 35%, rgba(192, 132, 252, 0.22), rgba(9, 10, 20, 0.9));
  border-color: rgba(192, 132, 252, 0.45);
  box-shadow: inset 0 0 20px rgba(192, 132, 252, 0.15);
}

.mentor-3d-mini-canvas {
  width: 112px;
  height: 112px;
  display: block;
}

.live-3d-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: #0284c7;
  color: #fff;
  border: 1px solid #38bdf8;
  white-space: nowrap;
}

.live-3d-tag.nova-tag {
  background: #9333ea;
  border-color: #c084fc;
}

.char-identity {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.char-role-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.wizard-badge {
  background: rgba(56, 189, 248, 0.16);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.nova-badge {
  background: rgba(192, 132, 252, 0.16);
  color: #c084fc;
  border: 1px solid rgba(192, 132, 252, 0.35);
}

.char-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.55rem;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

.char-tagline {
  margin: 0;
  font-size: 0.86rem;
  color: #cbd5e1;
  line-height: 1.45;
}

.char-quote {
  margin: 0 0 18px !important;
  padding: 12px 15px !important;
  border-radius: 14px !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-left: 3px solid #38bdf8 !important;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #e2e8f0 !important;
  font-style: italic;
}

.nova-theme .char-quote {
  border-left-color: #c084fc !important;
}

.char-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skill-chip {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
}

.char-card-actions {
  margin-top: auto;
}

.char-select-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.wizard-btn {
  background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35);
}

.nova-btn {
  background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(147, 51, 234, 0.35);
}

/* =========================================================================
   Interactive 64-Tip Mentor Knowledge Vault Deck
   ========================================================================= */
.qa-tips-vault-deck {
  padding: 24px 26px;
  margin-bottom: 42px;
  border-radius: 26px;
  background: linear-gradient(145deg, rgba(15, 17, 32, 0.95), rgba(22, 19, 46, 0.97));
  border: 1px solid rgba(56, 189, 248, 0.32);
  box-shadow: 0 22px 48px -14px rgba(0, 0, 0, 0.35);
  color: #f8fafc;
  box-sizing: border-box;
}

.vault-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}

.vault-badge-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 4px 11px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
  margin-bottom: 4px;
}

.vault-heading {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.15rem, 2.2vw, 1.45rem);
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

.vault-nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vault-counter {
  font-size: 0.82rem;
  font-weight: 800;
  color: #38bdf8;
  min-width: 58px;
  text-align: center;
}

.vault-ctrl-btn {
  padding: 7px 12px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vault-ctrl-btn:hover {
  background: rgba(56, 189, 248, 0.22);
  border-color: #38bdf8;
}

.vault-ctrl-btn.random-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: rgba(192, 132, 252, 0.45);
}

.vault-categories-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.vault-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vault-cat-chip:hover {
  border-color: #38bdf8;
  color: #ffffff;
}

.vault-cat-chip.active {
  background: linear-gradient(135deg, #0284c7, #4f46e5);
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
}

.vault-active-tip-card {
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-left: 4px solid #38bdf8;
}

.vault-active-tip-card.nova {
  border-color: rgba(192, 132, 252, 0.35);
  border-left-color: #c084fc;
}

.tip-mentor-badge-col {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.tip-mentor-avatar {
  font-size: 1.45rem;
}

.tip-mentor-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.84rem;
}

.tip-mentor-meta strong {
  color: #38bdf8;
}

.vault-active-tip-card.nova .tip-mentor-meta strong {
  color: #c084fc;
}

.tip-id-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.vault-tip-structured {
  text-align: left;
  margin-bottom: 14px;
}

.vault-tip-title {
  margin: 0 0 4px !important;
  font-size: 0.94rem !important;
  font-weight: 800 !important;
  color: #7dd3fc !important;
  line-height: 1.35 !important;
}

.vault-active-tip-card.nova .vault-tip-title {
  color: #d8b4fe !important;
}

.tip-body-text {
  margin: 0 !important;
  font-size: 0.95rem;
  line-height: 1.62;
  color: #f1f5f9;
  text-align: left !important;
}

.tip-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.copy-tip-btn,
.open-source-lesson-btn,
.next-inline-btn {
  padding: 6px 13px;
  border-radius: 10px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.open-source-lesson-btn {
  background: rgba(99, 102, 241, 0.22);
  border-color: rgba(129, 140, 248, 0.45);
  color: #a5b4fc !important;
}

.next-inline-btn {
  background: rgba(56, 189, 248, 0.16);
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}

.copy-tip-btn:hover,
.open-source-lesson-btn:hover,
.next-inline-btn:hover {
  background: #0284c7;
  color: #fff !important;
}

/* Filter Bar above Bento Courses */
.qa-courses-filter-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(129, 140, 248, 0.18);
}

.courses-eyebrow {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--vp-c-brand-1);
  margin-bottom: 4px;
}

.courses-section-label {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.3rem, 2.5vw, 1.65rem);
  font-weight: 800;
  margin: 0;
  color: var(--vp-c-text-1);
}

.filter-pills-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.track-pill {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(15, 17, 30, 0.85);
  border: 1px solid rgba(129, 140, 248, 0.28);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.22s ease;
}

.track-pill:hover {
  border-color: #38bdf8;
  color: #fff;
}

.track-pill.active {
  background: linear-gradient(135deg, #4f46e5, #0284c7);
  border-color: #38bdf8;
  color: #fff;
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.3);
}

.track-pill.nova-pill.active {
  background: linear-gradient(135deg, #9333ea, #4f46e5);
  border-color: #c084fc;
}

@media (max-width: 960px) {
  .qa-characters-grid {
    grid-template-columns: 1fr;
  }
  .qa-stats-ribbon {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    padding: 18px 20px;
  }
  .qa-stat-divider {
    display: none;
  }
}

@media (max-width: 560px) {
  .qa-path-showcase {
    padding: 16px 14px 28px;
  }
  .qa-char-card {
    padding: 18px;
  }
  .char-top-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .qa-tips-vault-deck {
    padding: 16px;
  }
  .qa-stats-ribbon {
    grid-template-columns: 1fr 1fr;
    padding: 14px;
  }
}
</style>
