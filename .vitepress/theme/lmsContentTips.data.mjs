import { createContentLoader } from 'vitepress'
import { extractTipsFromMarkdown } from './lmsTipsExtractor.mjs'

// VitePress Build-Time & HMR Data Loader
// Automatically watches all markdown files in ro/ and en/
export default createContentLoader(['ro/**/*.md', 'en/**/*.md'], {
  includeSrc: true,
  transform(rawData) {
    const allTips = []
    for (const page of rawData) {
      if (!page.src || !page.url) continue
      const pageTips = extractTipsFromMarkdown(page.src, page.url)
      allTips.push(...pageTips)
    }
    return allTips
  }
})
