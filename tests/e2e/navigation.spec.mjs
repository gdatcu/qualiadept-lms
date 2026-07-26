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
})
