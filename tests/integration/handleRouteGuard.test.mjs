import { describe, it, expect, vi } from 'vitest'
import { handleRouteGuard } from '../../.vitepress/theme/utils.mjs'

describe('handleRouteGuard Integration Test', () => {
    it('redirects unauthenticated user to login when accessing auth route', async () => {
        const mockKinde = { login: vi.fn(), logout: vi.fn() }
        const result = await handleRouteGuard({
            to: '/ro/auth',
            isAuth: false,
            kindeClient: mockKinde
        })
        expect(result).toBe(false)
        expect(mockKinde.login).toHaveBeenCalled()
    })

    it('triggers logout for authenticated user when accessing auth route', async () => {
        const mockKinde = { login: vi.fn(), logout: vi.fn() }
        const result = await handleRouteGuard({
            to: '/ro/auth',
            isAuth: true,
            kindeClient: mockKinde
        })
        expect(result).toBe(false)
        expect(mockKinde.logout).toHaveBeenCalled()
    })

    it('redirects unauthenticated user trying to access premium routes', async () => {
        const mockKinde = { login: vi.fn() }
        const result = await handleRouteGuard({
            to: '/ro/sessions/premium/typescript-playwright/syllabus',
            isAuth: false,
            kindeClient: mockKinde
        })
        expect(result).toBe(false)
        expect(mockKinde.login).toHaveBeenCalled()
    })

    it('blocks access and displays error toast if user has no course permission for typescript-playwright', async () => {
        const mockToast = vi.fn()
        const result = await handleRouteGuard({
            to: '/ro/sessions/premium/typescript-playwright/syllabus',
            isAuth: true,
            cursuriPermise: 'qa_manual',
            pathname: '/ro/',
            showToastFn: mockToast
        })
        expect(result).toBe(false)
        expect(mockToast).toHaveBeenCalledWith('Acces Interzis! Nu ai achiziționat acest modul.', 'error')
    })

    it('blocks access to other premium files like session-1 if user has no permission', async () => {
        const mockToast = vi.fn()
        const result = await handleRouteGuard({
            to: '/ro/sessions/premium/typescript-playwright/session-1',
            isAuth: true,
            cursuriPermise: 'qa_manual',
            pathname: '/ro/',
            showToastFn: mockToast
        })
        expect(result).toBe(false)
        expect(mockToast).toHaveBeenCalledWith('Acces Interzis! Nu ai achiziționat acest modul.', 'error')
    })

    it('blocks access and displays English error toast when under /en/ route', async () => {
        const mockToast = vi.fn()
        const result = await handleRouteGuard({
            to: '/en/sessions/premium/typescript-playwright/syllabus',
            isAuth: true,
            cursuriPermise: 'qa_manual',
            pathname: '/en/',
            showToastFn: mockToast
        })
        expect(result).toBe(false)
        expect(mockToast).toHaveBeenCalledWith('Access Denied! Module not purchased.', 'error')
    })

    it('blocks access to English premium session-1 if user has no permission', async () => {
        const mockToast = vi.fn()
        const result = await handleRouteGuard({
            to: '/en/sessions/premium/typescript-playwright/session-1',
            isAuth: true,
            cursuriPermise: 'qa_manual',
            pathname: '/en/',
            showToastFn: mockToast
        })
        expect(result).toBe(false)
        expect(mockToast).toHaveBeenCalledWith('Access Denied! Module not purchased.', 'error')
    })

    it('allows access to premium route if user has ts permission', async () => {
        const result = await handleRouteGuard({
            to: '/ro/sessions/premium/typescript-playwright/syllabus',
            isAuth: true,
            cursuriPermise: 'ts,qa_manual',
            pathname: '/ro/'
        })
        expect(result).toBe(true)
    })

    it('allows access to other premium pages (syllabus, session-1) if user has ts permission', async () => {
        const resultSyllabus = await handleRouteGuard({
            to: '/ro/sessions/premium/typescript-playwright/syllabus',
            isAuth: true,
            cursuriPermise: 'ts,qa_manual',
            pathname: '/ro/'
        })
        const resultSession1 = await handleRouteGuard({
            to: '/en/sessions/premium/typescript-playwright/session-1',
            isAuth: true,
            cursuriPermise: 'ts,qa_manual',
            pathname: '/en/'
        })
        expect(resultSyllabus).toBe(true)
        expect(resultSession1).toBe(true)
    })

    it('allows access to standard non-restricted routes', async () => {
        const result = await handleRouteGuard({
            to: '/ro/sessions/it-made-easy/session-1',
            isAuth: false,
            pathname: '/ro/'
        })
        expect(result).toBe(true)
    })
})
