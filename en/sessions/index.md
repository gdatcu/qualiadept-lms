---
layout: page
title: Redirecting to Courses
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.replace('/en/')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/">

<div style="padding: 3rem 1rem; text-align: center; font-family: sans-serif;">
  <p>Redirecting to <a href="/en/">Course Catalog</a>...</p>
</div>
