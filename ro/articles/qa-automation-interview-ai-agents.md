---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/ro/articles/interviu-qa-automation-era-agentilor-ai')
  } else {
    window.location.replace('/ro/articles/interviu-qa-automation-era-agentilor-ai')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/articles/interviu-qa-automation-era-agentilor-ai">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecționare către <a href="/ro/articles/interviu-qa-automation-era-agentilor-ai">Nu mai contează dacă știi să scrii testul. Contează dacă vezi de ce testul scris de agent nu verifică nimic.</a>...</p>
</div>
