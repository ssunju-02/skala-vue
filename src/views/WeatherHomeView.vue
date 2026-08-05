<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import KoreaWeatherMap from '../components/KoreaWeatherMap.vue'
import heroImage from '../assets/images/hero-waves.jpg'
import {
  DEFAULT_WEATHER_LOCATIONS,
  KOREA_CITY_DIRECTORY,
  fetchCurrentWeather,
  getWeatherErrorMessage,
} from '../services/weatherApi'
import { useFavoritesStore } from '../stores/favoritesStore'

const MAX_SEARCH_RESULTS = 20
const SEARCH_DEBOUNCE_MS = 350

const router = useRouter()
const favoritesStore = useFavoritesStore()

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')
const isSearchingMore = ref(false)

const searchQuery = ref('')
const selectedCityInfo = ref(null)
document.title = '지역별 날씨 현황 | 오늘, 브리핑'
const heroImageStyle = `url(${heroImage})`

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const matched = query
    ? weatherList.value.filter((weather) => weather.name.includes(query))
    : weatherList.value

  return [...matched].sort((a, b) => {
    const aIndex = favoritesStore.favoriteIds.indexOf(a.id)
    const bIndex = favoritesStore.favoriteIds.indexOf(b.id)
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
})

const selectedMessage = computed(() =>
  selectedCityInfo.value
    ? `${selectedCityInfo.value.name}이 선택되었습니다.`
    : '지역을 선택하면 여기에 표시됩니다.',
)

watch(selectedCityInfo, (cityInfo) => {
  if (cityInfo) {
    console.log('상태바 문구가 변경되었습니다:', selectedMessage.value)
  }
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

const loadWeather = async () => {
  isLoading.value = true
  loadError.value = ''
  const results = await Promise.allSettled(DEFAULT_WEATHER_LOCATIONS.map(fetchCurrentWeather))
  weatherList.value = results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  const failed = results.find(({ status }) => status === 'rejected')
  if (failed) loadError.value = getWeatherErrorMessage(failed.reason)
  isLoading.value = false
}

onMounted(loadWeather)

let searchTimer = null

const searchMoreCities = async (query) => {
  const loadedIds = new Set(weatherList.value.map((item) => item.id))
  const matches = KOREA_CITY_DIRECTORY
    .filter((city) => city.name.includes(query) && !loadedIds.has(city.id))
    .slice(0, MAX_SEARCH_RESULTS)

  if (!matches.length) return

  isSearchingMore.value = true
  const results = await Promise.allSettled(matches.map(fetchCurrentWeather))
  const fetched = results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  weatherList.value = [...weatherList.value, ...fetched]
  isSearchingMore.value = false
}

watch(searchQuery, (query) => {
  if (searchTimer) clearTimeout(searchTimer)
  const trimmed = query.trim()
  if (!trimmed) return
  searchTimer = setTimeout(() => searchMoreCities(trimmed), SEARCH_DEBOUNCE_MS)
})
</script>

<template>
  <main class="weather-page">
    <header class="hero">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-symbol" aria-hidden="true">🌤️</div>
      <div class="hero-inner">
        <p class="eyebrow">TODAY'S WEATHER</p>
        <h1>지역별 날씨 현황</h1>
        <p class="hero-description">오늘 우리 도시의 날씨를 한눈에 확인해 보세요.</p>
        <p class="hero-hint"><span aria-hidden="true">☆</span> 자주 확인하는 도시는 별 아이콘을 눌러 즐겨찾기에 추가해 보세요. 통합 홈에서 바로 모아볼 수 있어요.</p>
      </div>
    </header>

    <div class="page-inner">
    <BaseDashboardCard>
      <section class="weather-section" aria-labelledby="weather-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CITY FORECAST</p>
            <h2 id="weather-title">오늘의 날씨</h2>
          </div>
          <span class="city-count">총 {{ filteredWeatherList.length }}개 도시</span>
        </div>

        <div class="weather-search">
          <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
          <p v-if="isSearchingMore" class="search-status" role="status">전국에서 더 찾아보는 중…</p>
        </div>

        <p v-if="isLoading" class="state-message" role="status">실시간 날씨를 불러오는 중입니다…</p>
        <div v-else-if="filteredWeatherList.length" class="weather-grid">
          <WeatherCard
            v-for="weather in filteredWeatherList"
            :key="weather.id"
            :weather="weather"
            :selected="selectedCityInfo?.id === weather.id"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>
        <div v-else-if="loadError" class="error-result" role="alert">
          <p>{{ loadError }}</p>
          <button type="button" @click="loadWeather">다시 시도</button>
        </div>
        <p v-else class="empty-result" role="status">
          검색 결과와 일치하는 도시가 없습니다.
        </p>
        <p v-if="loadError && weatherList.length" class="partial-error" role="status">일부 도시 정보를 불러오지 못했습니다.</p>
      </section>
    </BaseDashboardCard>

    <KoreaWeatherMap />

    <aside class="status-bar" aria-live="polite">
      <span class="status-dot" aria-hidden="true"></span>
      {{ selectedMessage }}
    </aside>
    </div>
  </main>
</template>

<style scoped>
.weather-page {
  width: 100%;
  padding-bottom: 64px;
}

.page-inner {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding-top: 32px;
}

.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 340px;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  background-image: v-bind(heroImageStyle);
  background-position: center 55%;
  background-size: cover;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 13, 9, .02) 0%, rgba(15, 13, 9, .28) 65%, rgba(15, 13, 9, .48) 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 max(20px, calc((100% - 1120px) / 2)) 44px;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--blue-700);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.hero-inner .eyebrow {
  color: rgba(255, 255, 255, .85);
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 12px;
  color: #fff;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.1;
  letter-spacing: -0.045em;
  font-weight: 700;
}

.hero-description {
  margin-bottom: 0;
  color: rgba(255, 255, 255, .85);
  font-size: 1.05rem;
}

.hero-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 14px 0 0;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 999px;
  color: #fff;
  background: rgba(255, 255, 255, .12);
  backdrop-filter: blur(6px);
  font-size: .82rem;
  font-weight: 600;
}

.hero-symbol {
  position: absolute;
  top: 28px;
  right: max(20px, calc((100% - 1120px) / 2));
  z-index: 1;
  display: grid;
  width: 84px;
  height: 84px;
  flex: 0 0 auto;
  border: 1px dashed rgba(255, 255, 255, .55);
  border-radius: 22px;
  place-items: center;
  font-size: 2.8rem;
  background: rgba(255, 255, 255, .1);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow);
}

.weather-section {
  width: 100%;
}

.weather-search {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.search-status {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin-bottom: 0;
  font-size: 1.8rem;
  letter-spacing: -0.035em;
  font-weight: 700;
}

.city-count {
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--blue-700);
  background: var(--blue-100);
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.empty-result {
  margin: 0;
  padding: 42px 24px;
  border: 1px dashed var(--line);
  border-radius: 20px;
  text-align: center;
  color: var(--muted);
  background: var(--surface);
}

.state-message,
.error-result {
  margin: 0;
  padding: 42px 24px;
  border: 1px dashed var(--line);
  border-radius: 20px;
  text-align: center;
  color: var(--muted);
  background: var(--surface);
}

.error-result { border-color: #f0c4c0; color: #b3453d; background: #fff5f4; }
.error-result p { margin-bottom: 14px; }
.error-result button { padding: 9px 16px; border: 0; border-radius: 999px; color: #fff; background: var(--blue-700); font-weight: 600; }
.partial-error { margin: 14px 0 0; color: #a17a4e; font-size: .8rem; }

.status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 15px 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  font-size: 0.9rem;
  color: var(--muted);
  background: var(--surface);
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34a670;
  box-shadow: 0 0 0 5px rgba(52, 166, 112, 0.13);
}

@media (max-width: 820px) {
  .weather-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-symbol {
    width: 96px;
    height: 96px;
    font-size: 3rem;
  }
}

@media (max-width: 560px) {
  .page-inner {
    width: min(100% - 24px, 1120px);
  }

  .hero {
    min-height: 260px;
  }

  .hero-symbol {
    display: none;
  }

  .hero-description {
    font-size: 0.92rem;
  }

  .weather-grid { grid-template-columns: 1fr; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 12px; }
}
</style>
