import { describe, it, expect, beforeEach } from 'vitest'
import { updateAuthUI } from '../../.vitepress/theme/utils.mjs'

describe('updateAuthUI Integration Test', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="VPNavBarMenu"></div>
            <a href="/ro/auth" class="auth-link">Autentificare</a>
            <a href="/ro/sessions/premium/curs-ts" class="premium-link">TS Premium</a>
            <a href="/ro/sessions/premium/syllabus" class="syllabus-link">Syllabus</a>
            <a href="/ro/sessions/premium/session-1" class="session-link">Session 1</a>
        `
    })

    it('handles null document safely', () => {
        expect(() => updateAuthUI({ isAuth: false, doc: null })).not.toThrow()
    })

    it('updates auth link text for Romanian unauthenticated user', () => {
        updateAuthUI({ isAuth: false, pathname: '/ro/', doc: document })
        const link = document.querySelector('a[href*="/auth"]')
        expect(link.innerText).toBe('Autentificare')
    })

    it('updates auth link text for Romanian authenticated user', () => {
        updateAuthUI({ isAuth: true, pathname: '/ro/', doc: document })
        const link = document.querySelector('a[href*="/auth"]')
        expect(link.innerText).toBe('Deconectare')
    })

    it('updates auth link text for English unauthenticated user', () => {
        updateAuthUI({ isAuth: false, pathname: '/en/', doc: document })
        const link = document.querySelector('a[href*="/auth"]')
        expect(link.innerText).toBe('Login')
    })

    it('updates auth link text for English authenticated user', () => {
        updateAuthUI({ isAuth: true, pathname: '/en/', doc: document })
        const link = document.querySelector('a[href*="/auth"]')
        expect(link.innerText).toBe('Logout')
    })

    it('injects user badge element when authenticated', () => {
        updateAuthUI({ isAuth: true, user: { email: 'alex@qualiadept.ro' }, doc: document })
        const badge = document.getElementById('user-badge')
        expect(badge).not.toBeNull()
        expect(badge.innerText).toBe('alex@qualiadept.ro')
    })

    it('uses fallback text "Student" if user has no email', () => {
        updateAuthUI({ isAuth: true, user: null, doc: document })
        const badge = document.getElementById('user-badge')
        expect(badge).not.toBeNull()
        expect(badge.innerText).toBe('Student')
    })

    it('styles premium course links correctly based on user permissions', () => {
        updateAuthUI({ isAuth: true, cursuriPermise: 'ts', doc: document })
        const premiumLink = document.querySelector('.premium-link')
        const syllabusLink = document.querySelector('.syllabus-link')
        const sessionLink = document.querySelector('.session-link')
        expect(premiumLink.style.opacity).toBe('1')
        expect(premiumLink.style.fontWeight).toBe('bold')
        expect(syllabusLink.style.opacity).toBe('1')
        expect(syllabusLink.style.fontWeight).toBe('bold')
        expect(sessionLink.style.opacity).toBe('1')
        expect(sessionLink.style.fontWeight).toBe('bold')
    })

    it('dimmed opacity for users without premium course permissions', () => {
        updateAuthUI({ isAuth: true, cursuriPermise: 'qa', doc: document })
        const premiumLink = document.querySelector('.premium-link')
        const syllabusLink = document.querySelector('.syllabus-link')
        const sessionLink = document.querySelector('.session-link')
        expect(premiumLink.style.opacity).toBe('0.5')
        expect(syllabusLink.style.opacity).toBe('0.5')
        expect(sessionLink.style.opacity).toBe('0.5')
    })
})
