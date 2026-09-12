<template>
  <div class="article-interactions-container" v-if="mounted">
    <!-- Reactions Section -->
    <div class="reactions-wrapper">
      <h3 class="interactions-title">
        <span class="icon">✨</span>
        <span>{{ isEn ? 'React to this article' : 'Ce părere ai despre acest articol?' }}</span>
      </h3>
      <div class="reactions-bar">
        <button
          v-for="reaction in reactionsList"
          :key="reaction.id"
          class="reaction-btn"
          :class="{ active: userReactions.includes(reaction.id) }"
          @click="toggleReaction(reaction.id)"
          :title="isEn ? reaction.labelEn : reaction.labelRo"
          :aria-label="isEn ? reaction.labelEn : reaction.labelRo"
        >
          <span class="emoji">{{ reaction.emoji }}</span>
          <span class="count">{{ reactionCounts[reaction.id] || 0 }}</span>
        </button>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="comments-wrapper">
      <div class="comments-header">
        <h3 class="interactions-title">
          <span class="icon">💬</span>
          <span>{{ isEn ? 'Discussion' : 'Comentarii & Discuții' }} ({{ comments.length }})</span>
        </h3>
        <span v-if="user" class="user-active-badge">
          👤 {{ user.name || user.email }}
        </span>
      </div>

      <!-- Add Comment Form -->
      <form class="comment-form" @submit.prevent="submitComment">
        <div class="form-row" v-if="!user">
          <input
            v-model="guestName"
            type="text"
            class="comment-input name-input"
            :placeholder="isEn ? 'Your name (optional)' : 'Numele tău (opțional)'"
            maxlength="50"
          />
        </div>
        <div class="form-row">
          <textarea
            v-model="newCommentText"
            class="comment-input text-input"
            :placeholder="isEn ? 'Share your thoughts, ask a question, or leave feedback...' : 'Scrie un comentariu, pune o întrebare sau împărtășește feedback...'"
            rows="3"
            required
            maxlength="1000"
          ></textarea>
        </div>
        <div class="form-actions">
          <span class="char-counter">{{ 1000 - newCommentText.length }} {{ isEn ? 'chars left' : 'caractere rămase' }}</span>
          <button type="submit" class="comment-submit-btn" :disabled="!newCommentText.trim() || isSubmitting">
            <span>{{ isEn ? 'Post Comment' : 'Publică Comentariul' }}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>

      <!-- Comments List -->
      <div class="comments-list">
        <div v-if="comments.length === 0" class="empty-comments">
          <p>{{ isEn ? 'No comments yet. Be the first to share your thoughts!' : 'Încă nu există comentarii. Fii primul care lasă o impresie!' }}</p>
        </div>

        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          class="comment-item"
        >
          <div class="comment-avatar" :style="{ backgroundColor: getAvatarColor(comment.author) }">
            {{ (comment.author || 'A').charAt(0).toUpperCase() }}
          </div>
          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-author">{{ comment.author }}</span>
              <span v-if="comment.isVerified" class="verified-tag">✓ Student</span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              <button
                v-if="canDelete(comment)"
                class="delete-btn"
                @click="deleteComment(comment.id)"
                :title="isEn ? 'Delete comment' : 'Șterge comentariul'"
              >
                ✕
              </button>
            </div>
            <div class="comment-text">{{ comment.text }}</div>
            <div class="comment-actions">
              <button
                class="comment-like-btn"
                :class="{ liked: commentLikes.includes(comment.id) }"
                @click="toggleCommentLike(comment.id)"
              >
                ❤️ <span class="like-count">{{ comment.likes || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
  fetchReactions,
  toggleReactionDb,
  fetchComments,
  postCommentDb,
  updateCommentLikesDb,
  deleteCommentDb,
  subscribeToRealtime,
  getSupabaseClient
} from '../supabase.mjs'

const props = defineProps({
  articleId: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const mounted = ref(typeof window !== 'undefined')
const isSubmitting = ref(false)
const newCommentText = ref('')
const guestName = ref('')
const user = ref(null)
let realtimeChannel = null

const reactionsList = [
  { id: 'like', emoji: '👍', labelRo: 'Apreciez', labelEn: 'Like' },
  { id: 'heart', emoji: '❤️', labelRo: 'Ador', labelEn: 'Love' },
  { id: 'rocket', emoji: '🚀', labelRo: 'Inspirațional', labelEn: 'Insightful' },
  { id: 'bulb', emoji: '💡', labelRo: 'Util', labelEn: 'Helpful' },
  { id: 'fire', emoji: '🔥', labelRo: 'Top', labelEn: 'Fire' }
]

const currentArticleKey = computed(() => {
  if (props.articleId) return props.articleId
  if (typeof window !== 'undefined' && route?.path) {
    return route.path.replace(/\/$/, '')
  }
  return 'default-article'
})

const isEn = computed(() => {
  if (typeof window !== 'undefined' && route?.path) {
    return route.path.startsWith('/en/')
  }
  return false
})

const reactionCounts = ref({})
const userReactions = ref([])
const comments = ref([])
const commentLikes = ref([])

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const getStorageKey = (type) => `qualiadept_art_${type}_${currentArticleKey.value}`

const loadInteractions = async () => {
  if (typeof window === 'undefined') return

  try {
    // Detect user from session storage if logged in via Kinde
    const storedUser = sessionStorage.getItem('qualiadept_user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }

    // 1. Fetch Reactions (Supabase or LocalStorage)
    const reactionsData = await fetchReactions(currentArticleKey.value)
    if (reactionsData?.counts) {
      reactionCounts.value = reactionsData.counts
      userReactions.value = reactionsData.userReactions || []
    }

    // 2. Fetch Comments (Supabase or LocalStorage)
    const remoteComments = await fetchComments(currentArticleKey.value)
    if (remoteComments && remoteComments.length > 0) {
      comments.value = remoteComments
    } else {
      // Local fallback
      const savedComments = localStorage.getItem(getStorageKey('comments'))
      if (savedComments && JSON.parse(savedComments).length > 0) {
        comments.value = JSON.parse(savedComments)
      } else {
        comments.value = []
      }
    }

    // Load liked comment IDs from localStorage
    const savedCommentLikes = localStorage.getItem(getStorageKey('user_comment_likes'))
    commentLikes.value = savedCommentLikes ? JSON.parse(savedCommentLikes) : []
  } catch (e) {
    console.error('Error loading interactions:', e)
  }
}

if (typeof window !== 'undefined') {
  loadInteractions()
}

const saveLocalReactions = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey('counts'), JSON.stringify(reactionCounts.value))
  localStorage.setItem(getStorageKey('user_reactions'), JSON.stringify(userReactions.value))
}

const saveLocalComments = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey('comments'), JSON.stringify(comments.value))
}

const toggleReaction = async (reactionId) => {
  const counts = { ...reactionCounts.value }
  let userList = [...userReactions.value]

  // Optimistic UI update
  if (userList.includes(reactionId)) {
    userList = userList.filter(id => id !== reactionId)
    counts[reactionId] = Math.max(0, (counts[reactionId] || 1) - 1)
  } else {
    userList.push(reactionId)
    counts[reactionId] = (counts[reactionId] || 0) + 1
  }

  userReactions.value = userList
  reactionCounts.value = counts
  saveLocalReactions()

  // Sync with Supabase if configured
  await toggleReactionDb(currentArticleKey.value, reactionId)
}

const submitComment = async () => {
  const text = newCommentText.value.trim()
  if (!text) return

  isSubmitting.value = true
  const authorName = user.value?.name || user.value?.email || guestName.value.trim() || (isEn.value ? 'Anonymous Reader' : 'Cititor Anonim')
  const authorEmail = user.value?.email || ''
  const isVerified = !!user.value

  const payload = {
    articleId: currentArticleKey.value,
    author: authorName,
    authorEmail,
    text,
    isVerified
  }

  // Try Supabase insert
  const savedRemote = await postCommentDb(payload)

  const newComment = savedRemote || {
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    author: authorName,
    authorEmail,
    text,
    createdAt: new Date().toISOString(),
    isVerified,
    likes: 0
  }

  comments.value = [newComment, ...comments.value]
  saveLocalComments()
  newCommentText.value = ''
  isSubmitting.value = false
}

const toggleCommentLike = async (commentId) => {
  const target = comments.value.find(c => c.id === commentId)
  if (!target) return

  let likesList = [...commentLikes.value]
  if (likesList.includes(commentId)) {
    likesList = likesList.filter(id => id !== commentId)
    target.likes = Math.max(0, (target.likes || 1) - 1)
  } else {
    likesList.push(commentId)
    target.likes = (target.likes || 0) + 1
  }

  commentLikes.value = likesList
  localStorage.setItem(getStorageKey('user_comment_likes'), JSON.stringify(likesList))
  saveLocalComments()

  await updateCommentLikesDb(commentId, target.likes)
}

const canDelete = (comment) => {
  if (!user.value) return false
  return user.value.email && comment.authorEmail === user.value.email
}

const deleteComment = async (commentId) => {
  comments.value = comments.value.filter(c => c.id !== commentId)
  saveLocalComments()
  await deleteCommentDb(commentId)
}

const getAvatarColor = (name) => {
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#6366f1']
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString(isEn.value ? 'en-US' : 'ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return ''
  }
}

const handleStorageSync = (e) => {
  if (e.key && e.key.includes(currentArticleKey.value)) {
    loadInteractions()
  }
}

onMounted(() => {
  mounted.value = true
  loadInteractions()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageSync)
    realtimeChannel = subscribeToRealtime(currentArticleKey.value, () => {
      loadInteractions()
    })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', handleStorageSync)
    if (realtimeChannel && getSupabaseClient()) {
      getSupabaseClient().removeChannel(realtimeChannel)
    }
  }
})

watch(() => route?.path, () => {
  loadInteractions()
})
</script>
