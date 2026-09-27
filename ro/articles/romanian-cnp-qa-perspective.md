---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/ro/articles/cnp-din-perspectiva-qa')
  } else {
    window.location.replace('/ro/articles/cnp-din-perspectiva-qa')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/articles/cnp-din-perspectiva-qa">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecționare către <a href="/ro/articles/cnp-din-perspectiva-qa">CNP-ul din Perspectiva unui Software QA</a>...</p>
</div>
