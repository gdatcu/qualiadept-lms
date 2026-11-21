---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/en/articles/qa-automation-interview-ai-agents')
  } else {
    window.location.replace('/en/articles/qa-automation-interview-ai-agents')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/articles/qa-automation-interview-ai-agents">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecting to <a href="/en/articles/qa-automation-interview-ai-agents">Knowing How to Write the Test No Longer Matters. Seeing Why the Agent's Test Checks Nothing Does.</a>...</p>
</div>
