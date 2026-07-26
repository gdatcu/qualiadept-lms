import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { showToast } from '../../.vitepress/theme/utils.mjs'

describe('showToast Integration Test', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns null if targetDocument is null', () => {
        expect(showToast('Test', 'success', 3000, null)).toBeNull()
    })

    it('creates a toast element in the document body with correct styles', () => {
        const toast = showToast('Operational Warning', 'error', 3000, document)
        expect(toast).not.toBeNull()
        expect(document.body.contains(toast)).toBe(true)
        expect(toast.innerText).toBe('Operational Warning')
        expect(toast.style.backgroundColor).toBe('rgb(239, 68, 68)') // #ef4444
    })

    it('applies default background color for unknown or info type', () => {
        const toast = showToast('Info Msg', 'info', 3000, document)
        expect(toast.style.backgroundColor).toBe('rgb(107, 114, 128)') // #6b7280
    })

    it('fades out and removes the toast after specified timeout', () => {
        const toast = showToast('Auto Dismiss', 'success', 2000, document)
        expect(document.body.contains(toast)).toBe(true)

        // Advance timers past timeout
        vi.advanceTimersByTime(2000)
        expect(toast.style.opacity).toBe('0')

        // Advance past fade transition
        vi.advanceTimersByTime(500)
        expect(document.body.contains(toast)).toBe(false)
    })
})
