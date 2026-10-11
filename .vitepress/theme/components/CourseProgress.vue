<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  getStoredProgressStats,
  exportProgressData,
  downloadProgressFile,
  importProgressData
} from '../challengeProgress.mjs'

const props = defineProps({
  total: { type: Number, default: 10 },
  lang: { type: String, default: '' }
})

const stats = ref({ completed: 0, total: props.total, percentage: 0 })
const showImportModal = ref(false)
const importJsonText = ref('')
const importStatus = ref('')
const fileInputRef = ref(null)

const isEn = computed(() => {
  if (props.lang) return props.lang === 'en'
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en/')
  }
  return false
})

function updateStats() {
  stats.value = getStoredProgressStats(props.total)
}

function handleExport() {
  downloadProgressFile()
}

function openImport() {
  importJsonText.value = ''
  importStatus.value = ''
  showImportModal.value = true
}

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const content = event.target?.result
      if (typeof content === 'string') {
        const ok = importProgressData(content)
        if (ok) {
          importStatus.value = 'success'
          updateStats()
          setTimeout(() => { showImportModal.value = false }, 1200)
        } else {
          importStatus.value = 'error'
        }
      }
    } catch (_) {
      importStatus.value = 'error'
    }
  }
  reader.readAsText(file)
}

function handleTextImport() {
  if (!importJsonText.value.trim()) return
  const ok = importProgressData(importJsonText.value.trim())
  if (ok) {
    importStatus.value = 'success'
    updateStats()
    setTimeout(() => { showImportModal.value = false }, 1200)
  } else {
    importStatus.value = 'error'
  }
}

onMounted(() => {
  updateStats()
  if (typeof window !== 'undefined') {
    window.addEventListener('qualiadept-progress-updated', updateStats)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('qualiadept-progress-updated', updateStats)
  }
})
</script>

<template>
  <div class="qa-progress-card">
    <div class="qa-progress-header">
      <div class="qa-progress-title-box">
        <span class="qa-progress-icon">📊</span>
        <div>
          <h4 class="qa-progress-title">
            {{ isEn ? 'Your Course Progress' : 'Progresul Tău în Curs' }}
          </h4>
          <p class="qa-progress-subtitle">
            {{ isEn 
              ? `${stats.completed} of ${stats.total} challenges completed (${stats.percentage}%)` 
              : `${stats.completed} din ${stats.total} provocări finalizate (${stats.percentage}%)` 
            }}
          </p>
        </div>
      </div>

      <div class="qa-progress-actions">
        <button
          type="button"
          class="qa-backup-btn"
          @click="handleExport"
          :title="isEn ? 'Download a backup file of all your code and progress' : 'Descarcă o copie de rezervă cu tot codul și progresul tău'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{{ isEn ? 'Export Progress' : 'Exportă Progresul' }}</span>
        </button>

        <button
          type="button"
          class="qa-backup-btn"
          @click="openImport"
          :title="isEn ? 'Restore your progress and code on this device' : 'Restaurează progresul și codul pe acest dispozitiv'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{{ isEn ? 'Import Progress' : 'Importă Progresul' }}</span>
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="qa-bar-wrapper">
      <div class="qa-bar-track">
        <div 
          class="qa-bar-fill" 
          :style="{ width: `${stats.percentage}%` }"
          :class="{ 'is-complete': stats.percentage === 100 }"
        ></div>
      </div>
      <span class="qa-bar-label">{{ stats.percentage }}%</span>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="qa-modal-backdrop" @click.self="showImportModal = false">
      <div class="qa-modal-box">
        <div class="qa-modal-header">
          <h3>{{ isEn ? 'Restore Course Progress' : 'Restaurare Progres Curs' }}</h3>
          <button type="button" class="qa-modal-close" @click="showImportModal = false">&times;</button>
        </div>
        <div class="qa-modal-body">
          <p class="qa-modal-desc">
            {{ isEn 
              ? 'Upload your exported JSON progress file or paste its content below to restore your completed challenges and saved code.' 
              : 'Încarcă fișierul JSON exportat sau lipește conținutul mai jos pentru a-ți restaura provocările finalizate și codul salvat.' 
            }}
          </p>

          <div class="qa-upload-zone" @click="fileInputRef?.click()">
            <input 
              ref="fileInputRef" 
              type="file" 
              accept=".json" 
              style="display: none" 
              @change="handleFileUpload" 
            />
            <span class="qa-upload-icon">📁</span>
            <span>{{ isEn ? 'Click to select JSON file' : 'Apasă pentru a alege fișierul JSON' }}</span>
          </div>

          <div class="qa-modal-divider">
            <span>{{ isEn ? 'OR PASTE JSON' : 'SAU LIPEȘTE JSON' }}</span>
          </div>

          <textarea
            v-model="importJsonText"
            class="qa-import-textarea"
            rows="4"
            :placeholder="isEn ? 'Paste JSON data here...' : 'Lipește datele JSON aici...'"
          ></textarea>

          <div v-if="importStatus === 'success'" class="qa-alert qa-alert-success">
            ✓ {{ isEn ? 'Progress imported successfully! All challenges updated.' : 'Progresul a fost importat cu succes! Provocările au fost actualizate.' }}
          </div>
          <div v-if="importStatus === 'error'" class="qa-alert qa-alert-error">
            ⚠️ {{ isEn ? 'Invalid JSON format. Please select a valid backup file.' : 'Format JSON invalid. Te rugăm să verifici fișierul.' }}
          </div>
        </div>

        <div class="qa-modal-footer">
          <button type="button" class="qa-modal-btn" @click="showImportModal = false">
            {{ isEn ? 'Cancel' : 'Anulează' }}
          </button>
          <button 
            type="button" 
            class="qa-modal-btn qa-btn-primary" 
            @click="handleTextImport"
            :disabled="!importJsonText.trim()"
          >
            {{ isEn ? 'Apply & Restore' : 'Aplică & Restaurează' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-progress-card {
  margin: 1.5rem 0 2rem 0;
  padding: 18px 20px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.qa-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
}

.qa-progress-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qa-progress-icon {
  font-size: 26px;
  line-height: 1;
}

.qa-progress-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.qa-progress-subtitle {
  margin: 2px 0 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.qa-progress-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.qa-backup-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.qa-backup-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}

.qa-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qa-bar-track {
  flex: 1;
  height: 8px;
  background: var(--vp-c-bg-mute);
  border-radius: 999px;
  overflow: hidden;
}

.qa-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.qa-bar-fill.is-complete {
  background: linear-gradient(90deg, #10b981, #3b82f6);
}

.qa-bar-label {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
  min-width: 38px;
  text-align: right;
}

/* Modal styles */
.qa-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.qa-modal-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.qa-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.qa-modal-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.qa-modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.qa-modal-close:hover {
  color: var(--vp-c-text-1);
}

.qa-modal-body {
  padding: 20px;
}

.qa-modal-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.qa-upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  background: var(--vp-c-bg-alt);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  transition: all 0.2s ease;
}

.qa-upload-zone:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}

.qa-upload-icon {
  font-size: 20px;
}

.qa-modal-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 700;
}

.qa-modal-divider::before,
.qa-modal-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.qa-modal-divider span {
  padding: 0 10px;
}

.qa-import-textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.qa-alert {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.qa-alert-success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.qa-alert-error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.qa-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.qa-modal-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.qa-modal-btn:hover {
  background: var(--vp-c-bg-mute);
}

.qa-btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.qa-btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.qa-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
