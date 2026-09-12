import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Configuration for QualiAdept LMS
 * Enter your Supabase project URL and anon public key here:
 */
export const SUPABASE_CONFIG = {
  url: typeof window !== 'undefined' && window.__QUALIANDEPT_SUPABASE_URL__ 
    ? window.__QUALIANDEPT_SUPABASE_URL__ 
    : 'https://uibnmpubdszfpuydefkg.supabase.co',
  anonKey: typeof window !== 'undefined' && window.__QUALIANDEPT_SUPABASE_KEY__ 
    ? window.__QUALIANDEPT_SUPABASE_KEY__ 
    : 'sb_publishable_L1I0yDfBe71n8SFcA1mFkA_jAXSYY3U'
}

let supabaseInstance = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      supabaseInstance = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
      return supabaseInstance
    } catch (e) {
      console.warn('[Supabase] Client initialization failed, falling back to local storage:', e)
    }
  }
  return null
}

/**
 * Get or generate a persistent unique device/visitor identifier
 */
export function getVisitorIdentifier() {
  if (typeof window === 'undefined') return 'server-user'
  let id = localStorage.getItem('qualiadept_visitor_id')
  if (!id) {
    id = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    localStorage.setItem('qualiadept_visitor_id', id)
  }
  return id
}

/**
 * Fetch reactions summary and current user's reaction list
 */
export async function fetchReactions(articleId, userIdentifier = getVisitorIdentifier()) {
  const client = getSupabaseClient()
  if (!client) {
    // LocalStorage fallback
    const countsKey = `qualiadept_art_counts_${articleId}`
    const userKey = `qualiadept_art_user_reactions_${articleId}`
    const savedCounts = typeof window !== 'undefined' ? localStorage.getItem(countsKey) : null
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem(userKey) : null
    return {
      counts: savedCounts ? JSON.parse(savedCounts) : { like: 0, heart: 0, rocket: 0, bulb: 0, fire: 0 },
      userReactions: savedUser ? JSON.parse(savedUser) : []
    }
  }

  try {
    const { data, error } = await client
      .from('article_reactions')
      .select('reaction_id, user_identifier')
      .eq('article_id', articleId)

    if (error) throw error

    const counts = { like: 0, heart: 0, rocket: 0, bulb: 0, fire: 0 }
    const userReactions = []

    data.forEach(item => {
      counts[item.reaction_id] = (counts[item.reaction_id] || 0) + 1
      if (item.user_identifier === userIdentifier && !userReactions.includes(item.reaction_id)) {
        userReactions.push(item.reaction_id)
      }
    })

    return { counts, userReactions }
  } catch (err) {
    console.error('[Supabase] Error fetching reactions:', err)
    return { counts: {}, userReactions: [] }
  }
}

/**
 * Toggle a reaction in Supabase or LocalStorage
 */
export async function toggleReactionDb(articleId, reactionId, userIdentifier = getVisitorIdentifier()) {
  const client = getSupabaseClient()
  if (!client) return false

  try {
    const { data: existing } = await client
      .from('article_reactions')
      .select('id')
      .eq('article_id', articleId)
      .eq('reaction_id', reactionId)
      .eq('user_identifier', userIdentifier)
      .maybeSingle()

    if (existing) {
      // Remove reaction
      await client
        .from('article_reactions')
        .delete()
        .eq('id', existing.id)
      return { active: false }
    } else {
      // Add reaction
      await client
        .from('article_reactions')
        .insert([{
          article_id: articleId,
          reaction_id: reactionId,
          user_identifier: userIdentifier
        }])
      return { active: true }
    }
  } catch (err) {
    console.error('[Supabase] Error toggling reaction:', err)
    return null
  }
}

/**
 * Fetch all comments for an article
 */
export async function fetchComments(articleId) {
  const client = getSupabaseClient()
  if (!client) {
    const key = `qualiadept_art_comments_${articleId}`
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    return saved ? JSON.parse(saved) : null
  }

  try {
    const { data, error } = await client
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(row => ({
      id: row.id,
      author: row.author,
      authorEmail: row.author_email,
      text: row.text,
      isVerified: row.is_verified,
      likes: row.likes || 0,
      createdAt: row.created_at
    }))
  } catch (err) {
    console.error('[Supabase] Error fetching comments:', err)
    return null
  }
}

/**
 * Post a new comment
 */
export async function postCommentDb({ articleId, author, authorEmail, text, isVerified }) {
  const client = getSupabaseClient()
  if (!client) return null

  try {
    const { data, error } = await client
      .from('article_comments')
      .insert([{
        article_id: articleId,
        author,
        author_email: authorEmail || '',
        text,
        is_verified: isVerified || false,
        likes: 0
      }])
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      author: data.author,
      authorEmail: data.author_email,
      text: data.text,
      isVerified: data.is_verified,
      likes: data.likes,
      createdAt: data.created_at
    }
  } catch (err) {
    console.error('[Supabase] Error posting comment:', err)
    return null
  }
}

/**
 * Like a comment in Supabase
 */
export async function updateCommentLikesDb(commentId, newLikesCount) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client
      .from('article_comments')
      .update({ likes: newLikesCount })
      .eq('id', commentId)
  } catch (err) {
    console.error('[Supabase] Error updating comment likes:', err)
  }
}

/**
 * Delete comment
 */
export async function deleteCommentDb(commentId) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client
      .from('article_comments')
      .delete()
      .eq('id', commentId)
  } catch (err) {
    console.error('[Supabase] Error deleting comment:', err)
  }
}

/**
 * Setup Realtime channel subscription for instant live updates
 */
export function subscribeToRealtime(articleId, onUpdate) {
  const client = getSupabaseClient()
  if (!client) return null

  try {
    const channelId = `art_${articleId.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 7)}`
    const channel = client.channel(channelId)

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'article_reactions', filter: `article_id=eq.${articleId}` },
        () => onUpdate('reactions')
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'article_comments', filter: `article_id=eq.${articleId}` },
        () => onUpdate('comments')
      )

    channel.subscribe()
    return channel
  } catch (err) {
    console.error('[Supabase] Error subscribing to realtime:', err)
    return null
  }
}
