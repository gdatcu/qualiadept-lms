import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ArticleInteractions from '../../.vitepress/theme/components/ArticleInteractions.vue'

// Mock vitepress useRoute
vi.mock('vitepress', () => ({
  useRoute: () => ({ path: '/ro/articles/ghid-selectoare-playwright' }),
  inBrowser: true
}))

// Mock Supabase service in unit tests to test component logic in isolation
vi.mock('../../.vitepress/theme/supabase.mjs', () => ({
  SUPABASE_CONFIG: { url: '', anonKey: '' },
  getSupabaseClient: () => null,
  getVisitorIdentifier: () => 'test-visitor',
  fetchReactions: vi.fn(async () => ({
    counts: { like: 3, heart: 2, rocket: 4, bulb: 1, fire: 2 },
    userReactions: []
  })),
  toggleReactionDb: vi.fn(async () => ({ active: true })),
  fetchComments: vi.fn(async () => null),
  postCommentDb: vi.fn(async () => null),
  updateCommentLikesDb: vi.fn(async () => null),
  deleteCommentDb: vi.fn(async () => null),
  subscribeToRealtime: vi.fn(() => null)
}))

describe('ArticleInteractions Component', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('mounts and displays default reaction buttons', async () => {
    const wrapper = mount(ArticleInteractions, {
      props: { articleId: 'test-article' }
    })
    await flushPromises()

    const buttons = wrapper.findAll('.reaction-btn')
    expect(buttons.length).toBe(5) // 👍 ❤️ 🚀 💡 🔥
  })

  it('increments reaction count and marks active when clicked', async () => {
    const wrapper = mount(ArticleInteractions, {
      props: { articleId: 'test-article' }
    })
    await flushPromises()

    const likeBtn = wrapper.find('.reaction-btn[aria-label="Apreciez"]')
    expect(likeBtn.exists()).toBe(true)

    const initialCount = parseInt(likeBtn.find('.count').text(), 10)
    await likeBtn.trigger('click')
    await flushPromises()

    expect(likeBtn.classes()).toContain('active')
    expect(parseInt(likeBtn.find('.count').text(), 10)).toBe(initialCount + 1)
  })

  it('decrements reaction count when unclicking an active reaction', async () => {
    const wrapper = mount(ArticleInteractions, {
      props: { articleId: 'test-article' }
    })
    await flushPromises()

    const likeBtn = wrapper.find('.reaction-btn[aria-label="Apreciez"]')
    await likeBtn.trigger('click') // activate
    await flushPromises()
    const activeCount = parseInt(likeBtn.find('.count').text(), 10)

    await likeBtn.trigger('click') // deactivate
    await flushPromises()
    expect(likeBtn.classes()).not.toContain('active')
    expect(parseInt(likeBtn.find('.count').text(), 10)).toBe(activeCount - 1)
  })

  it('submits a new comment and adds it to the list', async () => {
    const wrapper = mount(ArticleInteractions, {
      props: { articleId: 'test-article' }
    })
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('Un articol foarte util!')

    const nameInput = wrapper.find('.name-input')
    if (nameInput.exists()) {
      await nameInput.setValue('Test User')
    }

    const form = wrapper.find('form.comment-form')
    await form.trigger('submit.prevent')
    await flushPromises()

    const comments = wrapper.findAll('.comment-item')
    const commentTexts = wrapper.findAll('.comment-text').map(c => c.text())
    expect(commentTexts).toContain('Un articol foarte util!')
  })

  it('allows liking a comment', async () => {
    const wrapper = mount(ArticleInteractions, {
      props: { articleId: 'test-article' }
    })
    await flushPromises()

    // Add a comment first
    await wrapper.find('textarea').setValue('Great post!')
    await wrapper.find('form.comment-form').trigger('submit.prevent')
    await flushPromises()

    const likeBtn = wrapper.find('.comment-like-btn')
    expect(likeBtn.exists()).toBe(true)

    const initialLikes = parseInt(wrapper.find('.like-count').text(), 10)
    await likeBtn.trigger('click')
    await flushPromises()

    expect(likeBtn.classes()).toContain('liked')
    expect(parseInt(wrapper.find('.like-count').text(), 10)).toBe(initialLikes + 1)
  })

  it('persists reactions and comments across mounts via localStorage', async () => {
    const wrapper1 = mount(ArticleInteractions, {
      props: { articleId: 'persistent-test' }
    })
    await flushPromises()

    const textarea = wrapper1.find('textarea')
    await textarea.setValue('Persistent comment message')
    await wrapper1.find('form.comment-form').trigger('submit.prevent')
    await flushPromises()

    // Second instance should load from localStorage
    const wrapper2 = mount(ArticleInteractions, {
      props: { articleId: 'persistent-test' }
    })
    await flushPromises()

    const commentTexts = wrapper2.findAll('.comment-text').map(c => c.text())
    expect(commentTexts).toContain('Persistent comment message')
  })
})
