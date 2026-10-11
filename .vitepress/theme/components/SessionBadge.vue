<template>
  <span 
    v-if="totalCount > 0" 
    class="session-badge" 
    :class="statusClass"
    :title="tooltipText"
  >
    <!-- Completed Icon -->
    <svg 
      v-if="isCompleted" 
      class="badge-icon" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fill-rule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clip-rule="evenodd" 
      />
    </svg>

    <!-- In Progress Icon -->
    <span v-else-if="isInProgress" class="badge-emoji">⚡</span>

    <!-- Label -->
    <span class="badge-text">{{ badgeLabel }}</span>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isChallengeCompleted } from '../challengeProgress.mjs'

const props = defineProps({
  challenges: {
    type: Array,
    default: () => []
  },
  lang: {
    type: String,
    default: 'ro'
  }
})

const completedCount = ref(0)
const totalCount = computed(() => props.challenges.length)

const isCompleted = computed(() => totalCount.value > 0 && completedCount.value === totalCount.value)
const isInProgress = computed(() => completedCount.value > 0 && completedCount.value < totalCount.value)

const statusClass = computed(() => {
  if (isCompleted.value) return 'completed'
  if (isInProgress.value) return 'in-progress'
  return 'pending'
})

const badgeLabel = computed(() => {
  if (isCompleted.value) {
    return props.lang === 'ro' 
      ? `✓ Finalizat (${completedCount.value}/${totalCount.value})`
      : `✓ Completed (${completedCount.value}/${totalCount.value})`
  }
  if (isInProgress.value) {
    return props.lang === 'ro'
      ? `${completedCount.value}/${totalCount.value} rezolvat`
      : `${completedCount.value}/${totalCount.value} solved`
  }
  return props.lang === 'ro'
    ? `0/${totalCount.value} provocări`
    : `0/${totalCount.value} challenges`
})

const tooltipText = computed(() => {
  if (props.lang === 'ro') {
    return `${completedCount.value} din ${totalCount.value} provocări rezolvate`
  }
  return `${completedCount.value} of ${totalCount.value} challenges completed`
})

function checkProgress() {
  if (typeof window === 'undefined') return
  let count = 0
  for (const id of props.challenges) {
    if (isChallengeCompleted(id)) {
      count++
    }
  }
  completedCount.value = count
}

function handleProgressEvent(event) {
  if (event?.detail?.challengeId && props.challenges.includes(event.detail.challengeId)) {
    checkProgress()
  } else {
    checkProgress()
  }
}

onMounted(() => {
  checkProgress()
  if (typeof window !== 'undefined') {
    window.addEventListener('qualiadept-progress-updated', handleProgressEvent)
    window.addEventListener('storage', checkProgress)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('qualiadept-progress-updated', handleProgressEvent)
    window.removeEventListener('storage', checkProgress)
  }
})
</script>

<style scoped>
.session-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  padding: 3px 8px;
  border-radius: 9999px;
  vertical-align: middle;
  margin-left: 8px;
  letter-spacing: 0.02em;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  user-select: none;
}

.session-badge.completed {
  background-color: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.1);
}

.dark .session-badge.completed {
  background-color: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.4);
}

.session-badge.in-progress {
  background-color: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.dark .session-badge.in-progress {
  background-color: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.4);
}

.session-badge.pending {
  background-color: rgba(100, 116, 139, 0.08);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.dark .session-badge.pending {
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.2);
}

.badge-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.badge-emoji {
  font-size: 0.75rem;
  line-height: 1;
}

.badge-text {
  display: inline-block;
}
</style>
