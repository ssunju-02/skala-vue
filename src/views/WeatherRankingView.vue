<script setup>
import { computed, onMounted, ref } from 'vue'
import { useConfigStore } from '../stores/configStore'
import {
  DEFAULT_WEATHER_LOCATIONS,
  fetchCurrentWeather,
  getAirQualityLevel,
  getWeatherErrorMessage,
} from '../services/weatherApi'
import InfraredWindMap from '../components/InfraredWindMap.vue'
import heroImage from '../assets/images/hero-ranking.jpg'

document.title = '오늘의 날씨 랭킹 | 오늘, 브리핑'
const heroImageStyle = `url(${heroImage})`
const configStore = useConfigStore()

const weather = ref([])
const isLoading = ref(true)
const loadError = ref('')

const loadAll = async () => {
  isLoading.value = true
  loadError.value = ''
  const results = await Promise.allSettled(DEFAULT_WEATHER_LOCATIONS.map(fetchCurrentWeather))
  weather.value = results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  const failed = results.find(({ status }) => status === 'rejected')
  if (failed) loadError.value = getWeatherErrorMessage(failed.reason)
  isLoading.value = false
}

onMounted(loadAll)

const hottest = computed(() =>
  [...weather.value].sort((a, b) => b.feelsLike - a.feelsLike).slice(0, 5),
)
const coldest = computed(() =>
  [...weather.value].sort((a, b) => a.feelsLike - b.feelsLike).slice(0, 5),
)
const cleanestAir = computed(() =>
  weather.value
    .filter((city) => Number.isFinite(city.airQualityIndex))
    .sort((a, b) => a.airQualityIndex - b.airQualityIndex)
    .slice(0, 5),
)
const rainiestObserved = computed(() =>
  weather.value
    .filter((city) => city.precipitation > 0)
    .sort((a, b) => b.precipitation - a.precipitation)
    .slice(0, 5),
)
const rainiestForecast = computed(() =>
  weather.value
    .filter((city) => Number.isFinite(city.precipitationForecast) && city.precipitationForecast > 0)
    .sort((a, b) => b.precipitationForecast - a.precipitationForecast)
    .slice(0, 5),
)

const rainBoard = computed(() => {
  if (rainiestObserved.value.length) {
    return {
      id: 'rain',
      icon: '☔',
      title: '비가 가장 많이 온 지역',
      items: rainiestObserved.value,
      format: (city) => `${city.precipitation.toFixed(1)}mm`,
      emptyText: '',
    }
  }
  if (rainiestForecast.value.length) {
    return {
      id: 'rain',
      icon: '🌦️',
      title: '오늘 비가 예상되는 지역',
      items: rainiestForecast.value,
      format: (city) => `${city.precipitationForecast.toFixed(1)}mm 예상`,
      emptyText: '',
    }
  }
  return {
    id: 'rain',
    icon: '☔',
    title: '비가 가장 많이 온 지역',
    items: [],
    format: () => '',
    emptyText: '오늘은 전국에 비 소식이 없어요 ☀️',
  }
})

const boards = computed(() => [
  {
    id: 'hot',
    icon: '🔥',
    title: '체감 기온 기준 가장 더운 지역',
    items: hottest.value,
    format: (city) => configStore.formatTemperature(city.feelsLike),
    emptyText: '날씨 데이터를 불러오지 못했어요.',
  },
  {
    id: 'cold',
    icon: '❄️',
    title: '체감 기온 기준 가장 추운 지역',
    items: coldest.value,
    format: (city) => configStore.formatTemperature(city.feelsLike),
    emptyText: '날씨 데이터를 불러오지 못했어요.',
  },
  {
    id: 'air',
    icon: '🍃',
    title: '공기 가장 좋은 지역',
    items: cleanestAir.value,
    format: (city) => getAirQualityLevel(city.airQualityIndex),
    emptyText: '공기질 정보를 아직 불러오지 못했어요.',
  },
])

const mapRegions = computed(() =>
  weather.value
    .map((city) => {
      const location = DEFAULT_WEATHER_LOCATIONS.find((loc) => loc.id === city.id)
      if (!location) return null
      return {
        id: city.id,
        name: city.name,
        lat: location.lat,
        lon: location.lon,
        temp: city.temp,
        windSpeed: city.windSpeed,
        windDirection: city.windDirection,
      }
    })
    .filter(Boolean),
)

const highlight = computed(() => {
  if (!hottest.value.length || !coldest.value.length) return ''
  const hot = hottest.value[0]
  const cold = coldest.value[0]
  return `오늘 전국에서 체감상 가장 더운 곳은 ${hot.name}(${configStore.formatTemperature(hot.feelsLike)}), 가장 추운 곳은 ${cold.name}(${configStore.formatTemperature(cold.feelsLike)})예요.`
})
</script>

<template>
  <main class="ranking-page">
    <header class="hero">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="eyebrow">WEATHER LEADERBOARD</p>
        <h1>오늘의 날씨 랭킹</h1>
        <p class="hero-copy">오늘 전국 지역별 날씨를 순위로 한눈에 비교해 보세요.</p>
      </div>
    </header>

    <div class="page-inner">
      <p v-if="highlight" class="highlight-banner">🏆 {{ highlight }}</p>

      <p v-if="isLoading" class="state-message" role="status">전국 날씨를 불러오는 중입니다…</p>
      <div v-else-if="loadError && !weather.length" class="error-result" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" @click="loadAll">다시 시도</button>
      </div>
      <div v-else class="board-grid">
        <section
          v-for="board in boards"
          :key="board.id"
          class="board panel"
          :aria-labelledby="`board-${board.id}`"
        >
          <div class="board-heading">
            <span class="board-icon" aria-hidden="true">{{ board.icon }}</span>
            <h2 :id="`board-${board.id}`">{{ board.title }}</h2>
          </div>
          <ol v-if="board.items.length" class="board-list">
            <li v-for="(city, index) in board.items" :key="city.id" class="board-row">
              <span class="board-rank" aria-hidden="true">{{
                index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1
              }}</span>
              <span class="board-city">{{ city.name }}</span>
              <strong class="board-value">{{ board.format(city) }}</strong>
            </li>
          </ol>
          <p v-else class="board-empty">{{ board.emptyText }}</p>
        </section>
      </div>
      <p v-if="!isLoading" class="ranking-notice">
        실시간 관측 데이터를 기준으로 하며, 재미로 참고해 주세요.
      </p>

      <section class="infrared-panel" aria-labelledby="wind-map-title">
        <div class="infrared-heading">
          <p class="infrared-eyebrow">LIVE WIND FLOW</p>
          <h2 id="wind-map-title">전국 바람 흐름 지도</h2>
          <p class="infrared-copy">
            지역별 기온은 색으로, 바람이 흘러가는 방향은 화살표로, 실시간 강수 레이더는 움직이는
            이미지로 표시했어요. 바람 화살표는 관측값 기준 근사치이고, 레이더는 RainViewer의 실시간
            관측 데이터예요.
          </p>
        </div>
        <InfraredWindMap :regions="mapRegions" />

        <div class="wind-rain-section" :aria-labelledby="'board-rain'">
          <div class="board-heading">
            <span class="board-icon" aria-hidden="true">{{ rainBoard.icon }}</span>
            <h2 id="board-rain">{{ rainBoard.title }}</h2>
          </div>
          <ol v-if="rainBoard.items.length" class="board-list">
            <li v-for="(city, index) in rainBoard.items" :key="city.id" class="board-row">
              <span class="board-rank" aria-hidden="true">{{
                index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1
              }}</span>
              <span class="board-city">{{ city.name }}</span>
              <strong class="board-value">{{ rainBoard.format(city) }}</strong>
            </li>
          </ol>
          <p v-else class="board-empty">{{ rainBoard.emptyText }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.ranking-page {
  width: 100%;
  padding-bottom: 72px;
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
  min-height: 360px;
  overflow: hidden;
}
.hero-media {
  position: absolute;
  inset: 0;
  background-image: v-bind(heroImageStyle);
  background-position: center;
  background-size: cover;
}
.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 13, 9, 0.05) 0%,
    rgba(15, 13, 9, 0.35) 65%,
    rgba(15, 13, 9, 0.55) 100%
  );
}
.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 max(20px, calc((100% - 1120px) / 2)) 44px;
}
.eyebrow {
  margin: 0 0 9px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}
h1 {
  margin: 0 0 12px;
  color: #fff;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.1;
  letter-spacing: -0.045em;
  font-weight: 700;
}
.hero-copy {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
}

.highlight-banner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 24px;
  padding: 14px 20px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: var(--blue-100);
  font-size: 0.92rem;
  font-weight: 600;
}

.state-message {
  display: grid;
  min-height: 200px;
  margin: 0;
  place-items: center;
  color: var(--muted);
}
.error-result {
  display: grid;
  min-height: 200px;
  place-items: center;
  gap: 10px;
  text-align: center;
}
.error-result p {
  margin: 0;
  color: var(--muted);
}
.error-result button {
  padding: 9px 16px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: var(--blue-700);
  font-weight: 600;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.board {
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow);
}
.board-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.board-icon {
  font-size: 1.4rem;
}
.board-heading h2 {
  margin: 0;
  color: var(--ink);
  font-size: 1.1rem;
  font-weight: 700;
}
.board-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.board-row {
  display: grid;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 2px;
  border-top: 1px solid var(--line);
}
.board-row:first-child {
  border-top: 0;
}
.board-rank {
  font-size: 1rem;
  text-align: center;
}
.board-city {
  color: var(--ink);
  font-size: 0.92rem;
  font-weight: 600;
}
.board-value {
  color: var(--blue-700);
  font-size: 0.92rem;
  font-weight: 700;
}
.board-empty {
  display: grid;
  min-height: 100px;
  gap: 8px;
  margin: 0;
  place-items: center;
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
}
.ranking-notice {
  margin: 0 0 40px;
  color: var(--muted);
  font-size: 0.72rem;
  text-align: center;
}

.infrared-panel {
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
  box-shadow: var(--shadow);
  scroll-margin-top: 90px;
}
.infrared-heading {
  margin-bottom: 18px;
}
.infrared-eyebrow {
  margin: 0 0 8px;
  color: var(--blue-700);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}
.infrared-heading h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  font-weight: 700;
}
.infrared-copy {
  max-width: 640px;
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.6;
}
.wind-rain-section {
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

@media (max-width: 760px) {
  .board-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .page-inner {
    width: min(100% - 24px, 1120px);
  }
  .hero {
    min-height: 280px;
  }
}
</style>
