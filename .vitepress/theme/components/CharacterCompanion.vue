<template>
  <div class="qa-companion-root">
    <!-- Top Reading Progress Bar (Shown on Doc / Session / Article Pages) -->
    <div v-if="!isHomePage" class="qa-reading-progress-track" aria-hidden="true">
      <div
        class="qa-reading-progress-fill"
        :class="activeMentor === 'nova' ? 'nova-gradient' : 'wizard-gradient'"
        :style="{ width: `${scrollPercent}%` }"
      ></div>
    </div>

    <!-- Full-Viewport Transparent 3D Roaming Characters & Bug-Hunt Canvas -->
    <canvas
      v-show="roamMode !== 'docked'"
      ref="screenCanvasRef"
      class="roaming-3d-screen-canvas"
      aria-hidden="true"
    ></canvas>

    <!-- Floating Holographic Speech / Dual-Mentor Dialogue Bubble -->
    <transition name="companion-pop">
      <div
        v-if="(activeBanter || floatingSpeech) && roamMode !== 'docked' && !isOpen"
        ref="calloutRef"
        class="roaming-speech-callout"
        :class="[
          activeBanter
            ? 'dual-banter-callout'
            : floatingSpeaker === 'nova'
              ? 'nova-callout'
              : 'wizard-callout',
          calloutSizeClass,
          { 'is-compact-callout': isCalloutEffectiveCompact }
        ]"
        :style="speechBubbleStyle"
        @mouseenter="isCalloutHovered = true"
        @mouseleave="isCalloutHovered = false"
      >
        <!-- Mode A: Interactive Back-and-Forth Dialogue Between Mr. QA Wizard & Nova -->
        <template v-if="activeBanter">
          <div class="callout-top-row">
            <span class="callout-speaker banter-speaker-badge">
              🤝 {{ isEn ? '3D MENTOR DIALOGUE' : 'DIALOG 3D: MR. QA & NOVA' }}
              <em class="callout-tip-num">{{ activeBanterBadge }}</em>
            </span>
            <div class="callout-top-actions">
              <button
                type="button"
                class="callout-resize-btn"
                @click="toggleCalloutCompact"
                :title="
                  isCalloutEffectiveCompact
                    ? isEn
                      ? 'Expand window'
                      : 'Mărește fereastra'
                    : isEn
                      ? 'Shrink window'
                      : 'Micșorează fereastra'
                "
              >
                {{ isCalloutEffectiveCompact ? '⤢' : '⤡' }}
              </button>
              <button
                type="button"
                class="callout-next-btn banter-next-btn"
                @click="triggerMentorBanter(true)"
              >
                💬 {{ isEn ? 'Next Banter' : 'Altă Replică' }}
              </button>
              <button
                type="button"
                class="callout-close-btn"
                @click="closeFloatingSpeech"
                :title="isEn ? 'Close dialogue (ESC)' : 'Închide dialogul (ESC)'"
                aria-label="Close dialogue"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="callout-source-row banter-topic-row">
            <span class="callout-source-label">
              {{ isEn ? activeBanter.topicEn : activeBanter.topicRo }}
            </span>
          </div>

          <div v-show="!isCalloutEffectiveCompact" class="banter-exchange-stack">
            <!-- First Line -->
            <div
              class="banter-line-item"
              :class="activeBanter.first === 'nova' ? 'nova-line' : 'wizard-line'"
            >
              <span class="banter-line-author">
                {{ activeBanter.first === 'nova' ? '🤖 Nova AI:' : '🧙‍♂️ Mr. QA Wizard:' }}
              </span>
              <p class="callout-text">
                {{
                  activeBanter.first === 'nova'
                    ? isEn
                      ? activeBanter.novaEn
                      : activeBanter.novaRo
                    : isEn
                      ? activeBanter.wizardEn
                      : activeBanter.wizardRo
                }}
              </p>
            </div>

            <!-- Second Line (Reply) -->
            <div
              class="banter-line-item reply-line"
              :class="activeBanter.first === 'nova' ? 'wizard-line' : 'nova-line'"
            >
              <span class="banter-line-author">
                {{ activeBanter.first === 'nova' ? '🧙‍♂️ Mr. QA Wizard:' : '🤖 Nova AI:' }}
              </span>
              <p class="callout-text">
                {{
                  activeBanter.first === 'nova'
                    ? isEn
                      ? activeBanter.wizardEn
                      : activeBanter.wizardRo
                    : isEn
                      ? activeBanter.novaEn
                      : activeBanter.novaRo
                }}
              </p>
            </div>
          </div>
        </template>

        <!-- Mode B: Single Mentor Contextual Tip Callout -->
        <template v-else>
          <div class="callout-top-row">
            <span class="callout-speaker">
              {{ floatingSpeaker === 'nova' ? '🤖 Nova AI' : '🧙‍♂️ Mr. QA Wizard' }}
              <em v-if="floatingTipBadge" class="callout-tip-num">{{ floatingTipBadge }}</em>
            </span>
            <div class="callout-top-actions">
              <button
                type="button"
                class="callout-resize-btn"
                @click="toggleCalloutCompact"
                :title="
                  isCalloutEffectiveCompact
                    ? isEn
                      ? 'Expand window'
                      : 'Mărește fereastra'
                    : isEn
                      ? 'Shrink window'
                      : 'Micșorează fereastra'
                "
              >
                {{ isCalloutEffectiveCompact ? '⤢' : '⤡' }}
              </button>
              <button
                type="button"
                class="callout-next-btn"
                @click="popRandomScreenTip"
              >
                ✨ {{ isEn ? 'Next Tip' : 'Alt Sfat' }}
              </button>
              <button
                type="button"
                class="callout-close-btn"
                @click="closeFloatingSpeech"
                :title="isEn ? 'Close tip (ESC)' : 'Închide sfatul (ESC)'"
                aria-label="Close tip"
              >
                ✕
              </button>
            </div>
          </div>
          <div
            v-if="isCalloutEffectiveCompact"
            class="callout-compact-preview"
            @click="calloutManualCompact = false"
          >
            💡 {{ floatingTipTitle || floatingSpeech }}
          </div>
          <template v-else>
            <div v-if="floatingSourceTitle" class="callout-source-row">
              <span class="callout-source-label">📘 {{ floatingSourceTitle }}</span>
              <a
                v-if="floatingSourceUrl && isHomePage"
                :href="floatingSourceUrl"
                class="callout-source-link"
              >
                {{ isEn ? 'Open →' : 'Vezi →' }}
              </a>
            </div>
            <div class="callout-body-block">
              <strong v-if="floatingTipTitle" class="callout-tip-title">💡 {{ floatingTipTitle }}</strong>
              <p class="callout-text">{{ floatingSpeech }}</p>
            </div>
          </template>
        </template>
      </div>
    </transition>

    <!-- Expandable Companion HUD Card -->
    <transition name="companion-panel">
      <div
        v-if="isOpen"
        class="companion-hud-card"
        :class="activeMentor === 'nova' ? 'hud-nova' : 'hud-wizard'"
      >
        <div class="hud-header">
          <div class="hud-mentor-tabs">
            <button
              type="button"
              class="hud-mentor-tab"
              :class="{ active: activeMentor === 'wizard' }"
              @click="switchMentor('wizard')"
            >
              <span>🧙‍♂️ Mr. QA Wizard</span>
            </button>
            <button
              type="button"
              class="hud-mentor-tab"
              :class="{ active: activeMentor === 'nova' }"
              @click="switchMentor('nova')"
            >
              <span>🤖 Nova AI</span>
            </button>
          </div>
          <button
            type="button"
            class="hud-close-btn"
            @click="isOpen = false"
            aria-label="Close companion"
          >
            &times;
          </button>
        </div>

        <!-- 3D Roaming Mode Switcher -->
        <div class="hud-mode-section">
          <span class="mode-section-title">
            🎮 {{ isEn ? '3D Screen Movement Mode' : 'Mod Mișcare 3D pe Ecran' }}
          </span>
          <div class="mode-pills-grid">
            <button
              type="button"
              class="mode-btn"
              :class="{ active: roamMode === 'roam' }"
              @click="setRoamMode('roam')"
            >
              🛸 {{ isEn ? 'Roam Screen' : 'Zbor pe Ecran' }}
            </button>
            <button
              type="button"
              class="mode-btn"
              :class="{ active: roamMode === 'follow' }"
              @click="setRoamMode('follow')"
            >
              🧲 {{ isEn ? 'Follow Cursor' : 'Urmărește Mouse' }}
            </button>
            <button
              type="button"
              class="mode-btn"
              :class="{ active: roamMode === 'docked' }"
              @click="setRoamMode('docked')"
            >
              📌 {{ isEn ? 'Docked Only' : 'Doar în Colț' }}
            </button>
          </div>
        </div>

        <!-- Dynamic Context-Aware Tips Carousel -->
        <div class="hud-tip-box">
          <div class="tip-box-top">
            <span class="tip-badge">
              💡 {{
                isEn
                  ? `Tip #${(tipIndex % filteredHudTips.length) + 1} of ${filteredHudTips.length}`
                  : `Sfatul #${(tipIndex % filteredHudTips.length) + 1} din ${filteredHudTips.length}`
              }}
            </span>
            <div class="tip-nav-group">
              <button type="button" class="mini-nav-btn" @click="prevTip" title="Previous">◀</button>
              <button type="button" class="mini-nav-btn" @click="cycleTip" title="Next">▶</button>
              <button type="button" class="next-tip-btn" @click="randomTip">
                🎲 {{ isEn ? 'Random' : 'Aleatoriu' }}
              </button>
            </div>
          </div>

          <!-- Context Scope Pills (Shown on Course / Lesson / Article pages) -->
          <div v-if="!isHomePage" class="hud-cat-scroll">
            <button
              v-if="contextData.counts.page > 0"
              type="button"
              class="hud-cat-pill"
              :class="{ active: contextData.activeScope === 'page' }"
              @click="selectHudScope('page')"
            >
              📍 {{ isEn ? `This Material (${contextData.counts.page})` : `Această Lecție (${contextData.counts.page})` }}
            </button>
            <button
              v-if="contextData.counts.course > 0"
              type="button"
              class="hud-cat-pill"
              :class="{ active: contextData.activeScope === 'course' }"
              @click="selectHudScope('course')"
            >
              📚 {{ isEn ? `This Course (${contextData.counts.course})` : `Acest Curs (${contextData.counts.course})` }}
            </button>
            <button
              type="button"
              class="hud-cat-pill"
              :class="{ active: contextData.activeScope === 'all' }"
              @click="selectHudScope('all')"
            >
              🌐 {{ isEn ? `All LMS (${contextData.counts.all})` : `Toate (${contextData.counts.all})` }}
            </button>
          </div>

          <!-- Category Filter Chips (Shown on Homepage or when browsing All LMS) -->
          <div v-if="isHomePage || contextData.activeScope === 'all'" class="hud-cat-scroll">
            <button
              v-for="cat in tipCategories"
              :key="cat.id"
              type="button"
              class="hud-cat-pill"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectHudCategory(cat.id)"
            >
              {{ cat.icon }} {{ isEn ? cat.labelEn : cat.labelRo }}
            </button>
          </div>

          <!-- Source Lesson / Article Badge -->
          <div v-if="currentTipObj.sourceTitle" class="hud-source-meta">
            <span class="hud-source-name">📘 {{ currentTipObj.sourceTitle }}</span>
            <a
              v-if="currentTipObj.url && !isHomePageRoute(currentTipObj.url) && currentTipObj.url !== normalizedCurrentRoute"
              :href="currentTipObj.url"
              class="hud-source-link"
              @click="isOpen = false"
            >
              {{ isEn ? 'Open material →' : 'Vezi lecția →' }}
            </a>
          </div>

          <div class="hud-tip-body-wrap">
            <strong v-if="currentTipObj.tipTitle" class="hud-tip-title">
              💡 {{ currentTipObj.tipTitle }}
            </strong>
            <p class="tip-content">{{ currentTipText }}</p>
          </div>
        </div>

        <!-- Coding Challenge Progress Mini-Widget -->
        <div class="hud-progress-section">
          <div class="hud-progress-row">
            <span class="hud-progress-label">
              🐍 {{ isEn ? 'Python Automation Challenges' : 'Provocări Practică Python' }}
            </span>
            <strong class="hud-progress-count">{{ stats.completed }}/{{ stats.total }} ({{ stats.percentage }}%)</strong>
          </div>
          <div class="hud-progress-bar">
            <div
              class="hud-progress-fill"
              :style="{ width: `${stats.percentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="hud-footer-links">
          <button
            type="button"
            class="hud-action-link bug-hunt-btn"
            @click="unleashScreenBugHunt"
          >
            🐞 {{ isEn ? 'Unleash 3D Bug Hunt!' : 'Lansează Bug Hunt 3D!' }}
          </button>
          <a
            :href="isEn ? '/en/sessions/python-for-testing/session-1' : '/ro/sessions/python-for-testing/session-1'"
            class="hud-action-link primary"
            @click="isOpen = false"
          >
            🐍 {{ isEn ? 'Open Python IDE' : 'Python IDE' }}
          </a>
        </div>
      </div>
    </transition>

    <!-- Bottom-Right Interactive 3D Dock Bar -->
    <div class="companion-dock-bar">
      <button
        type="button"
        class="dock-quick-btn tip-trigger"
        @click="popRandomScreenTip"
        :title="
          isHomePage
            ? isEn
              ? `Get a tip from all ${contextData.counts.all} LMS course & article tips!`
              : `Primește un sfat din toate cele ${contextData.counts.all} sfaturi din cursuri și articole!`
            : isEn
              ? `Get a tip specifically from this material (${filteredHudTips.length} tips)!`
              : `Primește un sfat extras direct din această lecție/articol (${filteredHudTips.length} sfaturi)!`
        "
      >
        <span v-if="isHomePage">
          💡 {{ isEn ? `Give Me a Tip! (${contextData.counts.all})` : `Dă-mi un Sfat! (${contextData.counts.all})` }}
        </span>
        <span v-else>
          💡 {{ isEn ? `Lesson Tip (${filteredHudTips.length})` : `Sfat din Lecție (${filteredHudTips.length})` }}
        </span>
      </button>

      <button
        type="button"
        class="dock-quick-btn bug-trigger"
        @click="unleashScreenBugHunt"
        :title="isEn ? 'Spawn flying 3D bugs on screen for Mr. QA Wizard & Nova to zap!' : 'Generează bug-uri 3D pe ecran și privește cum Mr. QA Wizard & Nova le vânează!'"
      >
        <span>🐞 {{ isEn ? 'Zap 3D Bugs!' : 'Vânează Bug-uri 3D!' }}</span>
      </button>

      <button
        type="button"
        class="dock-quick-btn mode-toggle"
        :class="{ 'is-following': roamMode === 'follow' }"
        @click="cycleRoamModeQuick"
        :title="isEn ? 'Toggle Follow Cursor / Return to 3D Stage' : 'Activează / Dezactivează Urmărirea Mouse-ului (Trecere în Scena 3D)'"
      >
        <span v-if="roamMode === 'follow'">
          ✨ {{ isEn ? 'Stop Follow (To 3D)' : 'Oprește Urmărirea (În 3D)' }}
        </span>
        <span v-else-if="roamMode === 'roam'">
          🧲 {{ isEn ? 'Follow Mouse' : 'Urmărește Mouse' }}
        </span>
        <span v-else>
          📌 {{ isEn ? '3D Paused' : '3D Pauză' }}
        </span>
      </button>

      <button
        type="button"
        class="companion-orb-btn"
        :class="[activeMentor === 'nova' ? 'orb-nova' : 'orb-wizard', { 'is-open': isOpen }]"
        @click="toggleOpen"
        aria-label="Toggle Mentor Companion"
      >
        <svg class="orb-progress-ring" viewBox="0 0 64 64">
          <circle class="ring-bg" cx="32" cy="32" r="29" />
          <circle
            class="ring-fill"
            cx="32"
            cy="32"
            r="29"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <span class="orb-3d-icon">{{ activeMentor === 'nova' ? '🤖' : '🧙‍♂️' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { getStoredProgressStats } from '../challengeProgress.mjs'
import {
  renderWizard3D,
  renderNova3D,
  renderBug3D,
  stageBridge,
  renderPlaneTransitionRings,
  renderMentorSynergyLink
} from './Scene3DEngine.mjs'
import { TIP_CATEGORIES, MENTOR_TIPS_VAULT, MENTOR_BANTER_DIALOGUES } from '../mentorTipsVault.mjs'
import { data as lmsExtractedTips } from '../lmsContentTips.data.mjs'
import {
  getContextualTipsForRoute,
  extractTipsFromLiveDOM,
  isHomePageRoute,
  normalizeRouteUrl
} from '../lmsTipsExtractor.mjs'

const route = useRoute()
const screenCanvasRef = ref(null)
const isOpen = ref(false)
const activeMentor = ref('wizard')
const roamMode = ref('roam') // 'roam' | 'follow' | 'docked'
const selectedCategory = ref('all')
const requestedScope = ref('auto') // 'auto' | 'page' | 'course' | 'all'
const liveDomTips = ref([])
const tipIndex = ref(0)
const scrollPercent = ref(0)
const stats = ref({ completed: 0, total: 10, percentage: 0 })
const tipCategories = TIP_CATEGORIES

// Roaming 3D Speech Callout & Dual-Mentor Banter State
const calloutRef = ref(null)
const isCalloutHovered = ref(false)
const calloutManualCompact = ref(null) // null = auto context, true = compact, false = expanded
const isPointerMovingFast = ref(false)
const floatingSpeech = ref('')
const floatingTipTitle = ref('')
const floatingSpeaker = ref('wizard')
const floatingTipBadge = ref('')
const floatingSourceTitle = ref('')
const floatingSourceUrl = ref('')
const activeBanter = ref(null)
const activeBanterBadge = ref('')
const speechX = ref(200)
const speechY = ref(200)
const wizScreenX = ref(90)
const wizScreenY = ref(360)
const novaScreenX = ref(1100)
const novaScreenY = ref(420)
let speechTimeout = null
let pointerCalmTimer = null
let rafId = null
let screenTipCursor = 0
let banterCursor = 0
let wasMentorsInteracting = false
let lastBanterTime = 0

const isEn = computed(() => route.path.startsWith('/en/'))
const normalizedCurrentRoute = computed(() => normalizeRouteUrl(route.path))
const isHomePage = computed(() => isHomePageRoute(route.path))

const isCalloutEffectiveCompact = computed(() => {
  if (!floatingSpeech.value && !activeBanter.value) return false
  return Boolean(calloutManualCompact.value)
})

const calloutSizeClass = computed(() => {
  if (activeBanter.value) return 'callout-size-banter'
  const len = (floatingSpeech.value?.length || 0) + (floatingTipTitle.value?.length || 0)
  if (len < 90) return 'callout-size-short'
  if (len <= 180) return 'callout-size-medium'
  return 'callout-size-long'
})

function toggleCalloutCompact() {
  calloutManualCompact.value = !isCalloutEffectiveCompact.value
}

const contextData = computed(() => {
  return getContextualTipsForRoute({
    routePath: route.path,
    lang: isEn.value ? 'en' : 'ro',
    extractedTips: Array.isArray(lmsExtractedTips) ? lmsExtractedTips : [],
    liveDomTips: liveDomTips.value,
    baseVaultTips: MENTOR_TIPS_VAULT,
    requestedScope: requestedScope.value,
    categoryFilter: selectedCategory.value
  })
})

const filteredHudTips = computed(() => {
  const list = contextData.value.tips
  return list.length > 0 ? list : MENTOR_TIPS_VAULT
})

const currentTipObj = computed(() => {
  const list = filteredHudTips.value
  return list[tipIndex.value % list.length] || MENTOR_TIPS_VAULT[0]
})

const currentTipText = computed(() => {
  const tip = currentTipObj.value
  if (tip.tipBody) return tip.tipBody
  if (tip.text) return tip.text
  return isEn.value ? tip.en : tip.ro
})

const circumference = 2 * Math.PI * 29
const dashOffset = computed(() => {
  const pct = Math.min(Math.max(stats.value.percentage, 10), 100)
  return circumference - (pct / 100) * circumference
})

const speechBubbleStyle = computed(() => {
  if (typeof window === 'undefined') {
    return { left: '200px', top: '200px' }
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const isBanter = Boolean(activeBanter.value)
  const isCompact = isCalloutEffectiveCompact.value
  const sizeTier = calloutSizeClass.value

  let targetW = 300
  if (isCompact) {
    targetW = 245
  } else if (isBanter) {
    targetW = 348
  } else if (sizeTier === 'callout-size-short') {
    targetW = 252
  } else if (sizeTier === 'callout-size-medium') {
    targetW = 296
  } else {
    targetW = 328
  }

  const bubbleW = Math.min(targetW, vw - 28)
  const estH = isCompact ? 68 : isBanter ? 245 : sizeTier === 'callout-size-short' ? 128 : 178
  const actorX = speechX.value
  const actorY = speechY.value
  const padX = isBanter ? 126 : 74
  const padY = 82

  const clampX = (x) => Math.max(14, Math.min(vw - bubbleW - 14, x))
  const clampY = (y) => Math.max(72, Math.min(vh - estH - 82, y))

  // Build candidate placements around the speaking character(s)
  const preferLeft = actorX > vw * 0.5
  const horizontalCandidates = preferLeft
    ? [
        { left: clampX(actorX - padX - bubbleW), top: clampY(actorY - estH * 0.45) },
        { left: clampX(actorX + padX), top: clampY(actorY - estH * 0.45) }
      ]
    : [
        { left: clampX(actorX + padX), top: clampY(actorY - estH * 0.45) },
        { left: clampX(actorX - padX - bubbleW), top: clampY(actorY - estH * 0.45) }
      ]

  const verticalCandidates =
    actorY > vh * 0.5
      ? [
          { left: clampX(actorX - bubbleW * 0.5), top: clampY(actorY - padY - estH) },
          { left: clampX(actorX - bubbleW * 0.5), top: clampY(actorY + padY) }
        ]
      : [
          { left: clampX(actorX - bubbleW * 0.5), top: clampY(actorY + padY) },
          { left: clampX(actorX - bubbleW * 0.5), top: clampY(actorY - padY - estH) }
        ]

  const candidates = [...horizontalCandidates, ...verticalCandidates]

  // Bounding boxes of both 3D characters so the speech window NEVER covers either character!
  const charBoxes = [
    { l: wizScreenX.value - 62, r: wizScreenX.value + 62, t: wizScreenY.value - 74, b: wizScreenY.value + 72 },
    { l: novaScreenX.value - 62, r: novaScreenX.value + 62, t: novaScreenY.value - 74, b: novaScreenY.value + 72 }
  ]

  function overlapArea(cand) {
    const r = cand.left + bubbleW
    const b = cand.top + estH
    let total = 0
    for (const cb of charBoxes) {
      const ox = Math.max(0, Math.min(r, cb.r) - Math.max(cand.left, cb.l))
      const oy = Math.max(0, Math.min(b, cb.b) - Math.max(cand.top, cb.t))
      total += ox * oy
    }
    return total
  }

  let best = candidates[0]
  let bestScore = Infinity
  for (const cand of candidates) {
    const area = overlapArea(cand)
    if (area < bestScore) {
      bestScore = area
      best = cand
      if (area === 0) break
    }
  }

  return {
    left: `${Math.round(best.left)}px`,
    top: `${Math.round(best.top)}px`,
    width: `${Math.round(bubbleW)}px`
  }
})

// Full-Screen 3D Entities State
const pointer = { x: 600, y: 400 }
const wizActor = {
  x: 90,
  y: 360,
  targetX: 90,
  targetY: 360,
  vx: 0,
  vy: 0,
  casting: 0,
  spin: 0,
  emerging: 0,
  returning: false,
  returnStartDist: 240
}
const novaActor = {
  x: 1100,
  y: 420,
  targetX: 1100,
  targetY: 420,
  vx: 0,
  vy: 0,
  casting: 0,
  spin: 0,
  emerging: 0,
  returning: false,
  returnStartDist: 240
}
let screenBugs = []
let screenLasers = []
let screenParticles = []
let bugCounter = 100
let prevPlane = null

function getPlaneAnchor(mentorKey, plane) {
  if (plane === 'stage') {
    return mentorKey === 'wizard' ? stageBridge.wizardStageScreen : stageBridge.novaStageScreen
  }
  if (plane === 'cards') {
    return mentorKey === 'wizard' ? stageBridge.wizardCardScreen : stageBridge.novaCardScreen
  }
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  return {
    x: mentorKey === 'wizard' ? 68 : vw - 68,
    y: vh * 0.45
  }
}

function spawnPortalBurst(x, y, color = '#38bdf8') {
  for (let i = 0; i < 16; i++) {
    const ang = (Math.PI * 2 * i) / 16
    const spd = 1.8 + Math.random() * 3.8
    screenParticles.push({
      x,
      y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      r: 2.2 + Math.random() * 2.8,
      color: i % 2 === 0 ? color : '#a5b4fc',
      alpha: 1
    })
  }
}

function launchMentorFromPlane(mentorKey, sourcePlane) {
  const actor = mentorKey === 'wizard' ? wizActor : novaActor
  const anchor = getPlaneAnchor(mentorKey, sourcePlane || stageBridge.activePlane)
  actor.x = anchor.x
  actor.y = anchor.y
  actor.vx = mentorKey === 'wizard' ? -4.5 : 4.5
  actor.vy = -5.5
  actor.spin = Math.PI * 2
  actor.emerging = 1.0
  actor.returning = false

  if (mentorKey === 'wizard') {
    stageBridge.wizInScreenPlane = true
    stageBridge.wizReturning = false
  } else {
    stageBridge.novaInScreenPlane = true
    stageBridge.novaReturning = false
  }

  spawnPortalBurst(anchor.x, anchor.y, mentorKey === 'wizard' ? '#38bdf8' : '#c084fc')
}

function returnMentorToPlane(mentorKey, targetPlane) {
  const plane = targetPlane || stageBridge.activePlane
  if (plane === 'none') return

  const actor = mentorKey === 'wizard' ? wizActor : novaActor
  const anchor = getPlaneAnchor(mentorKey, plane)
  actor.returning = true
  actor.emerging = 0
  actor.spin = Math.PI * 2
  actor.returnStartDist = Math.max(80, Math.hypot(actor.x - anchor.x, actor.y - anchor.y))

  if (mentorKey === 'wizard') {
    stageBridge.wizInScreenPlane = false
    stageBridge.wizReturning = true
  } else {
    stageBridge.novaInScreenPlane = false
    stageBridge.novaReturning = true
  }

  spawnPortalBurst(actor.x, actor.y, mentorKey === 'wizard' ? '#38bdf8' : '#c084fc')
}

function scanLiveDomTips() {
  if (typeof document === 'undefined') return
  const docEl = document.querySelector('.vp-doc')
  if (docEl && !isHomePage.value) {
    liveDomTips.value = extractTipsFromLiveDOM(docEl, route.path, isEn.value ? 'en' : 'ro')
  } else {
    liveDomTips.value = []
  }
}

function closeFloatingSpeech() {
  floatingSpeech.value = ''
  floatingTipTitle.value = ''
  activeBanter.value = null
  activeBanterBadge.value = ''
  calloutManualCompact.value = null
  if (speechTimeout) {
    clearTimeout(speechTimeout)
    speechTimeout = null
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    if (floatingSpeech.value || activeBanter.value) closeFloatingSpeech()
    if (isOpen.value) isOpen.value = false
  }
}

function showFloatingSpeech(speaker, title, text, x, y, badgeText = '', sourceTitle = '', sourceUrl = '') {
  calloutManualCompact.value = null
  activeBanter.value = null
  activeBanterBadge.value = ''
  floatingSpeaker.value = speaker
  floatingTipTitle.value = title
  floatingSpeech.value = text
  floatingTipBadge.value = badgeText
  floatingSourceTitle.value = sourceTitle
  floatingSourceUrl.value = sourceUrl
  speechX.value = x
  speechY.value = y
  if (speechTimeout) clearTimeout(speechTimeout)
  speechTimeout = setTimeout(() => {
    floatingSpeech.value = ''
    calloutManualCompact.value = null
  }, 8500)
}

function triggerMentorBanter() {
  const pool = MENTOR_BANTER_DIALOGUES
  if (!pool || pool.length === 0) return
  const idx = banterCursor % pool.length
  const chosen = pool[idx]
  banterCursor = (idx + 1) % pool.length

  calloutManualCompact.value = null
  floatingSpeech.value = ''
  floatingTipTitle.value = ''
  activeBanter.value = chosen
  activeBanterBadge.value = `#${idx + 1}/${pool.length}`

  wizActor.spin = Math.PI * 2
  novaActor.spin = Math.PI * 2
  wizActor.casting = 24
  novaActor.casting = 24

  const wizPos = getSpeakingActorPosition('wizard')
  const novaPos = getSpeakingActorPosition('nova')
  speechX.value = (wizPos.x + novaPos.x) / 2
  speechY.value = (wizPos.y + novaPos.y) / 2

  if (speechTimeout) clearTimeout(speechTimeout)
  speechTimeout = setTimeout(() => {
    activeBanter.value = null
    activeBanterBadge.value = ''
    calloutManualCompact.value = null
  }, 11500)
}

function getSpeakingActorPosition(speaker) {
  if (speaker === 'wizard') {
    if (stageBridge.wizInScreenPlane || wizActor.returning) {
      return { x: wizActor.x, y: wizActor.y }
    }
    return getPlaneAnchor('wizard', stageBridge.activePlane)
  }
  if (stageBridge.novaInScreenPlane || novaActor.returning) {
    return { x: novaActor.x, y: novaActor.y }
  }
  return getPlaneAnchor('nova', stageBridge.activePlane)
}

function popRandomScreenTip() {
  if (roamMode.value === 'docked') {
    setRoamMode('roam')
  }

  // If both characters are currently inside the Hero 3D Stage (not on screen), display the tip inside the 3D Stage dock!
  if (
    stageBridge.activePlane === 'stage' &&
    !stageBridge.wizInScreenPlane &&
    !stageBridge.novaInScreenPlane &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(new CustomEvent('qualiadept-stage-show-tip'))
    return
  }

  const fullPool = filteredHudTips.value
  // When in Follow Mouse mode, keep tips focused on the mentor currently following the cursor!
  let pool = fullPool
  if (roamMode.value === 'follow') {
    const byActive = fullPool.filter((t) => t.mentor === activeMentor.value)
    if (byActive.length > 0) pool = byActive
  }

  const idx = screenTipCursor % pool.length
  const tip = pool[idx] || fullPool[0]
  screenTipCursor = (idx + 1 + Math.floor(Math.random() * Math.min(4, Math.max(1, pool.length - 1)))) % pool.length
  const globalIdx = Math.max(0, fullPool.indexOf(tip))
  tipIndex.value = globalIdx

  const tipTitle = tip.tipTitle || ''
  const tipText = tip.tipBody || tip.text || (isEn.value ? tip.en : tip.ro)
  const badgeText = `#${globalIdx + 1}/${fullPool.length}`
  const sourceTitle = tip.sourceTitle || tip.courseLabel || ''
  const sourceUrl = tip.url && !isHomePageRoute(tip.url) ? tip.url : ''

  const speaker = roamMode.value === 'follow' ? activeMentor.value : (tip.mentor || 'wizard')
  activeMentor.value = speaker
  stageBridge.activeMentor = speaker

  const pos = getSpeakingActorPosition(speaker)
  if (speaker === 'wizard') {
    wizActor.spin = Math.PI * 2
    wizActor.casting = 18
    showFloatingSpeech('wizard', tipTitle, tipText, pos.x, pos.y, badgeText, sourceTitle, sourceUrl)
  } else {
    novaActor.spin = Math.PI * 2
    novaActor.casting = 18
    showFloatingSpeech('nova', tipTitle, tipText, pos.x, pos.y, badgeText, sourceTitle, sourceUrl)
  }
}

function selectHudScope(scopeId) {
  requestedScope.value = scopeId
  tipIndex.value = 0
}

function selectHudCategory(catId) {
  selectedCategory.value = catId
  tipIndex.value = 0
}

function switchMentor(mentorKey) {
  const prev = activeMentor.value
  activeMentor.value = mentorKey
  stageBridge.activeMentor = mentorKey
  if (mentorKey === 'wizard') wizActor.spin = Math.PI * 2
  else novaActor.spin = Math.PI * 2

  // If Follow Mouse is active while a 3D plane is visible, swap which mentor is out on the screen!
  if (roamMode.value === 'follow' && stageBridge.activePlane !== 'none' && prev !== mentorKey) {
    returnMentorToPlane(prev, stageBridge.activePlane)
    launchMentorFromPlane(mentorKey, stageBridge.activePlane)
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('qualiadept_active_mentor', mentorKey)
  }
}

function setRoamMode(mode, persist = true) {
  const prevMode = roamMode.value
  roamMode.value = mode
  stageBridge.roamMode = mode

  if (persist && typeof window !== 'undefined') {
    localStorage.setItem('qualiadept_roam_mode', mode)
  }

  if (stageBridge.activePlane !== 'none') {
    if (mode === 'follow') {
      // Selected mentor migrates out of the 3D Stage / Card to follow the mouse; the other stays centered in the 3D plane!
      const chosen = activeMentor.value
      const other = chosen === 'wizard' ? 'nova' : 'wizard'
      const isChosenOut = chosen === 'wizard' ? stageBridge.wizInScreenPlane : stageBridge.novaInScreenPlane
      if (!isChosenOut) {
        launchMentorFromPlane(chosen, stageBridge.activePlane)
      }
      const isOtherOut = other === 'wizard' ? stageBridge.wizInScreenPlane : stageBridge.novaInScreenPlane
      if (isOtherOut) {
        returnMentorToPlane(other, stageBridge.activePlane)
      }
    } else if (mode === 'roam' && prevMode === 'follow') {
      // Deactivating Follow Mouse: fly the character back into the 3D Stage / Card plane!
      if (stageBridge.wizInScreenPlane) returnMentorToPlane('wizard', stageBridge.activePlane)
      if (stageBridge.novaInScreenPlane) returnMentorToPlane('nova', stageBridge.activePlane)
    }
  }
}

function cycleRoamModeQuick() {
  if (roamMode.value === 'follow') {
    setRoamMode('roam')
  } else {
    setRoamMode('follow')
  }
}

function handleReturnToStageEvent() {
  if (roamMode.value === 'follow') {
    setRoamMode('roam')
  }
}

function cycleTip() {
  tipIndex.value = (tipIndex.value + 1) % filteredHudTips.value.length
  activeMentor.value = currentTipObj.value.mentor || 'wizard'
}

function prevTip() {
  const len = filteredHudTips.value.length
  tipIndex.value = (tipIndex.value - 1 + len) % len
  activeMentor.value = currentTipObj.value.mentor || 'wizard'
}

function randomTip() {
  const len = filteredHudTips.value.length
  tipIndex.value = Math.floor(Math.random() * len)
  activeMentor.value = currentTipObj.value.mentor || 'wizard'
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function refreshStats() {
  stats.value = getStoredProgressStats(10)
}

function unleashScreenBugHunt() {
  if (typeof window === 'undefined') return
  if (roamMode.value === 'docked') {
    setRoamMode('roam')
  }

  // If both characters are currently inside the Hero 3D Stage (not on screen), spawn the bug burst inside the 3D Stage!
  if (stageBridge.activePlane === 'stage' && !stageBridge.wizInScreenPlane && !stageBridge.novaInScreenPlane) {
    window.dispatchEvent(new CustomEvent('qualiadept-stage-bug-burst'))
    return
  }

  // If inside the 3D Cards plane and neither is on screen, let them pop out to hunt bugs or pop a tip!
  const w = window.innerWidth
  const h = window.innerHeight
  for (let i = 0; i < 5; i++) {
    screenBugs.push({
      id: bugCounter++,
      x: 110 + Math.random() * Math.max(160, w - 220),
      y: 110 + Math.random() * Math.max(160, h - 240),
      vx: (Math.random() - 0.5) * 3.8,
      vy: (Math.random() - 0.5) * 3.2
    })
  }
  popRandomScreenTip()
}

function triggerCelebration() {
  refreshStats()
  unleashScreenBugHunt()
}

function handleMentorSelected(e) {
  const m = e?.detail?.mentor
  if (m === 'wizard' || m === 'nova') {
    switchMentor(m)
    if (stageBridge.activePlane === 'none') {
      popRandomScreenTip()
    }
  }
}

function handleScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollPercent.value = docHeight <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
}

function handleWindowMouseMove(e) {
  const dx = e.clientX - pointer.x
  const dy = e.clientY - pointer.y
  pointer.x = e.clientX
  pointer.y = e.clientY

  if (Math.hypot(dx, dy) > 14) {
    isPointerMovingFast.value = true
    if (pointerCalmTimer) clearTimeout(pointerCalmTimer)
    pointerCalmTimer = setTimeout(() => {
      isPointerMovingFast.value = false
    }, 420)
  }

  if (
    roamMode.value === 'roam' &&
    stageBridge.activePlane === 'none' &&
    screenBugs.length === 0 &&
    typeof window !== 'undefined' &&
    window.innerWidth >= 960
  ) {
    const featureCard = e.target?.closest?.('.VPFeature')
    if (featureCard) {
      const rect = featureCard.getBoundingClientRect()
      const cardTitle = featureCard.querySelector('.title')?.textContent || ''
      const isWizardCourse = cardTitle.includes('IT') || cardTitle.includes('Manual')
      if (isWizardCourse) {
        wizActor.targetX = Math.max(60, Math.min(window.innerWidth - 60, rect.left + 35))
        wizActor.targetY = Math.max(110, Math.min(window.innerHeight - 120, rect.top + 45))
      } else {
        novaActor.targetX = Math.max(60, Math.min(window.innerWidth - 60, rect.right - 35))
        novaActor.targetY = Math.max(110, Math.min(window.innerHeight - 120, rect.top + 45))
      }
    }
  }
}

function resizeScreenCanvas() {
  if (typeof window === 'undefined') return
  const canvas = screenCanvasRef.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
}

watch(
  () => route.path,
  async () => {
    handleScroll()
    requestedScope.value = 'auto'
    selectedCategory.value = 'all'
    tipIndex.value = 0
    screenTipCursor = 0
    floatingSpeech.value = ''
    prevPlane = null
    await nextTick()
    setTimeout(scanLiveDomTips, 120)
  }
)

onMounted(() => {
  if (typeof window === 'undefined') return
  const savedMentor = localStorage.getItem('qualiadept_active_mentor')
  if (savedMentor === 'wizard' || savedMentor === 'nova') {
    activeMentor.value = savedMentor
    stageBridge.activeMentor = savedMentor
  }
  const savedMode = localStorage.getItem('qualiadept_roam_mode')
  // On the homepage, start in 'roam' mode so the characters reside inside the 3D Stage without duplicating
  if (!isHomePage.value && (savedMode === 'roam' || savedMode === 'follow' || savedMode === 'docked')) {
    roamMode.value = savedMode
  } else {
    roamMode.value = 'roam'
  }
  stageBridge.roamMode = roamMode.value

  refreshStats()
  handleScroll()
  resizeScreenCanvas()
  setTimeout(scanLiveDomTips, 150)

  wizActor.x = 58
  wizActor.y = window.innerHeight * 0.56
  wizActor.targetX = 58
  wizActor.targetY = window.innerHeight * 0.56

  novaActor.x = window.innerWidth - 58
  novaActor.y = window.innerHeight * 0.56
  novaActor.targetX = window.innerWidth - 58
  novaActor.targetY = window.innerHeight * 0.56

  window.addEventListener('resize', resizeScreenCanvas, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('mousemove', handleWindowMouseMove, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('qualiadept-progress-updated', triggerCelebration)
  window.addEventListener('qualiadept-mentor-selected', handleMentorSelected)
  window.addEventListener('qualiadept-return-to-stage', handleReturnToStageEvent)

  const canvas = screenCanvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  let startTime = performance.now()
  let lastZapTick = startTime

  const tick = (now) => {
    const t = (now - startTime) / 1000
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight

    // 1. Determine active 3D foreground container ('stage' | 'cards' | 'none')
    let currentPlane = 'none'
    if (isHomePage.value) {
      if (stageBridge.isStageMounted && stageBridge.isStageVisible) {
        currentPlane = 'stage'
      } else if (stageBridge.isCardsMounted && stageBridge.isCardsVisible) {
        currentPlane = 'cards'
      }
    }
    stageBridge.activePlane = currentPlane

    // 2. Handle plane transitions when scrolling
    if (prevPlane === null) {
      prevPlane = currentPlane
      if (currentPlane === 'none') {
        stageBridge.wizInScreenPlane = true
        stageBridge.novaInScreenPlane = true
      } else {
        stageBridge.wizInScreenPlane = false
        stageBridge.novaInScreenPlane = false
      }
    } else if (currentPlane !== prevPlane) {
      if (currentPlane === 'none') {
        // Scrolled out of the 3D Stage or 3D Mentor Cards: characters emerge onto the screen!
        if (!stageBridge.wizInScreenPlane) launchMentorFromPlane('wizard', prevPlane)
        if (!stageBridge.novaInScreenPlane) launchMentorFromPlane('nova', prevPlane)
      } else {
        // Scrolled into the 3D Stage or 3D Mentor Cards:
        // Automatically deactivate Follow Mouse and transition characters into the 3D plane!
        if (roamMode.value === 'follow') {
          roamMode.value = 'roam'
          stageBridge.roamMode = 'roam'
          localStorage.setItem('qualiadept_roam_mode', 'roam')
        }

        if (prevPlane === 'stage' || prevPlane === 'cards') {
          const prevWizAnchor = getPlaneAnchor('wizard', prevPlane)
          const prevNovaAnchor = getPlaneAnchor('nova', prevPlane)
          if (!stageBridge.wizInScreenPlane && !wizActor.returning) {
            wizActor.x = prevWizAnchor.x
            wizActor.y = prevWizAnchor.y
          }
          if (!stageBridge.novaInScreenPlane && !novaActor.returning) {
            novaActor.x = prevNovaAnchor.x
            novaActor.y = prevNovaAnchor.y
          }
        }

        returnMentorToPlane('wizard', currentPlane)
        returnMentorToPlane('nova', currentPlane)
      }
      prevPlane = currentPlane
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    if (roamMode.value !== 'docked') {
      const safeMargin = w < 768 ? 38 : 56
      const wizActiveOnScreen = stageBridge.wizInScreenPlane || wizActor.returning
      const novaActiveOnScreen = stageBridge.novaInScreenPlane || novaActor.returning

      // Keep hidden screen actors synced to their current 3D Stage/Card coordinates
      if (!wizActiveOnScreen && currentPlane !== 'none') {
        const anchor = getPlaneAnchor('wizard', currentPlane)
        wizActor.x = anchor.x
        wizActor.y = anchor.y
        wizActor.targetX = anchor.x
        wizActor.targetY = anchor.y
      }
      if (!novaActiveOnScreen && currentPlane !== 'none') {
        const anchor = getPlaneAnchor('nova', currentPlane)
        novaActor.x = anchor.x
        novaActor.y = anchor.y
        novaActor.targetX = anchor.x
        novaActor.targetY = anchor.y
      }

      // Compute targets for returning vs active screen actors
      if (wizActor.returning && currentPlane !== 'none') {
        const anchor = getPlaneAnchor('wizard', currentPlane)
        wizActor.targetX = anchor.x
        wizActor.targetY = anchor.y
      }
      if (novaActor.returning && currentPlane !== 'none') {
        const anchor = getPlaneAnchor('nova', currentPlane)
        novaActor.targetX = anchor.x
        novaActor.targetY = anchor.y
      }

      let isInteractingNow = false

      if (screenBugs.length > 0 && (stageBridge.wizInScreenPlane || stageBridge.novaInScreenPlane)) {
        const bWiz = screenBugs[0]
        const bNova = screenBugs[screenBugs.length - 1]
        if (bWiz && stageBridge.wizInScreenPlane) {
          wizActor.targetX = Math.max(safeMargin, Math.min(w - safeMargin, bWiz.x - 65))
          wizActor.targetY = Math.max(100, Math.min(h - 140, bWiz.y + 15))
        }
        if (bNova && stageBridge.novaInScreenPlane) {
          novaActor.targetX = Math.max(safeMargin, Math.min(w - safeMargin, bNova.x + 65))
          novaActor.targetY = Math.max(100, Math.min(h - 140, bNova.y + 15))
        }

        if (now - lastZapTick > 420 && screenBugs.length > 0) {
          lastZapTick = now
          const zapped = screenBugs.shift()
          let useWiz = screenBugs.length % 2 === 0
          if (useWiz && !stageBridge.wizInScreenPlane) useWiz = false
          if (!useWiz && !stageBridge.novaInScreenPlane) useWiz = true

          if (useWiz) wizActor.casting = 18
          else novaActor.casting = 18

          screenLasers.push({
            from: useWiz ? 'wizard' : 'nova',
            toX: zapped.x,
            toY: zapped.y,
            color: useWiz ? '#34d399' : '#c084fc',
            alpha: 1
          })

          for (let i = 0; i < 18; i++) {
            const ang = (Math.PI * 2 * i) / 18
            const spd = 2 + Math.random() * 4.5
            screenParticles.push({
              x: zapped.x,
              y: zapped.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              r: 2.5 + Math.random() * 3,
              color: useWiz ? '#34d399' : '#c084fc',
              alpha: 1
            })
          }
        }
      } else if (roamMode.value === 'follow') {
        if (activeMentor.value === 'wizard') {
          if (stageBridge.novaInScreenPlane && !novaActor.returning) {
            novaActor.targetX = w - safeMargin + Math.cos(t * 1.2) * 10
            novaActor.targetY = h * 0.45 + Math.sin(t * 1.5) * 35
          }
          const otherPos = stageBridge.novaInScreenPlane
            ? { x: novaActor.x, y: novaActor.y }
            : getPlaneAnchor('nova', currentPlane)
          const rawFollowX = Math.max(safeMargin, Math.min(w - safeMargin, pointer.x - 75))
          const rawFollowY = Math.max(95, Math.min(h - 145, pointer.y - 10))
          const distToPartner = Math.hypot(rawFollowX - otherPos.x, rawFollowY - otherPos.y)

          if (stageBridge.wizInScreenPlane) {
            if (distToPartner < 165) {
              // Dock side-by-side next to Nova so their 3D bodies never overlap!
              isInteractingNow = true
              const dockOffset = otherPos.x < w * 0.5 ? 96 : -96
              wizActor.targetX = Math.max(safeMargin, Math.min(w - safeMargin, otherPos.x + dockOffset))
              wizActor.targetY = Math.max(95, Math.min(h - 145, otherPos.y))
              if (!wasMentorsInteracting && now - lastBanterTime > 2500) {
                wasMentorsInteracting = true
                lastBanterTime = now
                triggerMentorBanter()
              }
            } else {
              if (distToPartner > 210) wasMentorsInteracting = false
              wizActor.targetX = rawFollowX
              wizActor.targetY = rawFollowY
            }
          }
        } else {
          if (stageBridge.wizInScreenPlane && !wizActor.returning) {
            wizActor.targetX = safeMargin + Math.sin(t * 1.2) * 10
            wizActor.targetY = h * 0.45 + Math.cos(t * 1.5) * 35
          }
          const otherPos = stageBridge.wizInScreenPlane
            ? { x: wizActor.x, y: wizActor.y }
            : getPlaneAnchor('wizard', currentPlane)
          const rawFollowX = Math.max(safeMargin, Math.min(w - safeMargin, pointer.x + 75))
          const rawFollowY = Math.max(95, Math.min(h - 145, pointer.y - 10))
          const distToPartner = Math.hypot(rawFollowX - otherPos.x, rawFollowY - otherPos.y)

          if (stageBridge.novaInScreenPlane) {
            if (distToPartner < 165) {
              // Dock side-by-side next to Mr. QA Wizard so their 3D bodies never overlap!
              isInteractingNow = true
              const dockOffset = otherPos.x < w * 0.5 ? 96 : -96
              novaActor.targetX = Math.max(safeMargin, Math.min(w - safeMargin, otherPos.x + dockOffset))
              novaActor.targetY = Math.max(95, Math.min(h - 145, otherPos.y))
              if (!wasMentorsInteracting && now - lastBanterTime > 2500) {
                wasMentorsInteracting = true
                lastBanterTime = now
                triggerMentorBanter()
              }
            } else {
              if (distToPartner > 210) wasMentorsInteracting = false
              novaActor.targetX = rawFollowX
              novaActor.targetY = rawFollowY
            }
          }
        }
      } else if (currentPlane === 'none') {
        wasMentorsInteracting = false
        const scrollWave = (scrollPercent.value / 100) * (h * 0.38)
        if (stageBridge.wizInScreenPlane) {
          wizActor.targetX = safeMargin + Math.sin(t * 0.9) * 12
          wizActor.targetY = Math.max(125, Math.min(h - 145, h * 0.36 + scrollWave + Math.cos(t * 1.4) * 32))
        }
        if (stageBridge.novaInScreenPlane) {
          novaActor.targetX = w - safeMargin + Math.cos(t * 0.95) * 12
          novaActor.targetY = Math.max(125, Math.min(h - 145, h * 0.4 + scrollWave + Math.sin(t * 1.35) * 32))
        }
      } else {
        wasMentorsInteracting = false
      }

      // Physics step for Wizard
      const wizSpring = wizActor.returning ? 0.13 : 0.068
      const wizDamp = wizActor.returning ? 0.74 : 0.84
      wizActor.vx = wizActor.vx * wizDamp + (wizActor.targetX - wizActor.x) * wizSpring
      wizActor.vy = wizActor.vy * wizDamp + (wizActor.targetY - wizActor.y) * wizSpring
      wizActor.x += wizActor.vx
      wizActor.y += wizActor.vy
      if (wizActor.spin > 0.02) wizActor.spin *= 0.86
      else wizActor.spin = 0
      if (wizActor.casting > 0) wizActor.casting--
      if (wizActor.emerging > 0.01) wizActor.emerging *= 0.9
      else wizActor.emerging = 0

      if (wizActor.returning) {
        const distW = Math.hypot(wizActor.targetX - wizActor.x, wizActor.targetY - wizActor.y)
        if (distW < 26 || currentPlane === 'none') {
          wizActor.returning = false
          stageBridge.wizReturning = false
          if (currentPlane !== 'none') {
            spawnPortalBurst(wizActor.targetX, wizActor.targetY, '#38bdf8')
          } else {
            stageBridge.wizInScreenPlane = true
          }
        }
      }

      // Physics step for Nova
      const novaSpring = novaActor.returning ? 0.13 : 0.068
      const novaDamp = novaActor.returning ? 0.74 : 0.84
      novaActor.vx = novaActor.vx * novaDamp + (novaActor.targetX - novaActor.x) * novaSpring
      novaActor.vy = novaActor.vy * novaDamp + (novaActor.targetY - novaActor.y) * novaSpring
      novaActor.x += novaActor.vx
      novaActor.y += novaActor.vy
      if (novaActor.spin > 0.02) novaActor.spin *= 0.86
      else novaActor.spin = 0
      if (novaActor.casting > 0) novaActor.casting--
      if (novaActor.emerging > 0.01) novaActor.emerging *= 0.9
      else novaActor.emerging = 0

      if (novaActor.returning) {
        const distN = Math.hypot(novaActor.targetX - novaActor.x, novaActor.targetY - novaActor.y)
        if (distN < 26 || currentPlane === 'none') {
          novaActor.returning = false
          stageBridge.novaReturning = false
          if (currentPlane !== 'none') {
            spawnPortalBurst(novaActor.targetX, novaActor.targetY, '#c084fc')
          } else {
            stageBridge.novaInScreenPlane = true
          }
        }
      }

      // Update floating speech anchor to the exact center of the speaking character or midpoint during banter
      const wizPos = getSpeakingActorPosition('wizard')
      const novaPos = getSpeakingActorPosition('nova')
      if (activeBanter.value || floatingSpeech.value) {
        wizScreenX.value = wizPos.x
        wizScreenY.value = wizPos.y
        novaScreenX.value = novaPos.x
        novaScreenY.value = novaPos.y
      }
      if (activeBanter.value) {
        speechX.value = (wizPos.x + novaPos.x) / 2
        speechY.value = (wizPos.y + novaPos.y) / 2
      } else if (floatingSpeech.value) {
        const spkPos = floatingSpeaker.value === 'wizard' ? wizPos : novaPos
        speechX.value = spkPos.x
        speechY.value = spkPos.y
      }

      const wizFacingPartner = wizPos.x < novaPos.x ? 0.36 : -0.36
      const novaFacingPartner = novaPos.x < wizPos.x ? 0.36 : -0.36

      const wizYaw =
        (isInteractingNow ? wizFacingPartner : Math.max(-0.55, Math.min(0.55, (pointer.x - wizActor.x) / 380))) +
        wizActor.spin
      const wizPitch = Math.max(-0.4, Math.min(0.4, (pointer.y - wizActor.y) / 380))

      const novaYaw =
        (isInteractingNow ? novaFacingPartner : Math.max(-0.55, Math.min(0.55, (pointer.x - novaActor.x) / 380))) -
        novaActor.spin
      const novaPitch = Math.max(-0.4, Math.min(0.4, (pointer.y - novaActor.y) / 380))

      if (isInteractingNow || activeBanter.value) {
        renderMentorSynergyLink(ctx, wizPos.x, wizPos.y + 6, novaPos.x, novaPos.y + 6, t)
      }

      const baseScale = w < 640 ? 0.5 : (w < 1100 ? 0.65 : 0.78)

      // Context-aware dynamic character scaling:
      // Characters grow when speaking, interacting face-to-face, or zapping bugs,
      // and shrink slightly when moving fast with the cursor so they stay nimble and unobtrusive!
      const wizSpeed = Math.hypot(wizActor.vx, wizActor.vy)
      const novaSpeed = Math.hypot(novaActor.vx, novaActor.vy)
      const wizSpeaking = Boolean(activeBanter.value) || isInteractingNow || (Boolean(floatingSpeech.value) && floatingSpeaker.value === 'wizard')
      const novaSpeaking = Boolean(activeBanter.value) || isInteractingNow || (Boolean(floatingSpeech.value) && floatingSpeaker.value === 'nova')

      let targetWizFactor = 0.94
      if (wizSpeaking || wizActor.casting > 0) targetWizFactor = 1.14
      else if (roamMode.value === 'follow' && activeMentor.value === 'wizard' && wizSpeed > 4.2) targetWizFactor = 0.85
      else if (Math.hypot(pointer.x - wizActor.x, pointer.y - wizActor.y) < 110) targetWizFactor = 1.04

      let targetNovaFactor = 0.94
      if (novaSpeaking || novaActor.casting > 0) targetNovaFactor = 1.14
      else if (roamMode.value === 'follow' && activeMentor.value === 'nova' && novaSpeed > 4.2) targetNovaFactor = 0.85
      else if (Math.hypot(pointer.x - novaActor.x, pointer.y - novaActor.y) < 110) targetNovaFactor = 1.04

      wizActor.scaleFactor = (wizActor.scaleFactor || 1) + (targetWizFactor - (wizActor.scaleFactor || 1)) * 0.12
      novaActor.scaleFactor = (novaActor.scaleFactor || 1) + (targetNovaFactor - (novaActor.scaleFactor || 1)) * 0.12

      let wizEmit = { staffTipX: wizActor.x, staffTipY: wizActor.y }
      if (stageBridge.wizInScreenPlane || wizActor.returning) {
        let wizScale = baseScale * wizActor.scaleFactor
        let wizArcY = 0
        if (wizActor.returning) {
          const distW = Math.hypot(wizActor.targetX - wizActor.x, wizActor.targetY - wizActor.y)
          const prog = 1 - Math.min(1, distW / (wizActor.returnStartDist || 240))
          const targetPlaneScale = currentPlane === 'stage' ? 0.98 : 0.68
          wizScale = baseScale * (1 - prog) + targetPlaneScale * prog + Math.sin(prog * Math.PI) * 0.16
          wizArcY = -Math.sin(prog * Math.PI) * 34
          renderPlaneTransitionRings(ctx, wizActor.x, wizActor.y + wizArcY, wizScale, '#38bdf8', prog, t)
        } else if (wizActor.emerging > 0.05) {
          wizArcY = -Math.sin(wizActor.emerging * Math.PI) * 28
          renderPlaneTransitionRings(ctx, wizActor.x, wizActor.y + wizArcY, wizScale, '#38bdf8', wizActor.emerging, t)
        }

        wizEmit = renderWizard3D(ctx, {
          cx: wizActor.x,
          cy: wizActor.y + wizArcY,
          scale: wizScale,
          pitch: wizPitch,
          yaw: wizYaw,
          t,
          isCasting: wizActor.casting > 0 || wizActor.returning || isInteractingNow,
          vx: wizActor.vx
        })
      }

      let novaEmit = { emitterX: novaActor.x, emitterY: novaActor.y }
      if (stageBridge.novaInScreenPlane || novaActor.returning) {
        let novaScale = baseScale * novaActor.scaleFactor
        let novaArcY = 0
        if (novaActor.returning) {
          const distN = Math.hypot(novaActor.targetX - novaActor.x, novaActor.targetY - novaActor.y)
          const prog = 1 - Math.min(1, distN / (novaActor.returnStartDist || 240))
          const targetPlaneScale = currentPlane === 'stage' ? 0.98 : 0.68
          novaScale = baseScale * (1 - prog) + targetPlaneScale * prog + Math.sin(prog * Math.PI) * 0.16
          novaArcY = -Math.sin(prog * Math.PI) * 34
          renderPlaneTransitionRings(ctx, novaActor.x, novaActor.y + novaArcY, novaScale, '#c084fc', prog, t)
        } else if (novaActor.emerging > 0.05) {
          novaArcY = -Math.sin(novaActor.emerging * Math.PI) * 28
          renderPlaneTransitionRings(ctx, novaActor.x, novaActor.y + novaArcY, novaScale, '#c084fc', novaActor.emerging, t)
        }

        novaEmit = renderNova3D(ctx, {
          cx: novaActor.x,
          cy: novaActor.y + novaArcY,
          scale: novaScale,
          pitch: novaPitch,
          yaw: novaYaw,
          t,
          isCasting: novaActor.casting > 0 || novaActor.returning || isInteractingNow,
          vx: novaActor.vx
        })
      }

      screenBugs.forEach((b) => {
        b.x += b.vx + Math.sin(t * 5 + b.id) * 1.1
        b.y += b.vy + Math.cos(t * 4.5 + b.id) * 1.1
        if (b.x < 70 || b.x > w - 70) b.vx *= -1
        if (b.y < 80 || b.y > h - 100) b.vy *= -1
        renderBug3D(ctx, b, t)
      })

      for (let i = screenLasers.length - 1; i >= 0; i--) {
        const l = screenLasers[i]
        const sx = l.from === 'wizard' ? wizEmit.staffTipX : novaEmit.emitterX
        const sy = l.from === 'wizard' ? wizEmit.staffTipY : novaEmit.emitterY
        ctx.save()
        ctx.strokeStyle = l.color
        ctx.lineWidth = 4 * l.alpha
        ctx.shadowColor = l.color
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(l.toX, l.toY)
        ctx.stroke()
        ctx.restore()
        l.alpha -= 0.08
        if (l.alpha <= 0) screenLasers.splice(i, 1)
      }

      for (let i = screenParticles.length - 1; i >= 0; i--) {
        const p = screenParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.14
        p.alpha -= 0.032
        if (p.alpha <= 0) {
          screenParticles.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    ctx.restore()
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (speechTimeout) clearTimeout(speechTimeout)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeScreenCanvas)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('mousemove', handleWindowMouseMove)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('qualiadept-progress-updated', triggerCelebration)
    window.removeEventListener('qualiadept-mentor-selected', handleMentorSelected)
    window.removeEventListener('qualiadept-return-to-stage', handleReturnToStageEvent)
  }
})
</script>

<style scoped>
/* Top Reading Progress Bar */
.qa-reading-progress-track {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
}

.qa-reading-progress-fill {
  height: 100%;
  transition: width 0.12s ease-out;
  border-radius: 0 4px 4px 0;
}

.wizard-gradient {
  background: linear-gradient(90deg, #38bdf8 0%, #6366f1 50%, #10b981 100%);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.7);
}

.nova-gradient {
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #22d3ee 100%);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
}

/* Full-Viewport Transparent 3D Roaming Canvas */
.roaming-3d-screen-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9980;
}

/* Floating Speech Bubble Beside Roaming 3D Character (Never overlaps the character) */
.roaming-speech-callout {
  position: fixed;
  transform: none;
  width: 300px;
  max-width: calc(100vw - 28px);
  box-sizing: border-box;
  padding: 11px 13px;
  border-radius: 16px;
  background: rgba(11, 14, 28, 0.96);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(56, 189, 248, 0.55);
  color: #f8fafc;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.48);
  z-index: 9988;
  text-align: left;
  transition:
    left 0.1s ease-out,
    top 0.1s ease-out,
    width 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.22s ease,
    border-radius 0.22s ease;
}

.roaming-speech-callout.callout-size-short {
  padding: 9px 12px;
}

.roaming-speech-callout.is-compact-callout {
  padding: 7px 11px;
  border-radius: 14px;
  background: rgba(11, 14, 28, 0.9);
}

.roaming-speech-callout.nova-callout {
  border-color: rgba(192, 132, 252, 0.6);
}

.callout-resize-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.38);
  color: #7dd3fc;
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.callout-resize-btn:hover {
  background: rgba(56, 189, 248, 0.32);
  color: #fff;
}

.callout-compact-preview {
  font-size: 0.7rem;
  font-weight: 600;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding-top: 2px;
}

.callout-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.callout-top-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.callout-speaker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #38bdf8;
  text-transform: uppercase;
}

.nova-callout .callout-speaker {
  color: #c084fc;
}

.callout-tip-num {
  font-style: normal;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.62rem;
}

.callout-next-btn {
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.45);
  color: #7dd3fc;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 0.64rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.callout-next-btn:hover {
  background: #0284c7;
  color: #fff;
}

.callout-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.callout-close-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.6);
  color: #fca5a5;
}

.callout-source-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  padding: 3px 8px;
  border-radius: 7px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.26);
  font-size: 0.65rem;
}

.callout-source-label {
  color: #a5b4fc;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.callout-source-link {
  color: #38bdf8 !important;
  font-weight: 800;
  text-decoration: none !important;
  flex-shrink: 0;
}

.callout-body-block {
  text-align: left;
  border-left: 3px solid #38bdf8;
  padding-left: 9px;
  margin-top: 4px;
}

.nova-callout .callout-body-block {
  border-left-color: #c084fc;
}

.callout-tip-title {
  display: block;
  font-size: 0.76rem;
  font-weight: 800;
  color: #7dd3fc;
  margin-bottom: 2px;
  line-height: 1.3;
}

.nova-callout .callout-tip-title {
  color: #d8b4fe;
}

.callout-text {
  margin: 0 !important;
  font-size: 0.78rem;
  line-height: 1.46;
  color: #f1f5f9;
  text-align: left !important;
}

/* Dual-Mentor Interactive Banter Callout */
.roaming-speech-callout.dual-banter-callout {
  border: 1px solid rgba(168, 85, 247, 0.65);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55), 0 0 24px rgba(56, 189, 248, 0.22);
}

.banter-speaker-badge {
  background: linear-gradient(90deg, #38bdf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banter-next-btn {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.24), rgba(168, 85, 247, 0.28));
  border-color: rgba(168, 85, 247, 0.55);
  color: #e9d5ff;
}

.banter-next-btn:hover {
  background: linear-gradient(135deg, #0284c7, #9333ea);
  color: #fff;
}

.banter-topic-row {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.16), rgba(168, 85, 247, 0.16));
  border-color: rgba(168, 85, 247, 0.35);
}

.banter-exchange-stack {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 6px;
}

.banter-line-item {
  padding: 7px 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.78);
  border-left: 3px solid #38bdf8;
  text-align: left;
}

.banter-line-item.wizard-line {
  border-left-color: #38bdf8;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.13), rgba(15, 23, 42, 0.75));
}

.banter-line-item.nova-line {
  border-left-color: #c084fc;
  background: linear-gradient(90deg, rgba(192, 132, 252, 0.14), rgba(15, 23, 42, 0.75));
}

.banter-line-author {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  margin-bottom: 2px;
  color: #38bdf8;
}

.banter-line-item.nova-line .banter-line-author {
  color: #d8b4fe;
}

.hud-source-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px 9px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(129, 140, 248, 0.22);
  font-size: 0.7rem;
}

.hud-source-name {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hud-source-link {
  font-weight: 800;
  color: #38bdf8 !important;
  text-decoration: none !important;
  flex-shrink: 0;
}

.hud-tip-body-wrap {
  text-align: left;
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 10px;
}

.hud-tip-title {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  margin-bottom: 3px;
  line-height: 1.35;
}

/* Bottom-Right Interactive 3D Dock Bar */
.companion-dock-bar {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9992;
  max-width: calc(100vw - 24px);
}

.dock-quick-btn {
  padding: 9px 13px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid rgba(129, 140, 248, 0.35);
  background: rgba(15, 17, 30, 0.92);
  backdrop-filter: blur(14px);
  color: #f8fafc;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.dock-quick-btn:hover {
  transform: translateY(-2px);
}

.dock-quick-btn.tip-trigger {
  background: linear-gradient(135deg, #4f46e5, #0284c7);
  border-color: rgba(56, 189, 248, 0.55);
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.3);
}

.dock-quick-btn.bug-trigger {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.96));
  border-color: rgba(52, 211, 153, 0.55);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.3);
}

.dock-quick-btn.mode-toggle:hover {
  border-color: #38bdf8;
  color: #38bdf8;
}

.dock-quick-btn.mode-toggle.is-following {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.94), rgba(79, 70, 229, 0.96));
  border-color: rgba(192, 132, 252, 0.65);
  box-shadow: 0 10px 26px rgba(168, 85, 247, 0.38);
  color: #ffffff;
}

/* Floating Orb Button */
.companion-orb-btn {
  position: relative;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 50%;
  padding: 0;
  border: none;
  background: linear-gradient(135deg, #1e1b4b, #0f172a);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(56, 189, 248, 0.38);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.companion-orb-btn:hover {
  transform: translateY(-3px) scale(1.06);
}

.orb-progress-ring {
  position: absolute;
  inset: -2px;
  width: 58px;
  height: 58px;
  transform: rotate(-90deg);
  pointer-events: none;
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke: #22d3ee;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.orb-nova .ring-fill {
  stroke: #c084fc;
}

.orb-3d-icon {
  font-size: 1.5rem;
  line-height: 1;
}

/* Expandable HUD Card */
.companion-hud-card {
  position: fixed;
  bottom: 82px;
  right: 16px;
  width: 365px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 22px;
  background: rgba(15, 17, 30, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(129, 140, 248, 0.38);
  color: #f8fafc;
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.55);
  z-index: 9993;
}

.hud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hud-mentor-tabs {
  display: flex;
  gap: 6px;
}

.hud-mentor-tab {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hud-mentor-tab.active {
  background: linear-gradient(135deg, #4f46e5, #0284c7);
  border-color: #38bdf8;
  color: #fff;
}

.hud-close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
}

/* 3D Mode Switcher */
.hud-mode-section {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mode-section-title {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 8px;
}

.mode-pills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.mode-btn {
  padding: 6px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  color: #38bdf8;
}

/* Tip Box */
.hud-tip-box {
  margin: 12px 16px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tip-box-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 8px;
}

.tip-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: #38bdf8;
}

.tip-nav-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mini-nav-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e2e8f0;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.68rem;
  cursor: pointer;
}

.mini-nav-btn:hover {
  background: rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
}

.next-tip-btn {
  background: rgba(99, 102, 241, 0.22);
  border: 1px solid rgba(129, 140, 248, 0.45);
  color: #c7d2fe;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}

.hud-cat-scroll {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 8px;
}

.hud-cat-pill {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  cursor: pointer;
}

.hud-cat-pill.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #fff;
}

.tip-content {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.52;
  color: #f1f5f9;
}

/* Progress Section */
.hud-progress-section {
  margin: 0 16px 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.28);
}

.hud-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 6px;
}

.hud-progress-label {
  color: #cbd5e1;
  font-weight: 600;
}

.hud-progress-count {
  color: #34d399;
}

.hud-progress-bar {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.hud-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4);
  border-radius: 999px;
  transition: width 0.35s ease;
}

/* Footer Quick Links */
.hud-footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.hud-action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none !important;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #fff !important;
  transition: all 0.2s ease;
}

.hud-action-link.bug-hunt-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  border-color: transparent;
}

.hud-action-link.primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: transparent;
}

.companion-panel-enter-active,
.companion-panel-leave-active,
.companion-pop-enter-active,
.companion-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.companion-panel-enter-from,
.companion-panel-leave-to,
.companion-pop-enter-from,
.companion-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

@media (max-width: 768px) {
  .dock-quick-btn.mode-toggle {
    display: none;
  }
}

@media (max-width: 520px) {
  .dock-quick-btn.bug-trigger {
    display: none;
  }
  .dock-quick-btn.tip-trigger {
    padding: 8px 11px;
    font-size: 0.7rem;
  }
}
</style>
