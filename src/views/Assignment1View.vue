<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchKeyword = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

const onSearchInput = (event) => {
  searchKeyword.value = event.target.value
}

const selectCity = (cityName) => {
  statusMessage.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="page">
    <div class="weather-app">
      <h1><span class="title-icon">☁️</span> 과제 1: 날씨 (Mockup)</h1>

      <section class="search-section">
        <h2>🔍 도시 검색</h2>
        <input
          type="text"
          placeholder="검색할 도시 이름 입력"
          :value="searchKeyword"
          @input="onSearchInput"
        />
        <p class="search-result">검색 중인 도시: {{ searchKeyword }}</p>
      </section>

      <section class="weather-section">
        <h2>🏙️ 지역별 날씨 현황</h2>
        <ul class="weather-list">
          <li
            v-for="city in weatherList"
            :key="city.id"
            class="weather-card"
            @click="selectCity(city.name)"
          >
            <div class="card-top">
              <span class="city-name">{{ city.name }} ({{ city.status }})</span>
              <button type="button" @click.stop="showDetail(city.name, city.status)">
                상세보기
              </button>
            </div>
            <p class="temp">현재 기온: {{ city.temp }}℃</p>
            <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
            <span v-else class="badge cool">💨 선선함 (25도 미만)</span>
          </li>
        </ul>
      </section>

      <div class="status-bar">{{ statusMessage }}</div>
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
  max-width: 480px;
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

h2 {
  font-size: 1.05rem;
  margin-bottom: 0.8rem;
}

.search-section {
  background: #f5f6fa;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.5rem;
}

.search-section input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  font-size: 1rem;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.search-result {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  color: #555;
}

.weather-section {
  background: #eef4ff;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.5rem;
}

.weather-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.weather-card {
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 1.1rem 1.3rem;
  cursor: pointer;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.weather-card:hover {
  background: #fafbff;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.city-name {
  font-weight: bold;
  font-size: 1.05rem;
}

.card-top button {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border: 1px solid #999;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
}

.card-top button:hover {
  background: #eee;
}

.temp {
  margin: 0.5rem 0;
  color: #444;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #fff;
}

.badge.hot {
  background: #e74c3c;
}

.badge.cool {
  background: #3498db;
}

.status-bar {
  padding: 0.8rem 1rem;
  border-radius: 10px;
  background: #e6f6ea;
  color: #2e7d32;
  text-align: center;
  font-size: 0.95rem;
}
</style>
