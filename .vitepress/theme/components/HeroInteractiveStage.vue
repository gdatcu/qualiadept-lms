<template>
  <div class="qa-hero-3d-arena" ref="arenaRef">
    <!-- Ambient 3D Neon Backdrop Orbs -->
    <div class="arena-aurora arena-aurora-1"></div>
    <div class="arena-aurora arena-aurora-2"></div>

    <!-- Top Interactive HUD Bar -->
    <div class="arena-hud-bar">
      <div class="hud-live-pill">
        <span class="pulse-dot"></span>
        <span>{{ isEn ? 'INTERACTIVE 3D STAGE • CLICK TO ZAP BUGS!' : 'SCENĂ 3D INTERACTIVĂ • DĂ CLICK SĂ VÂNEZI BUG-URI!' }}</span>
      </div>
      <div class="hud-score-pill">
        <span>🐞 {{ isEn ? 'Bugs Zapped:' : 'Bug-uri Prinse:' }}</span>
        <strong>{{ bugsZapped }}</strong>
      </div>
    </div>

    <!-- Interactive 60FPS 3D Canvas Stage -->
    <div
      class="canvas-stage-wrapper"
      :class="{
        'has-active-speech': Boolean(activeSpeech)
      }"
    >
      <canvas
        ref="canvasRef"
        class="hero-3d-canvas"
        @mouseenter="isCanvasHovered = true"
        @mouseleave="isCanvasHovered = false"
        @mousemove="onArenaMouseMove"
        @mousedown="onArenaClick"
      ></canvas>

      <!-- Fully Responsive Uncollapsed Speech Callout (Characters scale proportionally to textbox size!) -->
      <transition name="speech-fade">
        <div
          v-if="activeSpeech"
          ref="speechBubbleRef"
          class="stage-speech-bubble"
          :class="[
            activeSpeaker,
            stageBubbleSizeClass
          ]"
          @mousedown.stop
        >
          <div class="speaker-row">
            <span class="speaker-tag">
              {{ activeSpeaker === 'wizard' ? '🧙‍♂️ Mr. QA Wizard' : '🤖 Nova AI' }}
              <em v-if="activeTipNumber" class="tip-num-badge">{{ activeTipNumber }}</em>
            </span>

            <div class="stage-bubble-actions">
              <button type="button" class="next-stage-tip-btn" @click.stop="showRandomVaultTip">
                ✨ {{ isEn ? 'Next Tip' : 'Alt Sfat' }}
              </button>
              <button
                type="button"
                class="close-stage-tip-btn"
                @click.stop="closeStageTip"
                :title="isEn ? 'Close tip (ESC)' : 'Închide sfatul (ESC)'"
                aria-label="Close tip"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="stage-bubble-full-body">
            <div v-if="activeSourceTitle" class="stage-source-tag">
              <span>📘 {{ activeSourceTitle }}</span>
              <a v-if="activeSourceUrl" :href="activeSourceUrl" class="stage-source-link" @click.stop>
                {{ isEn ? 'Open →' : 'Vezi →' }}
              </a>
            </div>
            <div class="stage-tip-content-block">
              <strong v-if="activeTipTitle" class="stage-tip-title">💡 {{ activeTipTitle }}</strong>
              <p class="stage-tip-body">{{ activeSpeech }}</p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Interactive Hint Overlay -->
      <div class="stage-hint-caption">
        ✨ {{ isEn ? 'Click anywhere in the 3D stage to spawn a bug & watch Mr. QA Wizard and Nova zap it!' : 'Dă click oriunde pe scena 3D pentru a genera un bug și privește cum Mr. QA Wizard & Nova îl vânează!' }}
      </div>
    </div>

    <!-- Bottom Interactive Action Controls -->
    <div class="arena-controls-row">
      <button type="button" class="arena-action-btn wizard-spell-btn" @click="triggerWizardSpell">
        <span>🧙‍♂️ {{ isEn ? 'QA Bug-Zap + Tip' : 'Vraja QA + Sfat' }}</span>
      </button>
      <button type="button" class="arena-action-btn nova-boost-btn" @click="triggerNovaDeploy">
        <span>🤖 {{ isEn ? 'Nova Auto + Tip' : 'Nova Auto + Sfat' }}</span>
      </button>
      <button type="button" class="arena-action-btn bug-spawn-btn" @click="spawnBugBurst">
        <span>🐞 {{ isEn ? '+3 Bugs' : '+3 Bug-uri' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { renderWizard3D, renderNova3D, renderBug3D, stageBridge, renderStagePortalPad } from './Scene3DEngine.mjs'
import { MENTOR_TIPS_VAULT } from '../mentorTipsVault.mjs'
import { data as lmsExtractedTips } from '../lmsContentTips.data.mjs'
import { getContextualTipsForRoute, isHomePageRoute } from '../lmsTipsExtractor.mjs'

const route = useRoute()
const isEn = computed(() => route.path.startsWith('/en/'))

const allStageTips = computed(() => {
  const res = getContextualTipsForRoute({
    routePath: route.path,
    lang: isEn.value ? 'en' : 'ro',
    extractedTips: Array.isArray(lmsExtractedTips) ? lmsExtractedTips : [],
    baseVaultTips: MENTOR_TIPS_VAULT
  })
  return res.tips.length > 0 ? res.tips : MENTOR_TIPS_VAULT
})

const arenaRef = ref(null)
const canvasRef = ref(null)
const speechBubbleRef = ref(null)
const bubbleVirtualBottom = ref(0)
const bugsZapped = ref(12)
const activeSpeech = ref('')
const activeTipTitle = ref('')
const activeSpeaker = ref('wizard')
const activeTipNumber = ref('')
const activeSourceTitle = ref('')
const activeSourceUrl = ref('')
const isCanvasHovered = ref(false)

const stageBubbleSizeClass = computed(() => {
  const len = (activeSpeech.value?.length || 0) + (activeTipTitle.value?.length || 0)
  if (len < 95) return 'size-short'
  if (len <= 185) return 'size-medium'
  return 'size-long'
})

function getLiveBubbleBottomVirtual() {
  if (!activeSpeech.value) return 0
  if (speechBubbleRef.value && canvasRef.value) {
    const bubbleRect = speechBubbleRef.value.getBoundingClientRect()
    const canvasRect = canvasRef.value.getBoundingClientRect()
    if (canvasRect.height > 0 && bubbleRect.height > 0) {
      // Exact distance from canvas top to bubble bottom in virtual canvas units (0..340)
      const vBottom = ((bubbleRect.bottom - canvasRect.top) / canvasRect.height) * 340
      bubbleVirtualBottom.value = vBottom
      return vBottom
    }
  }
  if (bubbleVirtualBottom.value > 0) return bubbleVirtualBottom.value
  // Robust fallback estimate based on character count:
  const textLen = (activeSpeech.value?.length || 0) + (activeTipTitle.value?.length || 0)
  return textLen > 220 ? 190 : textLen > 120 ? 150 : 105
}

function updateBubbleHeight() {
  getLiveBubbleBottomVirtual()
}

let bubbleResizeObserver = null

let rafId = null
let speechTimer = null
let vaultCursor = 0

// 3D Stage State
const mouse = { x: 260, y: 180, normX: 0, normY: 0 }
const wizardPos = { x: 145, y: 245, targetX: 145, targetY: 245, vx: 0, vy: 0, spin: 0, casting: 0, scale: 0.85 }
const novaPos = { x: 375, y: 245, targetX: 375, targetY: 245, vx: 0, vy: 0, spin: 0, casting: 0, scale: 0.85 }
let bugs = []
let lasers = []
let particles = []
let floatingTexts = []
let nextBugId = 1

function closeStageTip() {
  activeSpeech.value = ''
  activeTipTitle.value = ''
  activeTipNumber.value = ''
  activeSourceTitle.value = ''
  activeSourceUrl.value = ''
  bubbleVirtualBottom.value = 0
  if (speechTimer) {
    clearTimeout(speechTimer)
    speechTimer = null
  }
}

function handleKeyDown(e) {
  if ((e.key === 'Escape' || e.key === 'Esc') && activeSpeech.value) {
    closeStageTip()
  }
}

function showSpeechFromTip(chosen, indexInPool, totalPool) {
  activeSpeaker.value = chosen.mentor || 'wizard'
  activeTipTitle.value = chosen.tipTitle || ''
  activeSpeech.value = chosen.tipBody || chosen.text || (isEn.value ? chosen.en : chosen.ro)
  activeTipNumber.value = `#${indexInPool + 1}/${totalPool}`
  activeSourceTitle.value = chosen.sourceTitle || chosen.courseLabel || ''
  activeSourceUrl.value = chosen.url && !isHomePageRoute(chosen.url) ? chosen.url : ''
  // Textbox stays permanently on screen until explicit user dismissal (X button or ESC key!)
  if (speechTimer) {
    clearTimeout(speechTimer)
    speechTimer = null
  }
  nextTick(() => {
    updateBubbleHeight()
    if (speechBubbleRef.value && bubbleResizeObserver) {
      bubbleResizeObserver.observe(speechBubbleRef.value)
    }
  })
}

watch(activeSpeech, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (speechBubbleRef.value && bubbleResizeObserver) {
      bubbleResizeObserver.observe(speechBubbleRef.value)
    }
    updateBubbleHeight()
  }
})

function showNextTipForMentor(mentorKey) {
  const pool = allStageTips.value
  const matching = pool.filter((item) => item.mentor === mentorKey)
  const chosen = matching[vaultCursor % matching.length] || pool[0]
  const globalIdx = Math.max(0, pool.indexOf(chosen))
  vaultCursor += Math.floor(Math.random() * 5) + 1
  showSpeechFromTip(chosen, globalIdx, pool.length)
}

function showRandomVaultTip() {
  const pool = allStageTips.value
  const idx = vaultCursor % pool.length
  const chosen = pool[idx] || pool[0]
  vaultCursor = (idx + 1 + Math.floor(Math.random() * 7)) % pool.length
  if (chosen.mentor === 'wizard') wizardPos.spin = Math.PI * 2
  else novaPos.spin = Math.PI * 2
  showSpeechFromTip(chosen, idx, pool.length)
}

function spawnBug(x, y) {
  const isExpandedTip = Boolean(activeSpeech.value)
  const bvh = isExpandedTip ? getLiveBubbleVirtualHeight() : 0
  const minBugY = isExpandedTip ? Math.min(255, 8 + bvh + 25) : 145
  bugs.push({
    id: nextBugId++,
    x: x ?? (90 + Math.random() * 340),
    y: y ?? (minBugY + Math.random() * Math.max(25, 275 - minBugY)),
    vx: (Math.random() - 0.5) * 2.2,
    vy: (Math.random() - 0.5) * 1.8,
    hp: 1
  })
}

function createExplosion(x, y, color = '#34d399') {
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3
    const speed = 1.5 + Math.random() * 4.5
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2.5 + Math.random() * 3.5,
      color: i % 2 === 0 ? color : '#38bdf8',
      alpha: 1
    })
  }
  floatingTexts.push({
    x,
    y: y - 10,
    text: '+100 XP BUG SQUASHED!',
    alpha: 1,
    vy: -1.4
  })
}

function isWizInStageNow() {
  return stageBridge.activePlane === 'stage' && !stageBridge.wizInScreenPlane && !stageBridge.wizReturning
}

function isNovaInStageNow() {
  return stageBridge.activePlane === 'stage' && !stageBridge.novaInScreenPlane && !stageBridge.novaReturning
}

function zapNearestBug(actor = 'wizard', showTip = true) {
  const wizHere = isWizInStageNow()
  const novaHere = isNovaInStageNow()
  if (!wizHere && !novaHere) return

  // If the requested actor migrated out to follow the mouse, let the centered partner zap the bug!
  let effectiveActor = actor
  if (effectiveActor === 'wizard' && !wizHere && novaHere) effectiveActor = 'nova'
  if (effectiveActor === 'nova' && !novaHere && wizHere) effectiveActor = 'wizard'

  if (bugs.length === 0) {
    spawnBug(210 + (Math.random() - 0.5) * 140, 155 + Math.random() * 70)
  }
  const target = bugs[0]
  if (!target) return

  const isExpandedTip = Boolean(activeSpeech.value)
  const bvh = isExpandedTip ? getLiveBubbleVirtualHeight() : 0
  const minCastY = isExpandedTip ? Math.min(265, 8 + bvh + (80 * wizardPos.scale) + 16) : 175

  if (effectiveActor === 'wizard') {
    wizardPos.casting = 22
    const minX = novaHere ? 95 : 160
    const maxX = novaHere ? 240 : 360
    wizardPos.targetX = Math.max(minX, Math.min(maxX, target.x - 35))
    wizardPos.targetY = Math.max(minCastY, Math.min(270, target.y + 25))
    lasers.push({
      fromActor: 'wizard',
      toX: target.x,
      toY: target.y,
      color: '#34d399',
      alpha: 1
    })
    if (showTip) showNextTipForMentor('wizard')
  } else {
    novaPos.casting = 22
    const minX = wizHere ? 280 : 160
    const maxX = wizHere ? 425 : 360
    novaPos.targetX = Math.max(minX, Math.min(maxX, target.x + 35))
    novaPos.targetY = Math.max(minCastY, Math.min(270, target.y + 25))
    lasers.push({
      fromActor: 'nova',
      toX: target.x,
      toY: target.y,
      color: '#c084fc',
      alpha: 1
    })
    if (showTip) showNextTipForMentor('nova')
  }

  createExplosion(target.x, target.y, effectiveActor === 'wizard' ? '#34d399' : '#c084fc')
  bugs.shift()
  bugsZapped.value++
}

function triggerWizardSpell() {
  if (!isWizInStageNow() && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('qualiadept-return-to-stage', { detail: { mentor: 'wizard' } }))
  }
  wizardPos.spin = Math.PI * 2
  zapNearestBug('wizard', true)
}

function triggerNovaDeploy() {
  if (!isNovaInStageNow() && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('qualiadept-return-to-stage', { detail: { mentor: 'nova' } }))
  }
  novaPos.spin = Math.PI * 2
  zapNearestBug('nova', true)
}

function spawnBugBurst() {
  for (let i = 0; i < 3; i++) {
    spawnBug(110 + Math.random() * 300, 150 + Math.random() * 95)
  }
  const wizHere = isWizInStageNow()
  const novaHere = isNovaInStageNow()
  const chosen = wizHere && novaHere ? (Math.random() > 0.5 ? 'wizard' : 'nova') : (wizHere ? 'wizard' : 'nova')
  showNextTipForMentor(chosen)
}

function onArenaMouseMove(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const scaleX = 520 / rect.width
  const scaleY = 340 / rect.height
  mouse.x = (e.clientX - rect.left) * scaleX
  mouse.y = (e.clientY - rect.top) * scaleY
  mouse.normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouse.normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

function onArenaClick(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const clickX = (e.clientX - rect.left) * (520 / rect.width)
  const clickY = (e.clientY - rect.top) * (340 / rect.height)

  const wizHere = isWizInStageNow()
  const novaHere = isNovaInStageNow()

  // If Follow Mouse is active and the user clicks on the empty portal pad (or stage), recall the character into the 3D Stage plane!
  if (stageBridge.roamMode === 'follow' && (!wizHere || !novaHere)) {
    if ((!wizHere && clickX < 210) || (!novaHere && clickX > 310)) {
      window.dispatchEvent(new CustomEvent('qualiadept-return-to-stage'))
      return
    }
  }

  if (wizHere && Math.hypot(clickX - wizardPos.x, clickY - wizardPos.y) < 55) {
    triggerWizardSpell()
    return
  }
  if (novaHere && Math.hypot(clickX - novaPos.x, clickY - novaPos.y) < 55) {
    triggerNovaDeploy()
    return
  }

  spawnBug(clickX, clickY)
  setTimeout(() => {
    zapNearestBug(clickX < 260 ? 'wizard' : 'nova', false)
  }, 320)
}

function handleGlobalMouseMove(e) {
  if (typeof window === 'undefined') return
  mouse.normX = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.normY = (e.clientY / window.innerHeight - 0.5) * 2
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const canvas = canvasRef.value
  if (!canvas) return

  stageBridge.isStageMounted = true
  stageBridge.isStageVisible = true
  stageBridge.activePlane = 'stage'

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = 520
  const height = 340
  canvas.width = width * dpr
  canvas.height = height * dpr

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  spawnBug(255, 165)
  spawnBug(195, 185)

  showNextTipForMentor('wizard')

  if (typeof ResizeObserver !== 'undefined') {
    bubbleResizeObserver = new ResizeObserver(() => {
      updateBubbleHeight()
    })
    if (speechBubbleRef.value) {
      bubbleResizeObserver.observe(speechBubbleRef.value)
    }
  }

  window.addEventListener('resize', updateBubbleHeight, { passive: true })
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('qualiadept-stage-bug-burst', spawnBugBurst)
  window.addEventListener('qualiadept-stage-show-tip', showRandomVaultTip)

  let startTime = performance.now()
  let lastAutoZap = startTime

  const animate = (now) => {
    const t = (now - startTime) / 1000

    // Sync exact viewport coordinates of the 3D Stage & character pedestals to stageBridge
    const rect = canvas.getBoundingClientRect()
    const vh = window.innerHeight || 800
    stageBridge.isStageMounted = true
    stageBridge.isStageVisible = rect.width > 0 && rect.bottom > 180 && rect.top < vh - 90

    const wizInStage = stageBridge.activePlane === 'stage' && !stageBridge.wizInScreenPlane && !stageBridge.wizReturning
    const novaInStage = stageBridge.activePlane === 'stage' && !stageBridge.novaInScreenPlane && !stageBridge.novaReturning

    const wizAnchorX = wizInStage ? wizardPos.x : 140
    const wizAnchorY = wizInStage ? wizardPos.y : 225
    const novaAnchorX = novaInStage ? novaPos.x : 380
    const novaAnchorY = novaInStage ? novaPos.y : 225

    if (rect.width > 0 && rect.height > 0) {
      stageBridge.wizardStageScreen.x = rect.left + (wizAnchorX / width) * rect.width
      stageBridge.wizardStageScreen.y = rect.top + (wizAnchorY / height) * rect.height
      stageBridge.novaStageScreen.x = rect.left + (novaAnchorX / width) * rect.width
      stageBridge.novaStageScreen.y = rect.top + (novaAnchorY / height) * rect.height
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    // 1. Draw 3D Perspective Cyber Floor Grid
    ctx.save()
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.16)'
    ctx.lineWidth = 1
    const horizonY = 262
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath()
      ctx.moveTo(260 + i * 28, horizonY)
      ctx.lineTo(260 + i * 85, height)
      ctx.stroke()
    }
    for (let r = 0; r < 4; r++) {
      const y = horizonY + Math.pow((r + ((t * 0.8) % 1)) / 4, 1.5) * (height - horizonY)
      ctx.beginPath()
      ctx.moveTo(20, y)
      ctx.lineTo(width - 20, y)
      ctx.stroke()
    }
    ctx.restore()

    if ((wizInStage || novaInStage) && now - lastAutoZap > 5400) {
      lastAutoZap = now
      if (bugs.length < 2) {
        const liveBottom = activeSpeech.value ? getLiveBubbleBottomVirtual() : 0
        const minY = liveBottom > 0 ? Math.max(liveBottom + 20, 195) : 155
        const maxY = 305
        spawnBug(150 + Math.random() * 220, minY + Math.random() * Math.max(15, maxY - minY))
      } else {
        zapNearestBug(Math.random() > 0.5 ? 'wizard' : 'nova', false)
      }
    }

    // 2. Update & Render 3D Characters or Empty 3D Portal Pads
    // If one character migrated out to follow the mouse, the other moves to the center (x = 260)!
    const wizBaseX = !novaInStage && wizInStage ? 260 : 140
    const novaBaseX = !wizInStage && novaInStage ? 260 : 380

    // Responsive scale & altitude directly proportional to the textbox dimensions:
    // When the speech bubble expands with longer tips, characters scale down directly proportional
    // and float lower on the perspective floor grid so they are never obscured and fit comfortably!
    const isExpandedTip = Boolean(activeSpeech.value)
    const bubbleBottomY = isExpandedTip ? getLiveBubbleBottomVirtual() : 0

    // Available vertical height inside the 340px canvas below the uncollapsed textbox:
    const availableHeight = isExpandedTip ? Math.max(70, 332 - bubbleBottomY) : 180

    // Proportional reduction:
    // Baseline scale without tip: 1.05 (altitude 192)
    // As the textbox height grows, scale smoothly and proportionally decreases down to ~0.40 - 0.50:
    const scaleFactor = isExpandedTip
      ? Math.max(0.38, Math.min(0.82, (availableHeight / 190) * 0.70))
      : 1.05

    // Physical vertical extent of the wizard above center cy:
    // Hat tip extends ~72 * scale above cy, plus max bob of ~4 * scale.
    // Adding 16px of buffer ensures the wizard hat or staff lens NEVER touches or overlaps the speech bubble!
    const hatClearance = (74 * scaleFactor) + 16
    const minSafeCy = bubbleBottomY + hatClearance
    const maxSafeCy = 332 - (35 * scaleFactor)
    const targetStageY = isExpandedTip
      ? Math.min(maxSafeCy, Math.max(minSafeCy, bubbleBottomY + hatClearance + 6))
      : 192

    const baseStageY = targetStageY

    let targetWizScale = scaleFactor
    let targetNovaScale = scaleFactor

    if (isExpandedTip) {
      if (activeSpeaker.value === 'wizard') targetWizScale = Math.min(0.88, scaleFactor * 1.04)
      else targetNovaScale = Math.min(0.88, scaleFactor * 1.04)
    } else {
      if (!novaInStage && wizInStage) targetWizScale = 1.14
      if (!wizInStage && novaInStage) targetNovaScale = 1.14
    }

    if (isCanvasHovered.value && !isExpandedTip) {
      const distMouseWiz = Math.hypot(mouse.x - wizardPos.x, mouse.y - wizardPos.y)
      const distMouseNova = Math.hypot(mouse.x - novaPos.x, mouse.y - novaPos.y)
      if (distMouseWiz < 85) targetWizScale += 0.04
      if (distMouseNova < 85) targetNovaScale += 0.04
    }

    if (wizardPos.casting > 0) targetWizScale = Math.min(0.92, targetWizScale + 0.04)
    if (novaPos.casting > 0) targetNovaScale = Math.min(0.92, targetNovaScale + 0.04)

    wizardPos.scale += (targetWizScale - wizardPos.scale) * 0.14
    novaPos.scale += (targetNovaScale - novaPos.scale) * 0.14

    const dxW = wizardPos.targetX - wizardPos.x
    const dyW = wizardPos.targetY - wizardPos.y
    wizardPos.vx = wizardPos.vx * 0.82 + dxW * 0.08
    wizardPos.vy = wizardPos.vy * 0.82 + dyW * 0.08
    wizardPos.x += wizardPos.vx
    wizardPos.y += wizardPos.vy
    if (wizardPos.spin > 0.02) wizardPos.spin *= 0.86
    else wizardPos.spin = 0
    if (wizardPos.casting > 0) wizardPos.casting--

    if (wizardPos.casting === 0) {
      wizardPos.targetX = wizBaseX + Math.sin(t * 1.1) * 20
      wizardPos.targetY = baseStageY + Math.cos(t * 1.6) * 4
    }

    const dxN = novaPos.targetX - novaPos.x
    const dyN = novaPos.targetY - novaPos.y
    novaPos.vx = novaPos.vx * 0.82 + dxN * 0.08
    novaPos.vy = novaPos.vy * 0.82 + dyN * 0.08
    novaPos.x += novaPos.vx
    novaPos.y += novaPos.vy
    if (novaPos.spin > 0.02) novaPos.spin *= 0.86
    else novaPos.spin = 0
    if (novaPos.casting > 0) novaPos.casting--

    if (novaPos.casting === 0) {
      novaPos.targetX = novaBaseX + Math.cos(t * 1.2) * 20
      novaPos.targetY = baseStageY + Math.sin(t * 1.5) * 4
    }

    const wizYaw = mouse.normX * 0.45 + wizardPos.spin
    const wizPitch = mouse.normY * 0.32
    const novaYaw = mouse.normX * 0.45 - novaPos.spin
    const novaPitch = mouse.normY * 0.32

    let wizHands = { staffTipX: wizardPos.x, staffTipY: wizardPos.y }
    if (wizInStage) {
      wizHands = renderWizard3D(ctx, {
        cx: wizardPos.x,
        cy: wizardPos.y,
        scale: wizardPos.scale,
        pitch: wizPitch,
        yaw: wizYaw,
        t,
        isCasting: wizardPos.casting > 0,
        vx: wizardPos.vx
      })
    } else {
      renderStagePortalPad(
        ctx,
        135,
        274,
        '#38bdf8',
        t,
        stageBridge.roamMode === 'follow'
          ? (isEn.value ? 'FOLLOWING CURSOR' : 'URMĂREȘTE MOUSE')
          : ''
      )
    }

    let novaHands = { emitterX: novaPos.x, emitterY: novaPos.y }
    if (novaInStage) {
      novaHands = renderNova3D(ctx, {
        cx: novaPos.x,
        cy: novaPos.y,
        scale: novaPos.scale,
        pitch: novaPitch,
        yaw: novaYaw,
        t,
        isCasting: novaPos.casting > 0,
        vx: novaPos.vx
      })
    } else {
      renderStagePortalPad(
        ctx,
        385,
        274,
        '#c084fc',
        t,
        stageBridge.roamMode === 'follow'
          ? (isEn.value ? 'FOLLOWING CURSOR' : 'URMĂREȘTE MOUSE')
          : ''
      )
    }

    // 3. Update & Render Flying 3D Neon Bugs
    bugs.forEach((b) => {
      b.x += b.vx + Math.sin(t * 4 + b.id) * 0.8
      b.y += b.vy + Math.cos(t * 3.5 + b.id) * 0.8
      if (b.x < 60 || b.x > width - 60) b.vx *= -1
      if (b.y < 145 || b.y > 250) b.vy *= -1
      renderBug3D(ctx, b, t)
    })

    // 4. Render Active 3D Laser Beams
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i]
      const startX = l.fromActor === 'wizard' ? wizHands.staffTipX : novaHands.emitterX
      const startY = l.fromActor === 'wizard' ? wizHands.staffTipY : novaHands.emitterY

      ctx.save()
      ctx.strokeStyle = l.color
      ctx.lineWidth = 4 * l.alpha
      ctx.shadowColor = l.color
      ctx.shadowBlur = 16
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(l.toX, l.toY)
      ctx.stroke()
      ctx.restore()

      l.alpha -= 0.07
      if (l.alpha <= 0) lasers.splice(i, 1)
    }

    // 5. Render 3D Explosion Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.12
      p.alpha -= 0.032

      if (p.alpha <= 0) {
        particles.splice(i, 1)
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

    // 6. Floating XP Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i]
      ft.y += ft.vy
      ft.alpha -= 0.025
      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1)
        continue
      }
      ctx.save()
      ctx.globalAlpha = ft.alpha
      ctx.font = '800 12px Outfit, sans-serif'
      ctx.fillStyle = '#34d399'
      ctx.textAlign = 'center'
      ctx.fillText(ft.text, ft.x, ft.y)
      ctx.restore()
    }

    ctx.restore()
    rafId = requestAnimationFrame(animate)
  }

  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  stageBridge.isStageMounted = false
  stageBridge.isStageVisible = false
  if (rafId) cancelAnimationFrame(rafId)
  if (speechTimer) clearTimeout(speechTimer)
  if (bubbleResizeObserver) {
    bubbleResizeObserver.disconnect()
    bubbleResizeObserver = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateBubbleHeight)
    window.removeEventListener('mousemove', handleGlobalMouseMove)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('qualiadept-stage-bug-burst', spawnBugBurst)
    window.removeEventListener('qualiadept-stage-show-tip', showRandomVaultTip)
  }
})
</script>

<style scoped>
.qa-hero-3d-arena {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 24px;
  padding: 14px;
  background: linear-gradient(160deg, rgba(15, 17, 30, 0.96) 0%, rgba(22, 19, 44, 0.98) 100%);
  border: 1px solid rgba(129, 140, 248, 0.35);
  box-shadow:
    0 24px 48px -12px rgba(0, 0, 0, 0.45),
    0 0 32px rgba(79, 70, 229, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  overflow: hidden;
  user-select: none;
}

.arena-aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(55px);
  pointer-events: none;
  z-index: 0;
}

.arena-aurora-1 {
  top: -40px;
  left: -30px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.32), transparent 70%);
}

.arena-aurora-2 {
  bottom: -40px;
  right: -30px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.32), transparent 70%);
}

/* Top HUD Bar */
.arena-hud-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.hud-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(56, 189, 248, 0.32);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #e2e8f0;
  max-width: 100%;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  flex-shrink: 0;
  animation: pulse-glow 1.5s infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.65; }
}

.hud-score-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-size: 0.72rem;
  color: #a7f3d0;
}

.hud-score-pill strong {
  color: #34d399;
  font-size: 0.82rem;
}

/* 3D Canvas Stage */
.canvas-stage-wrapper {
  position: relative;
  z-index: 2;
  border-radius: 18px;
  background: radial-gradient(circle at 50% 35%, rgba(49, 46, 129, 0.45) 0%, rgba(9, 10, 20, 0.94) 85%);
  border: 1px solid rgba(129, 140, 248, 0.24);
  overflow: hidden;
  cursor: crosshair;
}

.hero-3d-canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 520 / 340;
}

.stage-speech-bubble {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: 94%;
  max-height: none;
  overflow: visible;
  box-sizing: border-box;
  padding: 8px 12px;
  border-radius: 14px;
  background: rgba(11, 15, 29, 0.96);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(56, 189, 248, 0.55);
  color: #f8fafc;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
  text-align: left;
  cursor: default;
  transition:
    width 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.stage-speech-bubble.size-short {
  width: 88%;
}

.stage-speech-bubble.size-medium {
  width: 92%;
}

.stage-speech-bubble.size-long {
  width: 95%;
}

.stage-speech-bubble.nova {
  border-color: rgba(192, 132, 252, 0.6);
}

.speaker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.stage-bubble-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.speaker-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #38bdf8;
}

.stage-speech-bubble.nova .speaker-tag {
  color: #c084fc;
}

.tip-num-badge {
  font-style: normal;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.6rem;
}

.stage-source-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  padding: 3px 8px;
  border-radius: 7px;
  background: rgba(99, 102, 241, 0.16);
  border: 1px solid rgba(129, 140, 248, 0.28);
  font-size: 0.65rem;
  color: #a5b4fc;
  font-weight: 700;
}

.stage-source-tag span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-source-link {
  color: #38bdf8 !important;
  font-weight: 800;
  text-decoration: none !important;
  flex-shrink: 0;
}

.next-stage-tip-btn {
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

.next-stage-tip-btn:hover {
  background: #0284c7;
  color: #fff;
}

.close-stage-tip-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.close-stage-tip-btn:hover {
  background: rgba(239, 68, 68, 0.28);
  border-color: rgba(239, 68, 68, 0.65);
  color: #fca5a5;
  transform: scale(1.08);
}

.stage-tip-content-block {
  text-align: left;
  border-left: 3px solid #38bdf8;
  padding-left: 9px;
  margin-top: 4px;
}

.stage-speech-bubble.nova .stage-tip-content-block {
  border-left-color: #c084fc;
}

.stage-tip-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #7dd3fc;
  margin-bottom: 2px;
  line-height: 1.3;
}

.stage-speech-bubble.nova .stage-tip-title {
  color: #d8b4fe;
}

.stage-tip-body {
  margin: 0 !important;
  font-size: 0.76rem;
  line-height: 1.44;
  color: #f1f5f9;
  text-align: left !important;
}

.stage-hint-caption {
  text-align: center;
  padding: 6px 10px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(9, 10, 20, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* Interactive Action Buttons */
.arena-controls-row {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-top: 10px;
}

.arena-action-btn {
  padding: 9px 10px;
  border-radius: 12px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.arena-action-btn:hover {
  transform: translateY(-2px);
}

.wizard-spell-btn {
  background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.28);
}

.nova-boost-btn {
  background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.28);
}

.bug-spawn-btn {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.45);
  color: #34d399;
}

.bug-spawn-btn:hover {
  background: rgba(16, 185, 129, 0.3);
}

.speech-fade-enter-active,
.speech-fade-leave-active {
  transition: all 0.25s ease;
}

.speech-fade-enter-from,
.speech-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -6px);
}

@media (max-width: 560px) {
  .qa-hero-3d-arena {
    padding: 10px;
    border-radius: 18px;
  }
  .arena-controls-row {
    grid-template-columns: 1fr 1fr;
  }
  .bug-spawn-btn {
    grid-column: span 2;
  }
  .stage-speech-bubble p {
    font-size: 0.68rem;
  }
}
</style>
