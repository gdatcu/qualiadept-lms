import { test, expect } from '@playwright/test'

test.describe('Course Syllabus & PDF Link E2E Tests', () => {
    test('verifies PDF download button on IT Masterclass syllabus page', async ({ page }) => {
        await page.goto('/ro/sessions/it-made-easy/syllabus')
        
        const downloadBtn = page.locator('a.download-btn')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/it-made-easy/syllabus.pdf')
    })

    test('verifies session 1 rendering and PDF link for IT Masterclass', async ({ page }) => {
        await page.goto('/ro/sessions/it-made-easy/session-1')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 1: Procesorul (CPU)')

        const downloadBtn = page.locator('a.download-btn')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/it-made-easy/session-1.pdf')
    })

    test('verifies sidebar module navigation for IT Masterclass', async ({ page }) => {
        await page.goto('/ro/sessions/it-made-easy/syllabus')
        
        const sidebar = page.locator('.VPSidebar')
        await expect(sidebar).toBeVisible()
        await expect(sidebar).toContainText('Modulul 1: Hardware')
        await expect(sidebar).toContainText('Modulul 2: Logică Digitală')
        await expect(sidebar).toContainText('Modulul 3: De la Cod la Imagine')
        await expect(sidebar).toContainText('Modulul 4: Lumea Interconectată')
    })

    test('verifies session 1.2 rendering and PDF link for QA Masterclass', async ({ page }) => {
        await page.goto('/ro/sessions/masterclass-qa-manual/session-1-2')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 1.2: Cele 7 Principii ale Testării')

        const downloadBtn = page.locator('a.download-btn')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/masterclass-qa-manual/session-1-2.pdf')
    })
})

