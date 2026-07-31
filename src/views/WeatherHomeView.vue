<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { cityList } from '../data/cities'
import { fetchCurrentWeather } from '../services/weatherApi'

const router = useRouter()

// 모든 반응형 데이터는 WeatherHomeView가 유지한다.
const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref(null)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

onMounted(async () => {
  try {
    weatherList.value = await Promise.all(
      cityList.map(async (city) => {
        const data = await fetchCurrentWeather(city.lat, city.lon)
        return {
          id: city.id,
          name: city.name,
          temp: Math.round(data.main.temp),
          status: data.weather[0].description,
        }
      }),
    )
  } catch (error) {
    console.error('날씨 데이터 조회 실패:', error)
    loadError.value = '날씨 데이터를 가져오지 못했습니다. API 키를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
})

const filteredWeatherList = computed(() =>
  weatherList.value.filter((city) => city.name.includes(searchQuery.value)),
)

const onUpdateQuery = (value) => {
  searchQuery.value = value
}

const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName) => {
  const city = weatherList.value.find((item) => item.name === cityName)
  if (city) {
    router.push('/weather/' + city.id)
  }
}

watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링 중입니다`,
  )
})
</script>

<template>
  <div class="page">
    <div class="weather-app">
      <h1><span class="title-icon">🧭</span> 과제 4: 날씨 (Router)</h1>

      <RouterLink to="/weather/about" class="about-link">서비스 소개 보기</RouterLink>

      <BaseDashboardCard tone="search">
        <template #header>🔍 도시 검색 (한글 즉시 동기화)</template>
        <SearchBar :search-query="searchQuery" @update-query="onUpdateQuery" />
        <p class="search-result">검색 중인 도시: {{ searchQuery }}</p>
      </BaseDashboardCard>

      <BaseDashboardCard tone="list">
        <template #header>🏙️ 지역별 날씨 현황</template>
        <p v-if="isLoading" class="no-result">날씨 데이터를 불러오는 중입니다...</p>
        <p v-else-if="loadError" class="no-result">{{ loadError }}</p>
        <ul v-else-if="filteredWeatherList.length > 0" class="weather-list">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </ul>
        <p v-else class="no-result">검색 결과가 일치하는 도시가 없습니다.</p>
      </BaseDashboardCard>

      <div class="status-bar">{{ selectedCityInfo }}</div>
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

.about-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #3b5bdb;
  font-weight: bold;
  text-decoration: none;
}

.about-link:hover {
  text-decoration: underline;
}

.search-result {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  color: #555;
}

.weather-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.no-result {
  text-align: center;
  padding: 1.5rem 0;
  color: #777;
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
