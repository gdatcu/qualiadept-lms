import { describe, it, expect } from 'vitest'
import { parseJwt } from '../../.vitepress/theme/utils.mjs'

describe('parseJwt', () => {
    it('returns null for null, undefined, or empty inputs', () => {
        expect(parseJwt(null)).toBeNull()
        expect(parseJwt(undefined)).toBeNull()
        expect(parseJwt('')).toBeNull()
        expect(parseJwt(123)).toBeNull()
    })

    it('returns null for malformed JWT strings without dots', () => {
        expect(parseJwt('invalidtokenstring')).toBeNull()
    })

    it('decodes a valid JWT payload correctly', () => {
        const payload = { sub: 'user_123', email: 'test@qualiadept.ro', user_properties: { cursuri_accesibile: { v: 'ts,qa' } } }
        const encodedPayload = btoa(JSON.stringify(payload))
        const token = `header.${encodedPayload}.signature`

        const result = parseJwt(token)
        expect(result).toEqual(payload)
        expect(result.email).toBe('test@qualiadept.ro')
    })

    it('returns null if the payload is not valid JSON', () => {
        const token = 'header.invalid_base64_json.signature'
        expect(parseJwt(token)).toBeNull()
    })
})
