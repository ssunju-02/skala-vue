<script setup></script>

<template>
  <div class="page">
    <div class="weather-app">
      <h1><span class="title-icon">🚫</span> 404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 경로가 존재하지 않습니다. 주소를 다시 확인해 주세요.</p>
      <RouterLink to="/weather" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #eef1f8;
}

.weather-app {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  font-family: sans-serif;
  color: #222;
  text-align: center;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: #ffe3e3;
  font-size: 1.2rem;
}

p {
  color: #555;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  color: #3b5bdb;
  font-weight: bold;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
