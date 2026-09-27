import { describe, it, expect } from 'vitest'
import { normalizePath, getMappedArticleRoute, updateTranslationLinks, ARTICLE_LOCALE_MAP } from '../../.vitepress/theme/utils.mjs'

describe('Article Route Mapping & Translation Switcher Utilities', () => {
    it('normalizes paths properly', () => {
        expect(normalizePath('/ro/articles/ghid-testare-qa-llm-ai.html')).toBe('/ro/articles/ghid-testare-qa-llm-ai')
        expect(normalizePath('/en/articles/qa-testing-for-llms-and-ai/')).toBe('/en/articles/qa-testing-for-llms-and-ai')
        expect(normalizePath('/ro/articles/cnp-din-perspectiva-qa.html?tab=1#sec')).toBe('/ro/articles/cnp-din-perspectiva-qa')
        expect(normalizePath('')).toBe('')
        expect(normalizePath(null)).toBe('')
    })

    it('returns proper mapped article routes in both directions via ARTICLE_LOCALE_MAP', () => {
        expect(ARTICLE_LOCALE_MAP['/ro/articles/ghid-testare-qa-llm-ai']).toBe('/en/articles/qa-testing-for-llms-and-ai')
        expect(ARTICLE_LOCALE_MAP['/en/articles/qa-testing-for-llms-and-ai']).toBe('/ro/articles/ghid-testare-qa-llm-ai')
        
        expect(ARTICLE_LOCALE_MAP['/ro/articles/cnp-din-perspectiva-qa']).toBe('/en/articles/romanian-cnp-qa-perspective')
        expect(ARTICLE_LOCALE_MAP['/en/articles/romanian-cnp-qa-perspective']).toBe('/ro/articles/cnp-din-perspectiva-qa')

        expect(ARTICLE_LOCALE_MAP['/ro/articles/ghid-selectoare-playwright']).toBe('/en/articles/playwright-selector-guide')
        expect(ARTICLE_LOCALE_MAP['/en/articles/playwright-selector-guide']).toBe('/ro/articles/ghid-selectoare-playwright')
    })

    it('handles naive language switch paths and language switching', () => {
        // When switcher blindly changes /ro/ to /en/
        expect(getMappedArticleRoute('/en/articles/ghid-testare-qa-llm-ai')).toBe('/en/articles/qa-testing-for-llms-and-ai')
        expect(getMappedArticleRoute('/ro/articles/qa-testing-for-llms-and-ai')).toBe('/ro/articles/ghid-testare-qa-llm-ai')

        // Valid routes return null from getMappedArticleRoute (no redirect needed)
        expect(getMappedArticleRoute('/ro/articles/ghid-testare-qa-llm-ai')).toBeNull()
        expect(getMappedArticleRoute('/en/articles/qa-testing-for-llms-and-ai')).toBeNull()
    })

    it('updates translation switcher DOM links correctly', () => {
        document.body.innerHTML = `
            <div class="VPNavBarTranslations">
                <a href="/en/articles/ghid-testare-qa-llm-ai.html">English</a>
            </div>
        `
        updateTranslationLinks({
            pathname: '/ro/articles/ghid-testare-qa-llm-ai.html',
            doc: document
        })

        const link = document.querySelector('.VPNavBarTranslations a')
        expect(link.getAttribute('href')).toBe('/en/articles/qa-testing-for-llms-and-ai')
    })
})
