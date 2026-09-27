---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/en/articles/romanian-cnp-qa-perspective')
  } else {
    window.location.replace('/en/articles/romanian-cnp-qa-perspective')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/articles/romanian-cnp-qa-perspective">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecting to <a href="/en/articles/romanian-cnp-qa-perspective">Romanian National ID (CNP) from a QA Perspective</a>...</p>
</div>
