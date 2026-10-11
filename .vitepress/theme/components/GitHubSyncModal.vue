<template>
  <div v-if="isOpen" class="gh-modal-backdrop" @click.self="close">
    <div class="gh-modal-card">
      <!-- Modal Header -->
      <div class="gh-modal-header">
        <div class="gh-header-title">
          <span class="gh-logo">🐙</span>
          <div>
            <h3>{{ isEn ? 'GitHub Portfolio & Sync' : 'Portofoliu GitHub & Sincronizare' }}</h3>
            <p class="gh-subtitle">
              {{ isEn 
                ? '1-Click automatic showcase portfolio & cross-device backup' 
                : 'Portofoliu automat de cod & salvare cross-device (1-Click)' 
              }}
            </p>
          </div>
        </div>
        <button class="gh-close-btn" @click="close" aria-label="Close modal">&times;</button>
      </div>

      <!-- Body: Connected State -->
      <div v-if="user" class="gh-modal-body">
        <div class="gh-connected-profile">
          <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.username" class="gh-avatar" />
          <div class="gh-user-meta">
            <div class="gh-user-name">{{ user.name || user.username }}</div>
            <a :href="user.repoUrl" target="_blank" rel="noopener noreferrer" class="gh-repo-link">
              github.com/{{ user.username }}/qualiadept-python-automation ↗
            </a>
          </div>
          <span class="gh-status-badge">✓ {{ isEn ? 'Connected' : 'Conectat' }}</span>
        </div>

        <div class="gh-feature-box">
          <div class="gh-feature-item">
            <span class="gh-feature-icon">🚀</span>
            <div>
              <strong>{{ isEn ? 'Automatic Portfolio Commits' : 'Commit-uri automate în Portofoliu' }}</strong>
              <p>{{ isEn ? 'Every passed test challenge is automatically formatted and committed to your public repo with docstrings and passing badges.' : 'Fiecare provocare rezolvată este formatată și trimisă automat pe GitHub-ul tău cu docstring-uri și insigne de testare.' }}</p>
            </div>
          </div>
          <div class="gh-feature-item">
            <span class="gh-feature-icon">🔄</span>
            <div>
              <strong>{{ isEn ? 'Cross-Device Restore' : 'Restaurare între Dispozitive' }}</strong>
              <p>{{ isEn ? 'Switching laptops? Restore your saved solutions and challenge progress with a single click.' : 'Schimbi laptopul? Restaurează-ți soluțiile și progresul din curs cu un singur click.' }}</p>
            </div>
          </div>
        </div>

        <div v-if="statusMsg" class="gh-alert" :class="statusType">
          {{ statusMsg }}
        </div>

        <div class="gh-actions-row">
          <button 
            class="gh-btn gh-btn-restore" 
            @click="handleRestore" 
            :disabled="isLoading"
          >
            <span>🔄 {{ isLoading ? (isEn ? 'Restoring...' : 'Se restaurează...') : (isEn ? 'Restore Progress on this Device' : 'Restaurează Progresul pe acest Dispozitiv') }}</span>
          </button>
          <button class="gh-btn gh-btn-disconnect" @click="handleDisconnect" :disabled="isLoading">
            {{ isEn ? 'Disconnect' : 'Deconectează' }}
          </button>
        </div>
      </div>

      <!-- Body: Disconnected State (1-Click Connect) -->
      <div v-else class="gh-modal-body">
        <div class="gh-intro-box">
          <h4>{{ isEn ? 'Build your QA Portfolio while you learn' : 'Construiește-ți Portofoliul de QA în timp ce înveți' }}</h4>
          <p>
            {{ isEn
              ? 'Connect your GitHub account in 1 click. QualiAdept LMS will create a dedicated showcase repository on your profile and automatically commit your code when tests pass.'
              : 'Conectează contul de GitHub printr-un singur click. QualiAdept LMS va crea un repository pe profilul tău și va salva automat codul și aserțiunile validate.'
            }}
          </p>
          
          <ul class="gh-benefits-list">
            <li>✨ <strong>{{ isEn ? 'Interview-Ready:' : 'Pregătit pentru interviuri:' }}</strong> {{ isEn ? 'Shareable link for your CV and LinkedIn with a professional README.' : 'Link direct de pus în CV și pe LinkedIn cu un README spectaculos.' }}</li>
            <li>☁️ <strong>{{ isEn ? 'Never lose code:' : 'Nu pierzi niciun cod:' }}</strong> {{ isEn ? 'Accessible on any device, phone, or browser.' : 'Accesibil pe orice laptop, telefon sau browser.' }}</li>
            <li>⚡ <strong>{{ isEn ? '100% Automated:' : '100% Automat:' }}</strong> {{ isEn ? 'No terminal or git commands required.' : 'Fără comenzi de terminal sau configurare manuală.' }}</li>
          </ul>
        </div>

        <div v-if="statusMsg" class="gh-alert" :class="statusType">
          {{ statusMsg }}
        </div>

        <button 
          class="gh-btn gh-btn-connect" 
          @click="handleConnect" 
          :disabled="isLoading"
        >
          <svg class="gh-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>{{ isLoading ? (isEn ? 'Redirecting to GitHub...' : 'Se redirecționează către GitHub...') : (isEn ? 'Connect with GitHub (1-Click)' : 'Conectează-te cu GitHub (1-Click)') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  getCachedGitHubUser, 
  signInWithGitHub, 
  signOutGitHub, 
  restoreProgressFromGitHub,
  initializeGitHubSession 
} from '../githubPortfolio.mjs'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  lang: { type: String, default: 'ro' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEn = computed(() => {
  if (props.lang) return props.lang === 'en'
  if (typeof window !== 'undefined') return window.location.pathname.startsWith('/en/')
  return false
})

const user = ref(null)
const isLoading = ref(false)
const statusMsg = ref('')
const statusType = ref('info')

function close() {
  isOpen.value = false
  statusMsg.value = ''
}

async function handleConnect() {
  isLoading.value = true
  statusMsg.value = ''
  const res = await signInWithGitHub()
  if (res?.error) {
    statusType.value = 'error'
    statusMsg.value = res.error
    isLoading.value = false
  }
}

async function handleDisconnect() {
  await signOutGitHub()
  user.value = null
  statusType.value = 'info'
  statusMsg.value = isEn.value ? 'Disconnected from GitHub.' : 'Deconectat de la GitHub.'
}

async function handleRestore() {
  isLoading.value = true
  statusMsg.value = ''
  try {
    const res = await restoreProgressFromGitHub()
    if (res.error) {
      statusType.value = 'error'
      statusMsg.value = res.error
    } else {
      statusType.value = 'success'
      statusMsg.value = isEn.value 
        ? `Successfully restored ${res.restored} challenge solutions from GitHub!`
        : `Au fost restaurate cu succes ${res.restored} soluții de provocări din GitHub!`
    }
  } catch (err) {
    statusType.value = 'error'
    statusMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}

function updateUserState() {
  user.value = getCachedGitHubUser()
}

function handleAuthChanged(e) {
  user.value = e.detail
}

onMounted(async () => {
  await initializeGitHubSession()
  updateUserState()
  if (typeof window !== 'undefined') {
    window.addEventListener('qualiadept-github-auth-changed', handleAuthChanged)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('qualiadept-github-auth-changed', handleAuthChanged)
  }
})
</script>

<style scoped>
.gh-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gh-modal-card {
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 16px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.gh-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gh-logo {
  font-size: 1.8rem;
}

.gh-header-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
  line-height: 1.2;
}

.gh-subtitle {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #64748b);
}

.gh-close-btn {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--vp-c-text-2, #64748b);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.15s;
}

.gh-close-btn:hover {
  background: var(--vp-c-bg-mute, #f1f5f9);
  color: var(--vp-c-text-1, #0f172a);
}

.gh-modal-body {
  padding: 24px;
}

.gh-intro-box h4 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #0f172a);
}

.gh-intro-box p {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2, #475569);
  line-height: 1.5;
}

.gh-benefits-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gh-benefits-list li {
  font-size: 0.9rem;
  color: var(--vp-c-text-1, #1e293b);
  line-height: 1.4;
}

.gh-connected-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--vp-c-bg-mute, #f8fafc);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 12px;
  margin-bottom: 20px;
}

.gh-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #10b981;
}

.gh-user-meta {
  flex: 1;
  min-width: 0;
}

.gh-user-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #0f172a);
}

.gh-repo-link {
  display: block;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1, #4f46e5);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.gh-repo-link:hover {
  text-decoration: underline;
}

.gh-status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 9999px;
  white-space: nowrap;
}

.gh-feature-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.gh-feature-item {
  display: flex;
  gap: 12px;
  font-size: 0.88rem;
  line-height: 1.4;
  color: var(--vp-c-text-2, #475569);
}

.gh-feature-item strong {
  display: block;
  color: var(--vp-c-text-1, #0f172a);
  margin-bottom: 2px;
}

.gh-feature-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.gh-alert {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 16px;
  line-height: 1.4;
}

.gh-alert.success {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.gh-alert.error {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.gh-alert.info {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.gh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
}

.gh-btn-connect {
  width: 100%;
  padding: 14px 20px;
  font-size: 1rem;
  background: #24292f;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.gh-btn-connect:hover:not(:disabled) {
  background: #0f1419;
  transform: translateY(-1px);
}

.gh-actions-row {
  display: flex;
  gap: 10px;
}

.gh-btn-restore {
  flex: 1;
  padding: 12px 16px;
  font-size: 0.9rem;
  background: var(--vp-c-brand-1, #4f46e5);
  color: #ffffff;
}

.gh-btn-restore:hover:not(:disabled) {
  filter: brightness(1.1);
}

.gh-btn-disconnect {
  padding: 12px 16px;
  font-size: 0.9rem;
  background: transparent;
  color: var(--vp-c-text-2, #64748b);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-btn-disconnect:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.gh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
