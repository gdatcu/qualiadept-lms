<script setup>
import { computed } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
import { getCorrectLanguageSwitchRoute, normalizePath, ARTICLE_LOCALE_MAP } from '../utils.mjs'

const { lang } = useData()
const route = useRoute()
const router = useRouter()

const isRo = computed(() => {
  const p = route.path || (typeof window !== 'undefined' ? window.location.pathname : '')
  return !p.startsWith('/en/')
})

function getTargetUrl(targetLang) {
  if (typeof window === 'undefined') return targetLang === 'en' ? '/en/' : '/ro/'
  const currentPath = window.location.pathname

  if (targetLang === 'en' && !currentPath.startsWith('/en/')) {
    // Check article map first
    const clean = normalizePath(currentPath)
    if (ARTICLE_LOCALE_MAP[clean]) {
      return ARTICLE_LOCALE_MAP[clean]
    }
    // General /ro/ -> /en/ path replacement
    return currentPath.replace(/^\/ro\/?/, '/en/') || '/en/'
  }

  if (targetLang === 'ro' && currentPath.startsWith('/en/')) {
    const clean = normalizePath(currentPath)
    if (ARTICLE_LOCALE_MAP[clean]) {
      return ARTICLE_LOCALE_MAP[clean]
    }
    return currentPath.replace(/^\/en\/?/, '/ro/') || '/ro/'
  }

  return currentPath
}

function switchTo(targetLang) {
  const target = getTargetUrl(targetLang)
  if (router?.go) {
    router.go(target)
  } else if (typeof window !== 'undefined') {
    window.location.href = target
  }
}
</script>

<template>
  <div class="mobile-lang-switcher" role="group" aria-label="Language Selector">
    <button
      type="button"
      class="mobile-lang-btn"
      :class="{ active: isRo }"
      :aria-pressed="isRo"
      @click="switchTo('ro')"
    >
      <span class="flag-icon flag-ro"></span>
      <span class="lang-text">Română</span>
      <span v-if="isRo" class="active-dot"></span>
    </button>
    <button
      type="button"
      class="mobile-lang-btn"
      :class="{ active: !isRo }"
      :aria-pressed="!isRo"
      @click="switchTo('en')"
    >
      <span class="flag-icon flag-en"></span>
      <span class="lang-text">English</span>
      <span v-if="!isRo" class="active-dot"></span>
    </button>
  </div>
</template>

<style scoped>
.mobile-lang-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin: 0 auto 20px auto;
  max-width: 288px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.mobile-lang-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-lang-btn:hover {
  color: var(--vp-c-text-1);
}

.mobile-lang-btn.active {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  border-color: var(--vp-c-divider);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.flag-icon {
  width: 18px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
}

.flag-ro {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Crect width='1' height='2' fill='%23002B7F'/%3E%3Crect width='1' height='2' x='1' fill='%23FCD116'/%3E%3Crect width='1' height='2' x='2' fill='%23CE1126'/%3E%3C/svg%3E") center / cover no-repeat;
}

.flag-en {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3CclipPath id='s'%3E%3Cpath d='M0 0v30h60V0z'/%3E%3C/clipPath%3E%3CclipPath id='t'%3E%3Cpath d='M30 15h30v15zv15H30zh-30v-15zv-15h30z'/%3E%3C/clipPath%3E%3Cg clip-path='url(%23s)'%3E%3Cpath d='M0 0v30h60V0z' fill='%23012169'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' clip-path='url(%23t)' stroke='%23C8102E' stroke-width='4'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/g%3E%3C/svg%3E") center / cover no-repeat;
}

.active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
  margin-left: 2px;
}
</style>
