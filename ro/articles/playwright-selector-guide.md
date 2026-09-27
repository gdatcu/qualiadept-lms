---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/ro/articles/ghid-selectoare-playwright')
  } else {
    window.location.replace('/ro/articles/ghid-selectoare-playwright')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/articles/ghid-selectoare-playwright">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecționare către <a href="/ro/articles/ghid-selectoare-playwright">Ghid Complet: Cum să alegi cele mai robuste selectoare în Playwright</a>...</p>
</div>
