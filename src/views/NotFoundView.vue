<script setup>
document.title = '페이지를 찾을 수 없음 | SKALA Weather'
</script>

<template><main class="not-found"><p class="code">404</p><h1>페이지를 찾을 수 없습니다.</h1><RouterLink to="/">날씨 홈으로 이동</RouterLink></main></template>

<style scoped>
.not-found { width: min(820px, calc(100% - 40px)); margin: 0 auto; padding: 120px 0; color: var(--ink); text-align: center; }
.code { margin: 0; color: var(--blue-700); font-size: 5rem; font-weight: 700; letter-spacing: -.03em; }
.not-found h1 { margin: 8px 0 24px; font-size: 1.4rem; font-weight: 600; }
.not-found a { display: inline-flex; padding: 10px 22px; border-radius: 999px; color: #fff; background: var(--blue-700); font-weight: 600; text-decoration: none; }
</style>
