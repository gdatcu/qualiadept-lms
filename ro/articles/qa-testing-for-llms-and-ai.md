---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/ro/articles/ghid-testare-qa-llm-ai')
  } else {
    window.location.replace('/ro/articles/ghid-testare-qa-llm-ai')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/articles/ghid-testare-qa-llm-ai">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecționare către <a href="/ro/articles/ghid-testare-qa-llm-ai">Ghidul Complet și Extins pentru Testarea QA a Modelelor LLM și AI</a>...</p>
</div>
