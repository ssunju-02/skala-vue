<script setup>
import UnitToggler from './components/UnitToggler.vue'
import WeatherChatbot from './components/WeatherChatbot.vue'
</script>

<template>
  <div class="app-shell">
    <nav class="app-nav" aria-label="주요 메뉴">
      <RouterLink class="brand" to="/">오늘, 브리핑</RouterLink>
      <div class="nav-actions">
        <div class="nav-links">
          <RouterLink to="/">통합 홈</RouterLink>
          <RouterLink to="/weather">날씨</RouterLink>
          <RouterLink to="/ranking">날씨 랭킹</RouterLink>
          <RouterLink to="/stocks">주식 시세</RouterLink>
          <RouterLink class="subscribe-link" to="/subscribe">구독하기</RouterLink>
        </div>
        <UnitToggler />
      </div>
    </nav>
    <RouterView />
    <WeatherChatbot />
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; }
.app-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px max(20px, calc((100% - 1120px) / 2));
  border-bottom: 1px solid rgba(22, 20, 15, 0.08);
  background: rgba(251, 248, 241, 0.78);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}
.brand { font-weight: 700; font-size: .95rem; letter-spacing: -.01em; color: var(--ink); text-decoration: none; }
.nav-links { display: flex; align-items: center; gap: 26px; }
.nav-actions { display: flex; align-items: center; gap: 20px; }
.nav-links a { padding: 4px 0; color: var(--muted); text-decoration: none; font-size: .87rem; font-weight: 500; transition: color .2s ease; }
.nav-links a:hover { color: var(--ink); }
.nav-links a.router-link-active { color: var(--ink); font-weight: 600; }
.nav-links .subscribe-link { padding: 7px 16px; border-radius: 999px; color: #fff; background: var(--blue-700); font-weight: 600; transition: background .2s ease; }
.nav-links .subscribe-link:hover,
.nav-links .subscribe-link.router-link-active { color: #fff; background: var(--blue-700-hover); }
@media (max-width: 720px) { .app-nav { align-items: flex-start; flex-direction: column; gap: 12px; } .nav-actions { width: 100%; justify-content: space-between; flex-wrap: wrap; } .nav-links { flex-wrap: wrap; gap: 16px; } }
</style>
