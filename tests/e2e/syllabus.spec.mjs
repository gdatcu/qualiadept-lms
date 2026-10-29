import { test, expect } from '@playwright/test'

test.describe('Course Syllabus & PDF Link E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('e2e_mock_auth', 'true');
        });
    });

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

    test('verifies session 3 rendering and PDF link for QA Masterclass', async ({ page }) => {
        await page.goto('/ro/sessions/masterclass-qa-manual/session-3')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 3: Testarea Statică')

        const downloadBtn = page.locator('a.download-btn')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/masterclass-qa-manual/session-3.pdf')
    })

    test('verifies session 2 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/ro/sessions/premium/typescript-playwright/session-2')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 2: CSS modern și selectoare DOM')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-2.pdf')
    })

    test('verifies English session 2 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/en/sessions/premium/typescript-playwright/session-2')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 2: Modern CSS and DOM Selectors')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-2-en.pdf')
    })

    test('verifies session 3 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/ro/sessions/premium/typescript-playwright/session-3')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 3: JavaScript pentru QA Automation')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-3.pdf')
    })

    test('verifies English session 3 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/en/sessions/premium/typescript-playwright/session-3')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 3: JavaScript for QA Automation')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-3-en.pdf')
    })

    test('verifies session 4 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/ro/sessions/premium/typescript-playwright/session-4')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 4: Manipularea DOM-ului')

        const downloadBtn = page.locator('a.download-btn[href*="session-4.pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-4.pdf')

        const extraDownloadBtn = page.locator('a.download-btn[href*="session-4-extra.pdf"]').first()
        await expect(extraDownloadBtn).toBeVisible()
        await expect(extraDownloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-4-extra.pdf')

        const youtubeLink = page.locator('a.download-btn[href*="youtube.com"]')
        await expect(youtubeLink).toBeVisible()
        await expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/live/-VAbQMv1V24')

        const youtubeIframe = page.locator('iframe[src*="youtube.com/embed/-VAbQMv1V24"]')
        await expect(youtubeIframe).toBeVisible()
    })

    test('verifies English session 4 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/en/sessions/premium/typescript-playwright/session-4')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 4: DOM Manipulation with JavaScript')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-4-en.pdf')

        const youtubeLink = page.locator('a.download-btn[href*="youtube.com"]')
        await expect(youtubeLink).toBeVisible()
        await expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/live/-VAbQMv1V24')

        const youtubeIframe = page.locator('iframe[src*="youtube.com/embed/-VAbQMv1V24"]')
        await expect(youtubeIframe).toBeVisible()
    })

    test('verifies session 5 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/ro/sessions/premium/typescript-playwright/session-5')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 5: JavaScript Asincron')

        const downloadBtn = page.locator('a.download-btn[href*="session-5.pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-5.pdf')

        const youtubeLink = page.locator('a.download-btn[href*="youtube.com/live/vY5RGbZ0E7o"]')
        await expect(youtubeLink).toBeVisible()

        const youtubeIframe = page.locator('iframe[src*="youtube.com/embed/vY5RGbZ0E7o"]')
        await expect(youtubeIframe).toBeVisible()

        const iframe = page.locator('iframe[src*="docs.google.com/presentation"]')
        await expect(iframe).toBeVisible()
    })

    test('verifies English session 5 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/en/sessions/premium/typescript-playwright/session-5')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 5: Asynchronous JavaScript')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-5-en.pdf')
    })

    test('verifies session 6 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/ro/sessions/premium/typescript-playwright/session-6')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 6: Workshop Practic')

        const downloadBtn = page.locator('a.download-btn[href*="session-6.pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-6.pdf')
    })

    test('verifies English session 6 rendering and PDF link for TypeScript & Playwright', async ({ page }) => {
        await page.goto('/en/sessions/premium/typescript-playwright/session-6')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 6: Practical Workshop')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/premium/typescript-playwright/session-6-en.pdf')
    })

    test('verifies session 3 rendering and PDF link for IT Made Easy', async ({ page }) => {
        await page.goto('/ro/sessions/it-made-easy/session-3')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Sesiunea 3: Universul Binar și Porțile Logice')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/it-made-easy/session-3.pdf')
    })

    test('verifies English session 3 rendering and PDF link for IT Made Easy', async ({ page }) => {
        await page.goto('/en/sessions/it-made-easy/session-3')
        
        const h1 = page.locator('h1')
        await expect(h1).toContainText('Session 3: The Binary Universe and Logic Gates')

        const downloadBtn = page.locator('a.download-btn[href*=".pdf"]')
        await expect(downloadBtn).toBeVisible()
        await expect(downloadBtn).toHaveAttribute('href', '/pdfs/sessions/it-made-easy/session-3-en.pdf')
    })
})


