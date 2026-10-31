/**
 * Dynamic LMS Content Tips Extractor & Context-Aware Router
 * Automatically extracts actionable QA, Automation, Python, SQL, and AI tips
 * from all Markdown courses, sessions, homework, and articles across the LMS.
 */

export const COURSE_TRACK_META = {
  'it-made-easy': {
    slug: 'it-made-easy',
    mentor: 'wizard',
    category: 'istqb',
    labelRo: 'IT-ul pe Înțelesul Tuturor',
    labelEn: 'IT Made Easy'
  },
  'masterclass-qa-manual': {
    slug: 'masterclass-qa-manual',
    mentor: 'wizard',
    category: 'istqb',
    labelRo: 'Masterclass QA Manual',
    labelEn: 'QA Manual Masterclass'
  },
  'n8n-openai-rag': {
    slug: 'n8n-openai-rag',
    mentor: 'nova',
    category: 'ai',
    labelRo: 'AI Automation (n8n & RAG)',
    labelEn: 'AI Automation (n8n & RAG)'
  },
  'typescript-playwright': {
    slug: 'typescript-playwright',
    mentor: 'nova',
    category: 'playwright',
    labelRo: 'TypeScript & Playwright',
    labelEn: 'TypeScript & Playwright'
  },
  'python-for-testing': {
    slug: 'python-for-testing',
    mentor: 'nova',
    category: 'python',
    labelRo: 'Python for Testing',
    labelEn: 'Python for Testing'
  },
  'seminar-selenium-webdriver-vs-selenide': {
    slug: 'seminar-selenium-webdriver-vs-selenide',
    mentor: 'nova',
    category: 'playwright',
    labelRo: 'Seminar Selenide vs Selenium',
    labelEn: 'Selenide vs Selenium Seminar'
  },
  articles: {
    slug: 'articles',
    mentor: 'wizard',
    category: 'istqb',
    labelRo: 'Articole & Ghiduri QA',
    labelEn: 'QA Articles & Guides'
  }
}

/**
 * Normalizes a VitePress route path or URL for consistent comparison.
 */
export function normalizeRouteUrl(url = '') {
  if (!url) return '/'
  let clean = String(url)
    .split('#')[0]
    .split('?')[0]
    .replace(/\.html$/i, '')
    .replace(/\.md$/i, '')
  try {
    clean = decodeURIComponent(clean)
  } catch {
    // ignore malformed URI encoding
  }
  if (clean.length > 1 && clean.endsWith('/index')) {
    clean = clean.slice(0, -5)
  }
  return clean
}

/**
 * Checks whether a route path is the RO or EN homepage.
 */
export function isHomePageRoute(path = '') {
  const norm = normalizeRouteUrl(path)
  return norm === '/' || norm === '/ro/' || norm === '/ro' || norm === '/en/' || norm === '/en'
}

/**
 * Strips leading emojis/pictographs from a string so badges never render double icons.
 */
export function stripLeadingEmojis(str = '') {
  return String(str)
    .replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F•·\-–—:]+/gu, '')
    .trim()
}

/**
 * Cleans inline markdown formatting so tips display cleanly in UI cards and 3D speech bubbles.
 */
export function cleanMarkdownTipText(raw = '') {
  if (!raw) return ''
  return String(raw)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\\([.>+\-*!()[\]])/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Splits a tip string of the form "Concept Title: Detailed explanation..." into { title, body }.
 */
export function splitTipTitleAndBody(rawText = '', fallbackTitle = '') {
  const cleaned = stripLeadingEmojis(cleanMarkdownTipText(rawText))
  const colonIdx = cleaned.indexOf(':')
  if (colonIdx >= 4 && colonIdx <= 68) {
    const candidateTitle = cleaned.slice(0, colonIdx).trim()
    const candidateBody = cleaned.slice(colonIdx + 1).trim()
    if (candidateBody.length >= 25) {
      return {
        title: stripLeadingEmojis(candidateTitle),
        body: candidateBody
      }
    }
  }
  return {
    title: stripLeadingEmojis(cleanMarkdownTipText(fallbackTitle)),
    body: cleaned
  }
}

/**
 * Infers course slug, mentor, and category from a page URL and text content.
 */
export function classifyContentSource(url = '', text = '') {
  const normUrl = normalizeRouteUrl(url).toLowerCase()
  const lowerText = (text || '').toLowerCase()

  let courseSlug = 'general'
  for (const key of Object.keys(COURSE_TRACK_META)) {
    if (key !== 'articles' && normUrl.includes(`/${key}/`)) {
      courseSlug = key
      break
    }
  }
  if (courseSlug === 'general') {
    if (normUrl.includes('/articles/')) {
      courseSlug = 'articles'
    } else if (normUrl.includes('python-ide')) {
      courseSlug = 'python-for-testing'
    }
  }

  const baseMeta = COURSE_TRACK_META[courseSlug] || {
    slug: 'general',
    mentor: 'wizard',
    category: 'istqb',
    labelRo: 'QualiAdept LMS',
    labelEn: 'QualiAdept LMS'
  }

  let category = baseMeta.category
  let mentor = baseMeta.mentor

  if (
    lowerText.includes('postman') ||
    lowerText.includes('newman') ||
    lowerText.includes('sql') ||
    lowerText.includes('baze de date') ||
    lowerText.includes('database') ||
    lowerText.includes('rest api') ||
    lowerText.includes('status code') ||
    /session-1[0-7]\b/.test(normUrl)
  ) {
    if (courseSlug === 'masterclass-qa-manual' || courseSlug === 'articles') {
      category = 'api-sql'
    }
  } else if (
    lowerText.includes('playwright') ||
    lowerText.includes('locator') ||
    lowerText.includes('getbyrole') ||
    lowerText.includes('data-testid') ||
    lowerText.includes('selenide') ||
    lowerText.includes('webdriver')
  ) {
    category = 'playwright'
    mentor = 'nova'
  } else if (
    lowerText.includes('llm') ||
    lowerText.includes('openai') ||
    lowerText.includes('rag') ||
    lowerText.includes('embeddings') ||
    lowerText.includes('n8n') ||
    lowerText.includes('halucina') ||
    lowerText.includes('hallucination')
  ) {
    category = 'ai'
    mentor = 'nova'
  } else if (
    lowerText.includes('pytest') ||
    lowerText.includes('python') ||
    lowerText.includes('pyodide')
  ) {
    category = 'python'
    mentor = 'nova'
  }

  return {
    courseSlug,
    category,
    mentor,
    courseLabelRo: baseMeta.labelRo,
    courseLabelEn: baseMeta.labelEn
  }
}

/**
 * Extracts structured, high-signal tips from a Markdown file's raw source and URL.
 */
export function extractTipsFromMarkdown(rawMarkdown = '', url = '') {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') return []

  const normUrl = normalizeRouteUrl(url)
  if (
    isHomePageRoute(normUrl) ||
    normUrl.endsWith('/auth') ||
    normUrl.endsWith('/articles') ||
    normUrl.endsWith('/articles/')
  ) {
    return []
  }

  const lang = normUrl.startsWith('/en/') ? 'en' : 'ro'

  let content = rawMarkdown
  let frontmatterTitle = ''
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m)
    if (titleMatch) {
      frontmatterTitle = stripLeadingEmojis(cleanMarkdownTipText(titleMatch[1].replace(/^['"]|['"]$/g, '')))
    }
    content = content.slice(fmMatch[0].length)
  }

  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '\n')

  let docTitle = frontmatterTitle
  const h1Match = contentWithoutCode.match(/^#\s+(.+)$/m)
  if (h1Match) {
    docTitle = stripLeadingEmojis(cleanMarkdownTipText(h1Match[1]))
  }
  if (!docTitle) {
    docTitle = normUrl.split('/').pop() || 'LMS Lesson'
  }

  const extracted = []
  const seenTexts = new Set()

  function addCandidate(rawBody, rawTitle = '', kind = 'insight') {
    const { title, body } = splitTipTitleAndBody(rawBody, rawTitle)
    if (!body || body.length < 45 || body.length > 310) return

    const lower = body.toLowerCase()
    if (
      lower.includes('vizualizează suportul de curs') ||
      lower.includes('vizualizează versiunea pdf') ||
      lower.includes('view the pdf') ||
      lower.includes('deschide vs code') ||
      lower.includes('open vs code') ||
      lower.includes('salvează și dă refresh') ||
      lower.includes('save and refresh') ||
      lower.includes('lasă o reacție sau un comentariu') ||
      lower.includes('în acest capitol, nu ne limităm') ||
      lower.includes('acum că avem structura brută') ||
      lower.includes('adăugă codul de mai jos')
    ) {
      return
    }

    const dedupeKey = lower.slice(0, 80)
    if (seenTexts.has(dedupeKey)) return
    seenTexts.add(dedupeKey)

    const meta = classifyContentSource(normUrl, `${docTitle} ${title} ${body}`)
    const cleanTitle =
      title && !['TIP', 'INFO', 'WARNING', 'CAUTION', 'NOTE', 'IMPORTANT'].includes(title.toUpperCase())
        ? title
        : lang === 'en'
          ? 'QA Best Practice'
          : 'Sfat Practic QA'

    const formattedFullText = cleanTitle ? `${cleanTitle}: ${body}` : body

    extracted.push({
      id: `${normUrl}#tip-${extracted.length + 1}`,
      lang,
      url: normUrl,
      courseSlug: meta.courseSlug,
      category: meta.category,
      mentor: meta.mentor,
      sourceTitle: docTitle,
      courseLabel: lang === 'en' ? meta.courseLabelEn : meta.courseLabelRo,
      tipTitle: cleanTitle,
      tipBody: body,
      kind,
      text: formattedFullText,
      ro: lang === 'ro' ? formattedFullText : undefined,
      en: lang === 'en' ? formattedFullText : undefined
    })
  }

  // 1. VitePress custom containers: ::: tip / info / warning / danger
  const containerRegex = /^:::\s*(tip|info|warning|danger)\s*(.*)\r?\n([\s\S]*?)^:::/gm
  let match
  while ((match = containerRegex.exec(contentWithoutCode)) !== null) {
    const containerTitle = stripLeadingEmojis(cleanMarkdownTipText(match[2] || ''))
    const containerBody = cleanMarkdownTipText(match[3] || '')
    if (containerBody) {
      const sentences = containerBody.split(/(?<=[.!?])\s+/).filter(Boolean)
      const concise = sentences.slice(0, 2).join(' ')
      addCandidate(concise, containerTitle, 'callout')
    }
  }

  // 2. GitHub-style Alerts (> [!TIP], > [!CAUTION], etc.)
  const alertRegex = /^>\s*\[!(TIP|IMPORTANT|WARNING|CAUTION|NOTE)\]\s*\r?\n((?:>.*(?:\r?\n|$))+)/gim
  while ((match = alertRegex.exec(contentWithoutCode)) !== null) {
    const body = match[2]
      .split(/\r?\n/)
      .map((l) => l.replace(/^>\s?/, '').trim())
      .join(' ')
    addCandidate(body, '', 'alert')
  }

  // 3. Line-by-line scan for highlight tables, definitions, and substantive QA concepts
  const lines = contentWithoutCode.split(/\r?\n/)
  let currentSection = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/)
    if (headingMatch) {
      currentSection = stripLeadingEmojis(
        cleanMarkdownTipText(
          headingMatch[2]
            .replace(/^\d+\\?\.\s*/, '')
            .replace(/^Capitolul\s+\d+:\s*/i, '')
            .replace(/^Pasul\s+\d+:\s*/i, '')
        )
      )
      continue
    }

    // 3a. Single-cell highlight tables: | 💡 ... | or | 📈 ... |
    if (line.startsWith('|') && line.endsWith('|') && !line.includes(':---') && !line.includes('---:')) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
      if (cells.length === 1 && cells[0].length >= 50) {
        const sentences = cleanMarkdownTipText(cells[0]).split(/(?<=[.!?])\s+/).filter(Boolean)
        addCandidate(sentences.slice(0, 2).join(' '), currentSection, 'highlight')
        continue
      }
    }

    // 3b. Bold concept bullets (* **Concept:** Explanation...)
    // Require concept length >= 5 chars (avoids 1-2 letter acronym breakdowns like "S:", "AA:", "LL:")
    // and explanation length >= 40 chars so every bullet tip is a genuine, self-contained insight.
    const boldBulletMatch = line.match(/^[*+-]\s+\*\*([^*]{5,60})\*\*:?\s+(.+)$/)
    if (boldBulletMatch) {
      const concept = stripLeadingEmojis(cleanMarkdownTipText(boldBulletMatch[1].replace(/:$/, '')))
      const explanation = cleanMarkdownTipText(boldBulletMatch[2])
      if (concept.length >= 5 && explanation.length >= 40) {
        addCandidate(`${concept}: ${explanation}`, currentSection, 'concept')
      }
      continue
    }

    // 3c. Explicit QA definitions or takeaways
    if (
      line.includes('**Definiție:**') ||
      line.includes('**Definition:**') ||
      line.includes('**Analiză QA:**') ||
      line.includes('**QA Analysis:**') ||
      line.includes('**Test de QA') ||
      line.includes('**Notă importantă:**') ||
      line.includes('**Important note:**')
    ) {
      addCandidate(line, currentSection, 'definition')
    }
  }

  return extracted
}

/**
 * Extracts tips dynamically from the currently rendered `.vp-doc` DOM on the client.
 */
export function extractTipsFromLiveDOM(docRoot, currentRoutePath = '', lang = 'ro') {
  if (!docRoot || typeof docRoot.querySelectorAll !== 'function') return []
  const normUrl = normalizeRouteUrl(currentRoutePath)
  if (isHomePageRoute(normUrl)) return []

  const h1El = docRoot.querySelector('h1')
  const docTitle = h1El
    ? stripLeadingEmojis(cleanMarkdownTipText(h1El.textContent || ''))
    : 'Current Lesson'
  const liveTips = []
  const seen = new Set()

  function pushLive(rawBody, fallbackTitle = '') {
    const { title, body } = splitTipTitleAndBody(rawBody, fallbackTitle)
    if (!body || body.length < 45 || body.length > 310) return
    const key = body.toLowerCase().slice(0, 80)
    if (seen.has(key)) return
    seen.add(key)

    const meta = classifyContentSource(normUrl, `${docTitle} ${title} ${body}`)
    const cleanTitle = title || (lang === 'en' ? 'Lesson Insight' : 'Sfat din Lecție')
    const fullText = `${cleanTitle}: ${body}`

    liveTips.push({
      id: `${normUrl}#dom-${liveTips.length + 1}`,
      lang,
      url: normUrl,
      courseSlug: meta.courseSlug,
      category: meta.category,
      mentor: meta.mentor,
      sourceTitle: docTitle,
      courseLabel: lang === 'en' ? meta.courseLabelEn : meta.courseLabelRo,
      tipTitle: cleanTitle,
      tipBody: body,
      kind: 'live-dom',
      text: fullText,
      ro: lang === 'ro' ? fullText : undefined,
      en: lang === 'en' ? fullText : undefined
    })
  }

  const callouts = docRoot.querySelectorAll('.custom-block')
  callouts.forEach((block) => {
    const titleEl = block.querySelector('.custom-block-title')
    const pEls = block.querySelectorAll('p:not(.custom-block-title)')
    const bodyText = Array.from(pEls.length ? pEls : block.querySelectorAll('p'))
      .map((p) => p.textContent || '')
      .join(' ')
    const sentences = cleanMarkdownTipText(bodyText).split(/(?<=[.!?])\s+/).filter(Boolean)
    if (sentences.length > 0) {
      pushLive(sentences.slice(0, 2).join(' '), titleEl ? titleEl.textContent : '')
    }
  })

  const listItems = docRoot.querySelectorAll('li')
  listItems.forEach((li) => {
    const strong = li.querySelector('strong')
    if (strong && li.textContent) {
      const strongTxt = cleanMarkdownTipText(strong.textContent)
      const fullTxt = cleanMarkdownTipText(li.textContent)
      if (strongTxt.length >= 5 && fullTxt.length >= 55 && fullTxt.length <= 290) {
        pushLive(fullTxt)
      }
    }
  })

  return liveTips
}

/**
 * Resolves the context-aware list of tips based on the user's current route.
 * On the Homepage, interleaves curated mentor tips and course tips from different tracks
 * so the user immediately sees diverse, high-quality tips across all courses!
 */
export function getContextualTipsForRoute({
  routePath = '/',
  lang = 'ro',
  extractedTips = [],
  liveDomTips = [],
  baseVaultTips = [],
  requestedScope = 'auto',
  categoryFilter = 'all'
}) {
  const normRoute = normalizeRouteUrl(routePath)
  const onHome = isHomePageRoute(normRoute)
  const routeMeta = classifyContentSource(normRoute, '')

  const langExtracted = extractedTips
    .filter((t) => t.lang === lang)
    .map((t) => {
      if (t.tipTitle && t.tipBody) return t
      const { title, body } = splitTipTitleAndBody(t.text || (lang === 'en' ? t.en : t.ro), t.sectionTitle)
      return {
        ...t,
        sourceTitle: stripLeadingEmojis(t.sourceTitle || ''),
        tipTitle: title || (lang === 'en' ? 'QA Insight' : 'Sfat Practic QA'),
        tipBody: body
      }
    })

  const formattedVault = baseVaultTips.map((t) => {
    const raw = lang === 'en' ? t.en : t.ro
    const { title, body } = splitTipTitleAndBody(raw, lang === 'en' ? 'Mentor Pro-Tip' : 'Sfat Mentor')
    return {
      ...t,
      lang,
      url: t.url || (lang === 'en' ? '/en/' : '/ro/'),
      courseSlug: t.courseSlug || 'vault',
      sourceTitle: stripLeadingEmojis(
        t.sourceTitle || (lang === 'en' ? 'QualiAdept Mentor Vault' : 'Seiful Mentorilor QualiAdept')
      ),
      courseLabel: t.courseLabel || (lang === 'en' ? 'Mentor Best Practices' : 'Best Practices Mentori'),
      tipTitle: title,
      tipBody: body,
      text: raw
    }
  })

  // Exact-page tips (when viewing a specific session or article)
  const exactPageTipsMap = new Map()
  for (const tip of langExtracted) {
    if (normalizeRouteUrl(tip.url) === normRoute) {
      exactPageTipsMap.set((tip.tipBody || tip.text).toLowerCase().slice(0, 75), tip)
    }
  }
  for (const domTip of liveDomTips) {
    const key = (domTip.tipBody || domTip.text).toLowerCase().slice(0, 75)
    if (!exactPageTipsMap.has(key)) {
      exactPageTipsMap.set(key, domTip)
    }
  }
  const pageTips = Array.from(exactPageTipsMap.values())

  // Course-level tips
  const courseTips = [
    ...pageTips,
    ...langExtracted.filter(
      (t) => t.courseSlug === routeMeta.courseSlug && normalizeRouteUrl(t.url) !== normRoute
    ),
    ...formattedVault.filter((t) => t.category === routeMeta.category)
  ]

  // Interleave tips across courses + mentor vault for the global "All LMS" pool
  // so the user gets rich variety instead of 20 tips from the same file in a row
  const interleavedAll = []
  const maxLen = Math.max(formattedVault.length, langExtracted.length)
  const step = 7 // prime-like stride across extracted files for topic diversity
  const usedExtracted = new Set()

  for (let i = 0; i < maxLen; i++) {
    if (i < formattedVault.length) {
      interleavedAll.push(formattedVault[i])
    }
    if (langExtracted.length > 0 && usedExtracted.size < langExtracted.length) {
      const idx = (i * step) % langExtracted.length
      if (!usedExtracted.has(idx)) {
        usedExtracted.add(idx)
        interleavedAll.push(langExtracted[idx])
      }
    }
  }
  for (let i = 0; i < langExtracted.length; i++) {
    if (!usedExtracted.has(i)) {
      interleavedAll.push(langExtracted[i])
    }
  }

  let activeScope = requestedScope
  if (onHome) {
    activeScope = 'all'
  } else if (requestedScope === 'auto') {
    if (pageTips.length > 0) {
      activeScope = 'page'
    } else if (courseTips.length > 0) {
      activeScope = 'course'
    } else {
      activeScope = 'all'
    }
  }

  let pool = interleavedAll
  if (activeScope === 'page' && pageTips.length > 0) {
    pool = pageTips
  } else if (activeScope === 'course' && courseTips.length > 0) {
    pool = courseTips
  }

  if (categoryFilter && categoryFilter !== 'all' && activeScope === 'all') {
    const filtered = pool.filter((t) => t.category === categoryFilter)
    if (filtered.length > 0) {
      pool = filtered
    }
  }

  return {
    onHome,
    activeScope,
    courseSlug: routeMeta.courseSlug,
    courseLabel: lang === 'en' ? routeMeta.courseLabelEn : routeMeta.courseLabelRo,
    pageTitle: pageTips[0]?.sourceTitle || routeMeta.courseLabelRo,
    counts: {
      page: pageTips.length,
      course: courseTips.length,
      all: interleavedAll.length
    },
    tips: pool
  }
}
