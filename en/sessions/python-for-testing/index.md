---
layout: page
title: Redirecting to Course Syllabus
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.replace('/en/sessions/python-for-testing/syllabus.html')
  }
})
</script>

<meta http-equiv="refresh" content="0; url=/en/sessions/python-for-testing/syllabus.html">

<div style="padding: 3rem 1rem; text-align: center; font-family: sans-serif;">
  <p>Redirecting to <a href="/en/sessions/python-for-testing/syllabus.html">Course Syllabus</a>...</p>
</div>
