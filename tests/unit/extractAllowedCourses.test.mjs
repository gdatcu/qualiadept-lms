import { describe, it, expect } from 'vitest'
import { extractAllowedCourses } from '../../.vitepress/theme/utils.mjs'

describe('extractAllowedCourses', () => {
    it('returns empty string when decoded payload is missing or invalid', () => {
        expect(extractAllowedCourses(null)).toBe('')
        expect(extractAllowedCourses(undefined)).toBe('')
        expect(extractAllowedCourses({})).toBe('')
        expect(extractAllowedCourses({ user_properties: null })).toBe('')
    })

    it('extracts course permissions when provided as an object with property .v', () => {
        const decoded = {
            user_properties: {
                cursuri_accesibile: { v: 'TS,QA_MANUAL' }
            }
        }
        expect(extractAllowedCourses(decoded)).toBe('ts,qa_manual')
    })

    it('extracts course permissions when provided as a plain string', () => {
        const decoded = {
            user_properties: {
                cursuri_accesibile: 'TS_PREMIUM'
            }
        }
        expect(extractAllowedCourses(decoded)).toBe('ts_premium')
    })

    it('returns empty string if cursuri_accesibile is missing', () => {
        const decoded = { user_properties: { other_prop: 'val' } }
        expect(extractAllowedCourses(decoded)).toBe('')
    })
})
