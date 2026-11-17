---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  if (router?.go) {
    router.go('/en/articles/qa-automation-in-2029')
  } else {
    window.location.replace('/en/articles/qa-automation-in-2029')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/articles/qa-automation-in-2029">

<div style="padding: 3rem; text-align: center;">
  <p>Redirecting to <a href="/en/articles/qa-automation-in-2029">QA Automation in 2029: What Disappears, What Remains, and What Becomes More Valuable</a>...</p>
</div>
