<template>
  <button
    type="button"
    v-if="isMounted && hasSidebar"
    class="sidebar-nav-toggle-btn"
    :class="{ 'is-collapsed': isCollapsed }"
    @click.stop.prevent="toggleSidebar"
    :title="isCollapsed ? (isEn ? 'Expand Sidebar (Ctrl+B)' : 'Afișează Bara Laterală (Ctrl+B)') : (isEn ? 'Collapse Sidebar (Ctrl+B)' : 'Restrânge Bara Laterală (Ctrl+B)')"
    :aria-label="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <polyline v-if="!isCollapsed" points="15 9 12 12 15 15" />
      <polyline v-else points="12 9 15 12 12 15" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()
const isMounted = ref(false)
const isCollapsed = ref(false)

const isEn = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en/')
  }
  return false
})

function applySidebarState(collapsed) {
  isCollapsed.value = collapsed
  if (typeof document !== 'undefined') {
    if (collapsed) {
      document.documentElement.classList.add('sidebar-collapsed')
    } else {
      document.documentElement.classList.remove('sidebar-collapsed')
    }
    localStorage.setItem('qualiadept_sidebar_collapsed', collapsed ? 'true' : 'false')
  }
}

function toggleSidebar() {
  applySidebarState(!isCollapsed.value)
}

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
    e.preventDefault()
    toggleSidebar()
  }
}

onMounted(() => {
  isMounted.value = true
  const saved = localStorage.getItem('qualiadept_sidebar_collapsed') === 'true'
  if (saved) {
    applySidebarState(true)
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.sidebar-nav-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  margin-left: 0;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  vertical-align: middle;
}

.sidebar-nav-toggle-btn:hover {
  color: var(--vp-c-brand-1);
  background: rgba(129, 140, 248, 0.12);
  border-color: rgba(129, 140, 248, 0.25);
  transform: scale(1.04);
}

.sidebar-nav-toggle-btn.is-collapsed {
  color: var(--vp-c-brand-1);
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.35);
}

.sidebar-nav-toggle-btn.is-collapsed:hover {
  background: rgba(99, 102, 241, 0.25);
}

/* Hide on mobile where VitePress already has a dedicated hamburger drawer */
@media (max-width: 959px) {
  .sidebar-nav-toggle-btn {
    display: none;
  }
}
</style>
