---
layout: page
title: Redirecționare către Cursuri
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.replace('/ro/')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/ro/">

<div style="padding: 3rem 1rem; text-align: center; font-family: sans-serif;">
  <p>Se redirecționează către <a href="/ro/">Catalogul de Cursuri</a>...</p>
</div>
