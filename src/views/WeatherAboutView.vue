<script setup></script>

<template>
  <div class="page">
    <div class="weather-app">
      <h1><span class="title-icon">ℹ️</span> 날씨 대시보드 소개</h1>
      <p>
        이 서비스는 도시별 실시간(Mock) 날씨 정보를 검색하고, 카드를 눌러 지역별 상세 기상관측
        정보를 확인할 수 있는 대시보드입니다. Vue Router의 지연 로딩과 동적 경로 매칭을 활용해
        각 화면을 독립된 페이지로 구성했습니다.
      </p>
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
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: #dbe7ff;
  font-size: 1.2rem;
}

p {
  line-height: 1.6;
  color: #444;
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
