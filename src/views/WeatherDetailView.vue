<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { cityList } from '../data/cities'
import { fetchCurrentWeather } from '../services/weatherApi'

const route = useRoute()
const configStore = useConfigStore()
const city = ref(null)
const isLoading = ref(true)
const loadError = ref(null)

const displayTemp = computed(() => {
  const rawTemp = city.value.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

onMounted(async () => {
  const cityMeta = cityList.find((item) => item.id === route.params.cityId)
  if (!cityMeta) {
    isLoading.value = false
    return
  }

  try {
    const data = await fetchCurrentWeather(cityMeta.lat, cityMeta.lon)
    city.value = {
      id: cityMeta.id,
      name: cityMeta.name,
      temp: Math.round(data.main.temp),
      status: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    }
  } catch (error) {
    console.error('날씨 데이터 조회 실패:', error)
    loadError.value = '날씨 데이터를 가져오지 못했습니다. API 키를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div class="weather-app">
      <RouterLink to="/weather" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>

      <p v-if="isLoading" class="no-result">날씨 데이터를 불러오는 중입니다...</p>
      <p v-else-if="loadError" class="no-result">{{ loadError }}</p>
      <template v-else-if="city">
        <h1><span class="title-icon">📍</span> {{ city.name }} 상세 기상관측 정보</h1>
        <ul class="detail-list">
          <li><span>날씨 상태</span><strong>{{ city.status }}</strong></li>
          <li><span>현재 기온</span><strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong></li>
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
