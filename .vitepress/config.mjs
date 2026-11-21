import { defineConfig } from 'vitepress'

const SITE_URL = 'https://lms.qualiadept.eu'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-preview.jpg`

const COURSE_META = {
  'it-made-easy': {
    ro: 'IT-ul pe Înțelesul Tuturor — De la cod la impulsuri electrice, procesoare, sisteme de operare, rețele, Cloud și AI în laboratoare interactive QualiAdept.',
    en: 'IT Made Easy for Everyone — From code to electrical impulses, CPUs, operating systems, networks, Cloud, and AI with interactive QualiAdept labs.'
  },
  'masterclass-qa-manual': {
    ro: 'Masterclass QA Manual (ISTQB Certified) — Fundamentele testării software, Test Design, Jira, Postman API Testing, SQL și simulări pe proiecte reale.',
    en: 'Masterclass Manual QA (ISTQB Certified) — Software testing fundamentals, Test Design, Jira, Postman API Testing, SQL, and real project simulations.'
  },
  'n8n-openai-rag': {
    ro: 'AI-Powered Automation (n8n & OpenAI RAG) — Automatizare avansată de workflow-uri, integrare LLM, baze de date vectoriale și agenți autonomi RAG.',
    en: 'AI-Powered Automation (n8n & OpenAI RAG) — Advanced workflow automation, OpenAI integration, vector databases, and autonomous RAG agents.'
  },
  'typescript-playwright': {
    ro: 'TypeScript & Playwright Automation — Curs Premium de testare automată End-to-End modernă: DOM, CSS, JavaScript asincron, TypeScript și arhitecturi Playwright.',
    en: 'TypeScript & Playwright Automation — Premium modern End-to-End automated testing course: DOM, CSS, async JavaScript, TypeScript, and Playwright frameworks.'
  },
  'python-for-testing': {
    ro: 'Python for Test Automation 🐍 — Învață Python, OOP, pytest, requests și Selenium/Selene cu compilator interactiv direct în browser pe QualiAdept LMS.',
    en: 'Python for Test Automation 🐍 — Master Python, OOP, pytest, requests, and Selenium/Selene with an interactive in-browser compiler on QualiAdept LMS.'
  },
  'linux-for-testing': {
    ro: 'Linux pentru Testare 🐧 — Navigare în linia de comandă, analiză de log-uri cu grep, permisiuni, Bash scripting și CI/CD cu terminal virtual în browser.',
    en: 'Linux for Testing 🐧 — Command-line navigation, server log analysis with grep, permissions, Bash scripting, and CI/CD with an in-browser virtual terminal.'
  },
  'java-kotlin-for-testing': {
    ro: 'Java vs. Kotlin pentru Testare ☕ vs 🟣 — Paralelă practică între Java 21 și Kotlin 2.0 pentru QA Automation, cu compilator JVM integrat în browser.',
    en: 'Java vs. Kotlin for Testing ☕ vs 🟣 — Hands-on comparison of Java 21 and Kotlin 2.0 for QA Automation, featuring an in-browser JVM compiler.'
  },
  'seminar-selenium-webdriver-vs-selenide': {
    ro: 'Seminar Selenide vs. Selenium WebDriver — Așteptări inteligente, selectoare concise și arhitectură stabilă pentru teste automate UI în Java.',
    en: 'Seminar Selenide vs. Selenium WebDriver — Smart waits, concise selectors, and resilient architecture for automated UI tests in Java.'
  }
}

const ARTICLE_FALLBACK_META = {
  'interviu-qa-automation-era-agentilor-ai': {
    title: 'Nu mai contează dacă știi să scrii testul. Contează dacă vezi de ce testul scris de agent nu verifică nimic.',
    description: 'Când un agent AI scrie un test Playwright în 30 de secunde, interviul tehnic de QA nu mai poate măsura sintaxa. Din perspectiva de interviewer, articolul arată ce întrebări au dispărut, ce exerciții le-au luat locul și cum se pot pregăti candidații și echipele de hiring.',
    image: `${SITE_URL}/images/articles/qa-interview-ai-agents-og.jpg`
  },
  'qa-automation-interview-ai-agents': {
    title: 'Knowing How to Write the Test No Longer Matters. Seeing Why the Agent\'s Test Checks Nothing Does.',
    description: 'When an AI agent can write a Playwright test in 30 seconds, the QA technical interview can\'t keep measuring syntax. Written from an interviewer\'s point of view, this article covers which questions have gone, which exercises replaced them, and how candidates and hiring teams can prepare.',
    image: `${SITE_URL}/images/articles/qa-interview-ai-agents-og.jpg`
  },
  'qa-automation-2029-viitor': {
    title: 'QA Automation în 2029: ce dispare, ce rămâne și ce devine mai valoros',
    description: 'Agenții AI scriu și repară deja teste, iar asta schimbă ce înseamnă să fii QA Automation. Descoperă ce se automatizează, ce crește în valoare și cum se schimbă interviurile.',
    image: `${SITE_URL}/images/articles/qa-automation-2029-hero.jpg`
  },
  'qa-automation-in-2029': {
    title: 'QA Automation in 2029: What Disappears, What Remains, and What Becomes More Valuable',
    description: 'AI agents already write and heal tests, transforming what it means to be a QA Automation engineer. Discover what gets automated, what grows in value, and how technical interviews are changing.',
    image: `${SITE_URL}/images/articles/qa-automation-2029-hero.jpg`
  },
  'cnp-din-perspectiva-qa': {
    title: 'CNP-ul din Perspectiva unui Software QA: Tot Ce Trebuie Să Știi',
    description: 'Află cum să testezi riguros un câmp de CNP folosind tehnici de test design, validare pe 3 niveluri și calculul cifrei de control.',
    image: `${SITE_URL}/images/articles/cnp-validation-flow.jpg`
  },
  'romanian-cnp-qa-perspective': {
    title: 'Romanian National ID (CNP) from a QA Perspective: Everything You Need to Know',
    description: 'Exhaustive testing strategies for national ID fields: structure validation, checksum verification, equivalence partitioning, boundary value analysis, and GDPR.',
    image: `${SITE_URL}/images/articles/cnp-validation-flow-en.jpg`
  },
  'ghid-testare-qa-llm-ai': {
    title: 'Ghidul Complet și Extins pentru Testarea QA a Modelelor LLM și AI',
    description: 'Descoperă dimensiunile cheie de evaluare, cadrul de testare în 6 etape, metricile esențiale și strategiile QA pentru modele de limbaj și inteligență artificială.',
    image: DEFAULT_OG_IMAGE
  },
  'qa-testing-for-llms-and-ai': {
    title: 'The Complete Guide to QA Testing for LLMs and AI',
    description: 'Explore essential QA testing dimensions, frameworks, metrics, and evaluation strategies for Large Language Models and AI systems.',
    image: DEFAULT_OG_IMAGE
  },
  'ghid-selectoare-playwright': {
    title: 'Ghid Complet: Cum să alegi cele mai robuste selectoare în Playwright',
    description: 'Învață cum să scrii locatoare rezistente la schimbări de UI în Playwright (getByRole, getByTestId) și cum să eviți selectoarele fragile.',
    image: DEFAULT_OG_IMAGE
  },
  'playwright-selector-guide': {
    title: 'Complete Guide: Writing Resilient Selectors in Playwright',
    description: 'Learn how to write UI-change resilient locators in Playwright (getByRole, getByTestId) and avoid brittle XPath or CSS selectors.',
    image: DEFAULT_OG_IMAGE
  }
}

function cleanText(str = '') {
  return String(str)
    .replace(/\*\*/g, '')
    .replace(/\\-/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolvePageSeo(pageData) {
  const rel = (pageData.relativePath || '').replace(/\\/g, '/')
  const isEn = rel.startsWith('en/')
  const slug = rel.split('/').pop()?.replace(/\.md$/, '') || ''

  const articleMeta = ARTICLE_FALLBACK_META[slug]
  const rawTitle = cleanText(pageData.frontmatter?.title || pageData.title || articleMeta?.title || '')

  let title = rawTitle
    ? (rawTitle.includes('QualiAdept') ? rawTitle : `${rawTitle} | QualiAdept LMS`)
    : (isEn
        ? 'QualiAdept LMS — Interactive QA Automation, Playwright, Python, Linux & AI Platform'
        : 'QualiAdept LMS — Platforma Interactivă de QA Automation, Playwright, Python, Linux & AI')

  let description = cleanText(pageData.frontmatter?.description || pageData.description || articleMeta?.description || '')

  if (!description) {
    for (const [courseKey, meta] of Object.entries(COURSE_META)) {
      if (rel.includes(courseKey)) {
        const prefix = rawTitle ? `${rawTitle} • ` : ''
        description = prefix + (isEn ? meta.en : meta.ro)
        break
      }
    }
  }

  if (!description) {
    description = isEn
      ? 'Transform your career alongside Mr. QA Wizard 🧙‍♂️ and Nova 🤖. Master Software Testing, Playwright, Python, Java/Kotlin, Linux, and AI Automation with interactive in-browser labs.'
      : 'Transformă-ți cariera alături de Mr. QA Wizard 🧙‍♂️ și Nova 🤖. Devino specialist în Testare Software, Playwright, Python, Java/Kotlin, Linux și Automatizări AI cu laboratoare direct în browser.'
  }

  let ogImage = DEFAULT_OG_IMAGE
  if (pageData.frontmatter?.ogImage) {
    ogImage = pageData.frontmatter.ogImage.startsWith('http')
      ? pageData.frontmatter.ogImage
      : `${SITE_URL}${pageData.frontmatter.ogImage}`
  } else if (articleMeta?.image) {
    ogImage = articleMeta.image
  }

  const urlPath = '/' + rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  const canonicalUrl = `${SITE_URL}${urlPath === '//' ? '/' : urlPath}`
  const ogType = (rel.includes('/articles/') || rel.includes('/sessions/')) && !rel.endsWith('index.md')
    ? 'article'
    : 'website'

  return {
    title,
    description,
    ogImage,
    canonicalUrl,
    ogType,
    locale: isEn ? 'en_US' : 'ro_RO'
  }
}

export default defineConfig({
  appearance: 'dark',
  ignoreDeadLinks: true,
  srcExclude: ['**/playwright-report/**', '**/test-results/**', '**/coverage/**', '**/backups/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
    ['meta', { property: 'og:site_name', content: 'QualiAdept LMS' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  transformHead({ pageData }) {
    const seo = resolvePageSeo(pageData)
    return [
      ['link', { rel: 'canonical', href: seo.canonicalUrl }],
      ['meta', { property: 'og:type', content: seo.ogType }],
      ['meta', { property: 'og:locale', content: seo.locale }],
      ['meta', { property: 'og:title', content: seo.title }],
      ['meta', { property: 'og:description', content: seo.description }],
      ['meta', { property: 'og:url', content: seo.canonicalUrl }],
      ['meta', { property: 'og:image', content: seo.ogImage }],
      ['meta', { property: 'og:image:secure_url', content: seo.ogImage }],
      ['meta', { property: 'og:image:type', content: 'image/jpeg' }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: seo.title }],
      ['meta', { name: 'twitter:title', content: seo.title }],
      ['meta', { name: 'twitter:description', content: seo.description }],
      ['meta', { name: 'twitter:image', content: seo.ogImage }]
    ]
  },
  locales: {
    root: {
      label: 'Română',
      lang: 'ro',
      link: '/ro/',
      title: "QualiAdept LMS",
      description: "Platforma oficială de cursuri QA",
      themeConfig: {
        nav: [
          { text: 'Acasă', link: '/ro/' },
          {
            text: 'Cursuri',
            items: [
              { text: 'IT-ul pe Înțelesul Tuturor', link: '/ro/sessions/it-made-easy/syllabus' },
              { text: 'Masterclass QA Manual', link: '/ro/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/ro/sessions/n8n-openai-rag/syllabus' },
              { text: 'TypeScript & Playwright 🔒', link: '/ro/sessions/premium/typescript-playwright/syllabus' },
              { text: 'Python for Testing 🐍', link: '/ro/sessions/python-for-testing/syllabus' },
              { text: 'Linux pentru Testare 🐧', link: '/ro/sessions/linux-for-testing/syllabus' },
              { text: 'Java vs. Kotlin pentru Testare ☕ vs 🟣', link: '/ro/sessions/java-kotlin-for-testing/syllabus' },
              { text: 'Seminar Selenide vs Selenium', link: '/ro/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
            ]
          },
          { text: 'Articole', link: '/ro/articles/' },
          { text: 'Suport', link: 'mailto:george@qualiadept.eu' },
          { text: 'Autentificare', link: '/ro/auth' }
        ],
        sidebar: {
          '/ro/sessions/it-made-easy/': [
            {
              text: 'Introducere',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/it-made-easy/syllabus' }]
            },
            {
              text: 'Modulul 1: Hardware',
              items: [
                { text: 'Sesiunea 1: Procesorul (CPU) - Arhitectură și Execuție', link: '/ro/sessions/it-made-easy/session-1' },
                { text: 'Sesiunea 2: Ierarhia Memoriei și Magistralele', link: '/ro/sessions/it-made-easy/session-2' }
              ]
            },
            {
              text: 'Modulul 2: Logică Digitală și Software de Bază',
              items: [
                { text: 'Sesiunea 3: Universul Binar și Porțile Logice', link: '/ro/sessions/it-made-easy/session-3' },
                { text: 'Sesiunea 4: Sistemul de Operare - Managementul Caosului', link: '/ro/sessions/it-made-easy/session-4' }
              ]
            },
            {
              text: 'Modulul 3: De la Cod la Imagine',
              items: [
                { text: 'Sesiunea 5: Limbaje de Programare, Compilare și Execuție', link: '/ro/sessions/it-made-easy/session-5' },
                { text: 'Sesiunea 6: Grafică, Periferice și Interfață', link: '/ro/sessions/it-made-easy/session-6' }
              ]
            },
            {
              text: 'Modulul 4: Lumea Interconectată & Tehnologii Moderne',
              items: [
                { text: 'Sesiunea 7: Rețele, Internet și Protocoale', link: '/ro/sessions/it-made-easy/session-7' },
                { text: 'Sesiunea 8: Cloud, Criptografie și Inteligență Artificială', link: '/ro/sessions/it-made-easy/session-8' }
              ]
            }
          ],
          '/ro/sessions/n8n-openai-rag/': [
            {
              text: 'AI Automation',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/n8n-openai-rag/syllabus' }]
            },
            {
              text: 'Module de Studiu',
              items: [
                { text: 'Sesiunea 1: Introducere în n8n', link: '/ro/sessions/n8n-openai-rag/session-1' },
                { text: 'Sesiunea 2: Integrarea API-urilor OpenAI în n8n', link: '/ro/sessions/n8n-openai-rag/session-2' },
                { text: 'Sesiunea 3: Bazele Vectoriale și Embeddings', link: '/ro/sessions/n8n-openai-rag/session-3' },
                { text: 'Sesiunea 4: Construirea Agentului AI Autonom (Arhitectura RAG)', link: '/ro/sessions/n8n-openai-rag/session-4' },
                { text: 'Sesiunea 5: Notificări, Alerte și Proiectul Capstone', link: '/ro/sessions/n8n-openai-rag/session-5' },
                { text: 'Sesiunea 6: Prezentări, Code Review și Scalare', link: '/ro/sessions/n8n-openai-rag/session-6' }
              ]
            }
          ],
          '/ro/sessions/masterclass-qa-manual/': [
            {
              text: 'Introducere',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/masterclass-qa-manual/syllabus' }]
            },
            {
              text: 'Module de Studiu',
              items: [
                { text: 'Sesiunea 1: Fundamentele Calității', link: '/ro/sessions/masterclass-qa-manual/session-1' },
                { text: 'Sesiunea 1.2: Cele 7 Principii (Studiu Individual)', link: '/ro/sessions/masterclass-qa-manual/session-1-2' },
                { text: 'Sesiunea 2: Planificarea Testării', link: '/ro/sessions/masterclass-qa-manual/session-2' },
                { text: 'Sesiunea 3: Testarea Statică', link: '/ro/sessions/masterclass-qa-manual/session-3' },
                { text: 'Sesiunea 4: Introducere în Jira & Test Management', link: '/ro/sessions/masterclass-qa-manual/session-4' },
                { text: 'Sesiunea 5: Tehnici Blackbox (Design-ul Testelor)', link: '/ro/sessions/masterclass-qa-manual/session-5' },
                { text: 'Sesiunea 6: Introducere în Whitebox Testing', link: '/ro/sessions/masterclass-qa-manual/session-6' },
                { text: 'Sesiunea 7: GUI Testing (Interfața Grafică)', link: '/ro/sessions/masterclass-qa-manual/session-7' },
                { text: 'Sesiunea 8: Bazele API Testing & Postman', link: '/ro/sessions/masterclass-qa-manual/session-8' },
                { text: 'Sesiunea 9: Testare Avansată în Postman', link: '/ro/sessions/masterclass-qa-manual/session-9' },
                { text: 'Sesiunea 10: Rulare Colecții cu Newman', link: '/ro/sessions/masterclass-qa-manual/session-10' },
                { text: 'Sesiunea 11: Teoria Bazelor de Date Relaționale', link: '/ro/sessions/masterclass-qa-manual/session-11' },
                { text: 'Sesiunea 12: Practică DDL (Data Definition Language)', link: '/ro/sessions/masterclass-qa-manual/session-12' },
                { text: 'Sesiunea 13: Practică DML (Data Manipulation Language)', link: '/ro/sessions/masterclass-qa-manual/session-13' },
                { text: 'Sesiunea 14: Practică DQL (Data Query Language)', link: '/ro/sessions/masterclass-qa-manual/session-14' },
                { text: 'Sesiunea 15: Pregătire ISTQB Foundation Level', link: '/ro/sessions/masterclass-qa-manual/session-15' }
              ]
            }
          ],
          '/ro/sessions/premium/typescript-playwright/': [
            {
              text: 'TypeScript & Playwright (Premium)',
              items: [
                { text: 'Syllabus Curs', link: '/ro/sessions/premium/typescript-playwright/syllabus' },
                { text: 'Sesiunea 1: Arhitectura web, structura DOM-ului și fundamente HTML', link: '/ro/sessions/premium/typescript-playwright/session-1' },
                { text: 'Sesiunea 2: CSS modern și selectoare DOM', link: '/ro/sessions/premium/typescript-playwright/session-2' },
                { text: 'Sesiunea 3: JavaScript pentru QA Automation', link: '/ro/sessions/premium/typescript-playwright/session-3' },
                { text: 'Sesiunea 4: Manipularea DOM-ului', link: '/ro/sessions/premium/typescript-playwright/session-4' },
                { text: 'Sesiunea 5: JavaScript Asincron', link: '/ro/sessions/premium/typescript-playwright/session-5' },
                { text: 'Sesiunea 6: Workshop Practic — Finalizarea Aplicației "Task Tracker"', link: '/ro/sessions/premium/typescript-playwright/session-6' },
                { text: 'Sesiunea 7: Tipizarea Statică (TypeScript)', link: '/ro/sessions/premium/typescript-playwright/session-7' },
                { text: 'Sesiunea 8: Structuri Avansate în TS și OOP (Pregătirea pentru POM)', link: '/ro/sessions/premium/typescript-playwright/session-8' },
                { text: 'Sesiunea 9: Setup și Arhitectură Playwright', link: '/ro/sessions/premium/typescript-playwright/session-9' }
              ]
            }
          ],
          '/ro/sessions/python-for-testing/': [
            {
              text: 'Python for Testing',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/python-for-testing/syllabus' }]
            },
            {
              text: 'Modulul 1: Fundamente Python pentru QA',
              items: [
                { text: 'Sesiunea 1: Primii Pași în Python & Tipuri de Date', link: '/ro/sessions/python-for-testing/session-1' },
                { text: 'Sesiunea 2: Structuri de Date & Controlul Fluxului', link: '/ro/sessions/python-for-testing/session-2' },
                { text: 'Sesiunea 3: Funcții, Gestionarea Erorilor & Fișiere (I/O)', link: '/ro/sessions/python-for-testing/session-3' }
              ]
            },
            {
              text: 'Modulul 2: Programare Orientată pe Obiecte (OOP) pentru Testare',
              items: [
                { text: 'Sesiunea 4: Clase, Obiecte și Relații între Ele', link: '/ro/sessions/python-for-testing/session-4' }
              ]
            }
          ],
          '/ro/sessions/linux-for-testing/': [
            {
              text: 'Linux pentru Testare',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/linux-for-testing/syllabus' }]
            },
            {
              text: 'Modulul 1: Fundamente Linux & Navigare',
              items: [
                { text: 'Sesiunea 1: Primii Pași & Navigarea în Fișiere', link: '/ro/sessions/linux-for-testing/session-1' },
                { text: 'Sesiunea 2: Inspectarea & Filtrarea Log-urilor', link: '/ro/sessions/linux-for-testing/session-2' }
              ]
            }
          ],
          '/ro/sessions/java-kotlin-for-testing/': [
            {
              text: 'Java vs. Kotlin pentru Testare',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/java-kotlin-for-testing/syllabus' }]
            },
            {
              text: 'Modulul 1: Fundamentele Limbajelor & Sintaxă Comparată',
              items: [
                { text: 'Sesiunea 1: Primii Pași în JVM — Sintaxă & Variabile', link: '/ro/sessions/java-kotlin-for-testing/session-1' },
                { text: 'Sesiunea 2: Structuri de Date & Colecții în Testare', link: '/ro/sessions/java-kotlin-for-testing/session-2' }
              ]
            }
          ],
          '/ro/sessions/seminar-selenium-webdriver-vs-selenide/': [
            {
              text: 'Ghid Seminar',
              items: [
                { text: 'Selenide vs. Selenium WebDriver', link: '/ro/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
              ]
            }
          ],
          '/ro/articles/': [
            {
              text: 'Articole & Ghiduri',
              items: [
                { text: 'Toate Articolele', link: '/ro/articles/' },
                { text: 'Interviul QA în Era Agenților AI', link: '/ro/articles/interviu-qa-automation-era-agentilor-ai' },
                { text: 'QA Automation în 2029', link: '/ro/articles/qa-automation-2029-viitor' },
                { text: 'CNP-ul din Perspectiva QA', link: '/ro/articles/cnp-din-perspectiva-qa' },
                { text: 'Ghid Selectoare Playwright', link: '/ro/articles/ghid-selectoare-playwright' },
                { text: 'Testarea QA pentru LLM & AI', link: '/ro/articles/ghid-testare-qa-llm-ai' }
              ]
            }
          ]
        },
        footer: {
          message: 'Educație creată cu pasiune pentru excelență.',
          copyright: '© 2026 QualiAdept. Toate drepturile rezervate.'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: "QualiAdept LMS",
      description: "Official QA training platform",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          {
            text: 'Courses',
            items: [
              { text: 'IT Made Easy for Everyone', link: '/en/sessions/it-made-easy/syllabus' },
              { text: 'Masterclass QA Manual', link: '/en/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/en/sessions/n8n-openai-rag/syllabus' },
              { text: 'TypeScript & Playwright 🔒', link: '/en/sessions/premium/typescript-playwright/syllabus' },
              { text: 'Python for Testing 🐍', link: '/en/sessions/python-for-testing/syllabus' },
              { text: 'Linux for Testing 🐧', link: '/en/sessions/linux-for-testing/syllabus' },
              { text: 'Java vs. Kotlin for Testing ☕ vs 🟣', link: '/en/sessions/java-kotlin-for-testing/syllabus' },
              { text: 'Seminar Selenide vs Selenium', link: '/en/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
            ]
          },
          { text: 'Articles', link: '/en/articles/' },
          { text: 'Support', link: 'mailto:george@qualiadept.eu' },
          { text: 'Login', link: '/en/auth' }
        ],
        sidebar: {
          '/en/sessions/it-made-easy/': [
            {
              text: 'Introduction',
              items: [{ text: 'Syllabus', link: '/en/sessions/it-made-easy/syllabus' }]
            },
            {
              text: 'Module 1: Hardware',
              items: [
                { text: 'Session 1: The Processor (CPU) - Architecture and Execution', link: '/en/sessions/it-made-easy/session-1' },
                { text: 'Session 2: Memory Hierarchy and Buses', link: '/en/sessions/it-made-easy/session-2' }
              ]
            },
            {
              text: 'Module 2: Digital Logic and Basic Software',
              items: [
                { text: 'Session 3: The Binary Universe and Logic Gates', link: '/en/sessions/it-made-easy/session-3' },
                { text: 'Session 4: The Operating System - Chaos Management', link: '/en/sessions/it-made-easy/session-4' }
              ]
            },
            {
              text: 'Module 3: From Code to Image',
              items: [
                { text: 'Session 5: Programming Languages, Compilation and Execution', link: '/en/sessions/it-made-easy/session-5' },
                { text: 'Session 6: Graphics, Peripherals and Interface', link: '/en/sessions/it-made-easy/session-6' }
              ]
            },
            {
              text: 'Module 4: Interconnected World & Modern Tech',
              items: [
                { text: 'Session 7: Networks, Internet and Protocols', link: '/en/sessions/it-made-easy/session-7' },
                { text: 'Session 8: Cloud, Cryptography and Artificial Intelligence', link: '/en/sessions/it-made-easy/session-8' }
              ]
            }
          ],
          '/en/sessions/n8n-openai-rag/': [
            {
              text: 'AI Automation',
              items: [{ text: 'Syllabus', link: '/en/sessions/n8n-openai-rag/syllabus' }]
            },
            {
              text: 'Study Modules',
              items: [
                { text: 'Session 1: Introduction to n8n', link: '/en/sessions/n8n-openai-rag/session-1' },
                { text: 'Session 2: Integrating OpenAI APIs into n8n', link: '/en/sessions/n8n-openai-rag/session-2' },
                { text: 'Session 3: Vector Basis and Embeddings', link: '/en/sessions/n8n-openai-rag/session-3' },
                { text: 'Session 4: Building the Autonomous AI Agent (RAG Architecture)', link: '/en/sessions/n8n-openai-rag/session-4' },
                { text: 'Session 5: Notifications, Alerts, and the Capstone Project', link: '/en/sessions/n8n-openai-rag/session-5' },
                { text: 'Session 6: Presentations, Code Review and Scaling', link: '/en/sessions/n8n-openai-rag/session-6' }
              ]
            }
          ],
          '/en/sessions/masterclass-qa-manual/': [
            {
              text: 'Introduction',
              items: [{ text: 'Syllabus', link: '/en/sessions/masterclass-qa-manual/syllabus' }]
            },
            {
              text: 'Study Modules',
              items: [
                { text: 'Session 1: QA Fundamentals', link: '/en/sessions/masterclass-qa-manual/session-1' },
                { text: 'Session 1.2: The 7 Principles (Individual Study)', link: '/en/sessions/masterclass-qa-manual/session-1-2' },
                { text: 'Session 2: Test Planning', link: '/en/sessions/masterclass-qa-manual/session-2' },
                { text: 'Session 3: Static Testing', link: '/en/sessions/masterclass-qa-manual/session-3' },
                { text: 'Session 4: Introduction to Jira & Test Management', link: '/en/sessions/masterclass-qa-manual/session-4' },
                { text: 'Session 5: Blackbox Techniques (Test Design)', link: '/en/sessions/masterclass-qa-manual/session-5' },
                { text: 'Session 6: Introduction to Whitebox Testing', link: '/en/sessions/masterclass-qa-manual/session-6' },
                { text: 'Session 7: GUI Testing (Graphical Interface)', link: '/en/sessions/masterclass-qa-manual/session-7' },
                { text: 'Session 8: API Testing & Postman Basics', link: '/en/sessions/masterclass-qa-manual/session-8' },
                { text: 'Session 9: Advanced Testing in Postman', link: '/en/sessions/masterclass-qa-manual/session-9' },
                { text: 'Session 10: Running Collections with Newman', link: '/en/sessions/masterclass-qa-manual/session-10' },
                { text: 'Session 11: Relational Database Theory', link: '/en/sessions/masterclass-qa-manual/session-11' },
                { text: 'Session 12: DDL (Data Definition Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-12' },
                { text: 'Session 13: DML (Data Manipulation Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-13' },
                { text: 'Session 14: DQL (Data Query Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-14' },
                { text: 'Session 15: ISTQB Foundation Level Prep', link: '/en/sessions/masterclass-qa-manual/session-15' }
              ]
            }
          ],
          '/en/sessions/premium/typescript-playwright/': [
            {
              text: 'TypeScript & Playwright (Premium)',
              items: [
                { text: 'Syllabus', link: '/en/sessions/premium/typescript-playwright/syllabus' },
                { text: 'Session 1: Web architecture, DOM structure and HTML fundamentals', link: '/en/sessions/premium/typescript-playwright/session-1' },
                { text: 'Session 2: Modern CSS and DOM Selectors', link: '/en/sessions/premium/typescript-playwright/session-2' },
                { text: 'Session 3: JavaScript for QA Automation', link: '/en/sessions/premium/typescript-playwright/session-3' },
                { text: 'Session 4: DOM Manipulation with JavaScript', link: '/en/sessions/premium/typescript-playwright/session-4' },
                { text: 'Session 5: Asynchronous JavaScript', link: '/en/sessions/premium/typescript-playwright/session-5' },
                { text: 'Session 6: Practical Workshop — Finalizing the "Task Tracker" Application', link: '/en/sessions/premium/typescript-playwright/session-6' },
                { text: 'Session 7: Static Typing (TypeScript)', link: '/en/sessions/premium/typescript-playwright/session-7' },
                { text: 'Session 8: Advanced TS Structures and OOP (Preparing for POM)', link: '/en/sessions/premium/typescript-playwright/session-8' },
                { text: 'Session 9: Playwright Setup and Architecture', link: '/en/sessions/premium/typescript-playwright/session-9' }
              ]
            }
          ],
          '/en/sessions/python-for-testing/': [
            {
              text: 'Python for Testing',
              items: [{ text: 'Syllabus', link: '/en/sessions/python-for-testing/syllabus' }]
            },
            {
              text: 'Module 1: Python Core Essentials for QA',
              items: [
                { text: 'Session 1: First Steps in Python & Data Types', link: '/en/sessions/python-for-testing/session-1' },
                { text: 'Session 2: Data Structures & Control Flow', link: '/en/sessions/python-for-testing/session-2' },
                { text: 'Session 3: Functions, Error Handling & File I/O', link: '/en/sessions/python-for-testing/session-3' }
              ]
            },
            {
              text: 'Module 2: Object-Oriented Programming (OOP) for Testing',
              items: [
                { text: 'Session 4: Classes, Objects, and Relationships', link: '/en/sessions/python-for-testing/session-4' }
              ]
            }
          ],
          '/en/sessions/linux-for-testing/': [
            {
              text: 'Linux for Testing',
              items: [{ text: 'Syllabus', link: '/en/sessions/linux-for-testing/syllabus' }]
            },
            {
              text: 'Module 1: Linux Foundations & Navigation',
              items: [
                { text: 'Session 1: First Steps & Filesystem Navigation', link: '/en/sessions/linux-for-testing/session-1' },
                { text: 'Session 2: Inspecting & Filtering Server Logs', link: '/en/sessions/linux-for-testing/session-2' }
              ]
            }
          ],
          '/en/sessions/java-kotlin-for-testing/': [
            {
              text: 'Java vs. Kotlin for Testing',
              items: [{ text: 'Syllabus', link: '/en/sessions/java-kotlin-for-testing/syllabus' }]
            },
            {
              text: 'Module 1: Language Foundations & Syntax Comparison',
              items: [
                { text: 'Session 1: First Steps in the JVM — Syntax & Variables', link: '/en/sessions/java-kotlin-for-testing/session-1' },
                { text: 'Session 2: Data Structures & Collections in Testing', link: '/en/sessions/java-kotlin-for-testing/session-2' }
              ]
            }
          ],
          '/en/sessions/seminar-selenium-webdriver-vs-selenide/': [
            {
              text: 'Seminar Guide',
              items: [
                { text: 'Selenide vs. Selenium WebDriver', link: '/en/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
              ]
            }
          ],
          '/en/articles/': [
            {
              text: 'Articles & Guides',
              items: [
                { text: 'All Articles', link: '/en/articles/' },
                { text: 'QA Interview in the Age of Agents', link: '/en/articles/qa-automation-interview-ai-agents' },
                { text: 'QA Automation in 2029', link: '/en/articles/qa-automation-in-2029' },
                { text: 'Romanian CNP QA Guide', link: '/en/articles/romanian-cnp-qa-perspective' },
                { text: 'Playwright Selectors Guide', link: '/en/articles/playwright-selector-guide' },
                { text: 'QA Testing for LLMs and AI', link: '/en/articles/qa-testing-for-llms-and-ai' }
              ]
            }
          ]
        },
        footer: {
          message: 'Education created with passion for excellence.',
          copyright: '© 2026 QualiAdept. All rights reserved.'
        }
      }
    }
  },

  themeConfig: {
    logo: '/logo.png',
    search: { provider: 'local' }, // VitePress va gestiona automat traducerile căutării
    outline: { level: [2, 3], label: 'În această sesiune / In this session' },
    docFooter: { prev: 'Înapoi / Back', next: 'Înainte / Next' },
  }
})