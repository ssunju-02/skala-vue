<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// TODO: 실제 API 연동 전까지 사용하는 임시 Mock Data
const mockCityList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, windSpeed: 2.4 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 78, windSpeed: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 62, windSpeed: 4.0 },
]

const route = useRoute()
const city = ref(null)

onMounted(() => {
  city.value = mockCityList.find((item) => item.id === route.params.cityId) ?? null
})
</script>

<template>
  <div class="page">
    <div class="weather-app">
      <RouterLink to="/weather" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>

      <template v-if="city">
        <h1><span class="title-icon">📍</span> {{ city.name }} 상세 기상관측 정보</h1>
        <ul class="detail-list">
          <li><span>날씨 상태</span><strong>{{ city.status }}</strong></li>
          <li><span>현재 기온</span><strong>{{ city.temp }}℃</strong></li>
          <li><span>습도</span><strong>{{ city.humidity }}%</strong></li>
          <li><span>풍속</span><strong>{{ city.windSpeed }}m/s</strong></li>
        </ul>
      </template>
      <p v-else class="no-result">
        '{{ route.params.cityId }}'에 해당하는 도시 정보를 찾을 수 없습니다.
      </p>
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

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #3b5bdb;
  font-weight: bold;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
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

.detail-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.8rem;
}

.detail-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
  border-radius: 10px;
  background: #eef4ff;
  font-size: 1rem;
}

.no-result {
  text-align: center;
  padding: 1.5rem 0;
  color: #777;
}
</style>
