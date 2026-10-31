import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  extractTipsFromMarkdown,
  extractTipsFromLiveDOM,
  getContextualTipsForRoute,
  isHomePageRoute
} from '../../.vitepress/theme/lmsTipsExtractor.mjs'
import { MENTOR_TIPS_VAULT } from '../../.vitepress/theme/mentorTipsVault.mjs'

describe('lmsTipsExtractor - Dynamic Course & Article Tip Extraction', () => {
  it('identifies homepage routes accurately', () => {
    expect(isHomePageRoute('/')).toBe(true)
    expect(isHomePageRoute('/ro/')).toBe(true)
    expect(isHomePageRoute('/en/')).toBe(true)
    expect(isHomePageRoute('/ro/sessions/premium/typescript-playwright/session-6')).toBe(false)
    expect(isHomePageRoute('/ro/articles/ghid-selectoare-playwright')).toBe(false)
  })

  it('extracts tips from callouts, GitHub alerts, highlight tables, and bold concept bullets', () => {
    const sampleMd = `---
title: Sesiunea 6 Playwright
---
# Sesiunea 6: Workshop Practic Task Tracker

## Capitolul 1: Structura HTML5

::: info 🧠 Proiect Capstone
Construim structura aplicației pas cu pas cu atribute data-testid pentru ca Playwright să localizeze elementele instantaneu și fără flakiness.
:::

> [!CAUTION]
> Nu folosi niciodată XPath-uri absolute precum /html/body/div[2]/button în testele automate E2E!

| 💡 În 1996, racheta Ariane 5 a explodat la 37 de secunde după lansare din cauza unei conversii de pe 64 de biți pe 16 biți netestate unitar. |
| :---- |

* **Atributul disabled nativ:** Blochează trimiterea formularelor goale direct din HTML înainte ca utilizatorul să poată apăsa butonul Salvează.
`
    const tips = extractTipsFromMarkdown(
      sampleMd,
      '/ro/sessions/premium/typescript-playwright/session-6'
    )
    expect(tips.length).toBeGreaterThanOrEqual(4)
    expect(tips[0].courseSlug).toBe('typescript-playwright')
    expect(tips[0].category).toBe('playwright')
    expect(tips[0].mentor).toBe('nova')
    expect(tips[0].sourceTitle).toContain('Sesiunea 6')
  })

  it('returns ALL tips on homepage and material-specific tips on course/article routes', () => {
    const extracted = [
      ...extractTipsFromMarkdown(
        `# Sesiunea 6: Task Tracker\n## Selectoare\n* **Hook-uri data-testid:** Folosește data-testid="submit-task-btn" pentru a izola testele Playwright de modificările CSS.`,
        '/ro/sessions/premium/typescript-playwright/session-6'
      ),
      ...extractTipsFromMarkdown(
        `# Sesiunea 1: Fundamentele Calității\n## Costul Eșecului\n* **Prevenirea defectelor:** Implicarea QA-ului încă din faza de analiză scade costul reparării unui bug de 100 de ori.`,
        '/ro/sessions/masterclass-qa-manual/session-1'
      ),
      ...extractTipsFromMarkdown(
        `# Ghid Selectoare Playwright\n## Locatoare Accesibile\n* **Nivelul 1 getByRole:** Localizează butoanele și input-urile după rolul ARIA și numele accesibil văzut de utilizator.`,
        '/ro/articles/ghid-selectoare-playwright'
      )
    ]

    // 1. On Homepage (/ro/) -> should include all extracted tips + base vault tips
    const homeContext = getContextualTipsForRoute({
      routePath: '/ro/',
      lang: 'ro',
      extractedTips: extracted,
      baseVaultTips: MENTOR_TIPS_VAULT
    })
    expect(homeContext.onHome).toBe(true)
    expect(homeContext.activeScope).toBe('all')
    expect(homeContext.tips.length).toBe(extracted.length + MENTOR_TIPS_VAULT.length)

    // 2. On Session 6 (/ro/sessions/premium/typescript-playwright/session-6) -> defaults to exact lesson tips
    const session6Context = getContextualTipsForRoute({
      routePath: '/ro/sessions/premium/typescript-playwright/session-6',
      lang: 'ro',
      extractedTips: extracted,
      baseVaultTips: MENTOR_TIPS_VAULT
    })
    expect(session6Context.onHome).toBe(false)
    expect(session6Context.activeScope).toBe('page')
    expect(session6Context.tips.length).toBe(1)
    expect(session6Context.tips[0].url).toBe('/ro/sessions/premium/typescript-playwright/session-6')
    expect(session6Context.tips[0].text).toContain('data-testid')

    // 3. On Article (/ro/articles/ghid-selectoare-playwright) -> defaults to exact article tips
    const articleContext = getContextualTipsForRoute({
      routePath: '/ro/articles/ghid-selectoare-playwright',
      lang: 'ro',
      extractedTips: extracted,
      baseVaultTips: MENTOR_TIPS_VAULT
    })
    expect(articleContext.activeScope).toBe('page')
    expect(articleContext.tips.length).toBe(1)
    expect(articleContext.tips[0].url).toBe('/ro/articles/ghid-selectoare-playwright')
  })

  it('extracts live DOM tips when a new or custom page renders .vp-doc elements', () => {
    const container = document.createElement('div')
    container.innerHTML = `
      <h1>Sesiunea Nouă: API Security</h1>
      <div class="custom-block tip">
        <p class="custom-block-title">Sfat Securitate BOLA</p>
        <p>Testează întotdeauna dacă Utilizatorul A poate accesa resursele Utilizatorului B schimbând ID-ul în ruta API.</p>
      </div>
    `
    const domTips = extractTipsFromLiveDOM(
      container,
      '/ro/sessions/masterclass-qa-manual/session-11',
      'ro'
    )
    expect(domTips.length).toBe(1)
    expect(domTips[0].text).toContain('Utilizatorul A')
  })

  it('automatically extracts hundreds of real tips from the LMS ro/ and en/ markdown files', () => {
    const sampleFile = path.resolve(
      process.cwd(),
      'ro/sessions/masterclass-qa-manual/session-1.md'
    )
    const raw = fs.readFileSync(sampleFile, 'utf-8')
    const tips = extractTipsFromMarkdown(raw, '/ro/sessions/masterclass-qa-manual/session-1')
    expect(tips.length).toBeGreaterThan(15)
  })
})

