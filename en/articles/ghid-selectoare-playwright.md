---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/en/articles/playwright-selector-guide')
  } else {
    window.location.replace('/en/articles/playwright-selector-guide')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/articles/playwright-selector-guide">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecting to <a href="/en/articles/playwright-selector-guide">Complete Guide: Writing Resilient Selectors in Playwright</a>...</p>
</div>
