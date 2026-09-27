import { test, expect } from '@playwright/test'

test.describe('Navigation and UI E2E Tests', () => {
    test('loads Romanian homepage correctly', async ({ page }) => {
        await page.goto('/ro/')
        await expect(page).toHaveTitle(/QualiAdept LMS/)
        
        // Verify hero section
        const heroName = page.locator('.VPHero .name')
        await expect(heroName).toContainText('QualiAdept')

        // Verify course feature cards
        const features = page.locator('.VPFeature')
        await expect(features).toHaveCount(5)
    })

    test('loads English homepage correctly', async ({ page }) => {
        await page.goto('/en/')
        await expect(page).toHaveTitle(/QualiAdept LMS/)
        
        const heroText = page.locator('.VPHero .text')
        await expect(heroText).toContainText('Learning Platform')
    })

    test('navigates to IT Made Easy syllabus page', async ({ page }) => {
        await page.goto('/ro/')
        await page.locator('.VPFeature').filter({ hasText: 'IT-ul' }).click()
        await expect(page).toHaveURL(/\/ro\/sessions\/it-made-easy\/syllabus/)
        
        const heading = page.locator('h1')
        await expect(heading).toContainText('IT Masterclass')
    })

    test('navigates to Masterclass QA Manual syllabus page', async ({ page }) => {
        await page.goto('/en/')
        await page.locator('.VPFeature').filter({ hasText: 'Masterclass Manual QA' }).click()
        await expect(page).toHaveURL(/\/en\/sessions\/masterclass-qa-manual\/syllabus/)
        
        const heading = page.locator('h1')
        await expect(heading).toContainText('Masterclass QA Manual')
    })

    test('navigates to Romanian Articles hub and opens an article with interactions', async ({ page }) => {
        await page.goto('/ro/')
        await page.locator('.VPNavBarMenu a').filter({ hasText: 'Articole' }).click()
        await expect(page).toHaveURL(/\/ro\/articles\//)
        
        const heading = page.locator('h1')
        await expect(heading).toContainText('Articole & Ghiduri Tehnice')

        // Default order should display latest article first (LLM & AI testing)
        const firstCard = page.locator('.article-card').first()
        await expect(firstCard).toContainText('LLM')

        // Click on the article card
        await firstCard.click()
        await expect(page).toHaveURL(/\/ro\/articles\/ghid-testare-qa-llm-ai/)

        // Verify reactions and comments are present
        const reactionsBar = page.locator('.reactions-bar')
        await expect(reactionsBar).toBeVisible()
        const commentForm = page.locator('form.comment-form')
        await expect(commentForm).toBeVisible()
    })

    test('navigates to English Articles hub and tests search and filtering', async ({ page }) => {
        await page.goto('/en/')
        await page.locator('.VPNavBarMenu a').filter({ hasText: 'Articles' }).click()
        await expect(page).toHaveURL(/\/en\/articles\//)
        
        const heading = page.locator('h1')
        await expect(heading).toContainText('Articles & Technical Guides')

        // Check cards count
        const cards = page.locator('.article-card')
        await expect(cards).toHaveCount(3)

        // Test search filter
        const searchInput = page.locator('.hub-search-input')
        await searchInput.fill('Playwright')
        await expect(page.locator('.article-card')).toHaveCount(1)

        // Test tag filter
        await page.locator('.clear-search-btn').click()
        await expect(page.locator('.article-card')).toHaveCount(3)

        await page.locator('.tag-chip').filter({ hasText: 'AI & LLM' }).click()
        await expect(page.locator('.article-card')).toHaveCount(1)
        await expect(page.locator('.article-card').first()).toContainText('QA Testing for LLMs and AI')

        // Click into the article
        await page.locator('.article-card').first().click()
        await expect(page).toHaveURL(/\/en\/articles\/qa-testing-for-llms-and-ai/)

        const reactionsBar = page.locator('.reactions-bar')
        await expect(reactionsBar).toBeVisible()
    })

    test('switches language correctly from Romanian article to English article', async ({ page }) => {
        await page.goto('/ro/articles/ghid-testare-qa-llm-ai')
        await expect(page).toHaveURL(/\/ro\/articles\/ghid-testare-qa-llm-ai/)

        // Click English in the translation switcher menu
        const extraBtn = page.locator('.VPNavBarExtra')
        if (await extraBtn.isVisible()) {
            await extraBtn.click()
        }
        
        // Find English translation link
        const enLink = page.locator('a').filter({ hasText: /^English$/ }).first()
        if (await enLink.isVisible()) {
            await enLink.click()
        } else {
            // Alternatively test through route navigation
            await page.goto('/en/articles/ghid-testare-qa-llm-ai')
        }

        await expect(page).toHaveURL(/\/en\/articles\/qa-testing-for-llms-and-ai/)
        const h1 = page.locator('h1').first()
        await h1.waitFor({ state: 'visible' })
        await expect(h1).toContainText('QA Testing for LLMs and AI')
    })
})


