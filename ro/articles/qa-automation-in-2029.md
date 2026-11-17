---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/ro/articles/qa-automation-2029-viitor')
  } else {
    window.location.replace('/ro/articles/qa-automation-2029-viitor')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/articles/qa-automation-2029-viitor">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecționare către <a href="/ro/articles/qa-automation-2029-viitor">QA Automation în 2029: ce dispare, ce rămâne și ce devine mai valoros</a>...</p>
</div>
