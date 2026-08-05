<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { STOCK_MARKETS, fetchStockSeries } from '../services/stockApi'
import { TAROT_CARDS } from '../data/tarotCards'
import { fetchDailyQuote } from '../services/quoteApi'
import { useConfigStore } from '../stores/configStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import heroImage from '../assets/images/hero-ocean.jpg'
import {
  ALL_WEATHER_LOCATIONS,
  fetchCurrentWeather,
  getAirQualityLevel,
  getWeatherErrorMessage,
  WEATHER_CITIES,
} from '../services/weatherApi'

document.title = '오늘, 브리핑'
const configStore = useConfigStore()
const favoritesStore = useFavoritesStore()

const today = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

const weather = ref([])
const isWeatherLoading = ref(true)
const weatherError = ref('')
const heroWeather = computed(() => weather.value.find(({ id }) => id === 'city_01') ?? weather.value[0])
const heroHeadlineFallback = computed(() => (isWeatherLoading.value ? '서울 날씨를 불러오는 중' : '날씨 정보를 불러오지 못했습니다'))
const heroImageStyle = `url(${heroImage})`
const weatherIcon = {
  맑음: '☀️',
  비: '🌧️',
  구름: '☁️',
  눈: '🌨️',
  안개: '🌫️',
}

const loadWeather = async () => {
  isWeatherLoading.value = true
  weatherError.value = ''
  const results = await Promise.allSettled(WEATHER_CITIES.map(fetchCurrentWeather))
  weather.value = results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  const failed = results.find(({ status }) => status === 'rejected')
  if (failed) weatherError.value = getWeatherErrorMessage(failed.reason)
  isWeatherLoading.value = false
}

onMounted(loadWeather)

const favoriteCities = computed(() => favoritesStore.favoriteIds
  .map((id) => ALL_WEATHER_LOCATIONS.find((location) => location.id === id))
  .filter(Boolean))

const favoriteWeather = ref([])
const isFavoriteWeatherLoading = ref(true)

const loadFavoriteWeather = async () => {
  if (!favoriteCities.value.length) {
    favoriteWeather.value = []
    isFavoriteWeatherLoading.value = false
    return
  }
  isFavoriteWeatherLoading.value = true
  const results = await Promise.allSettled(favoriteCities.value.map(fetchCurrentWeather))
  favoriteWeather.value = results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  isFavoriteWeatherLoading.value = false
}

onMounted(loadFavoriteWeather)
watch(() => favoritesStore.favoriteIds, loadFavoriteWeather)

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})
const stocks = ref(STOCK_MARKETS.slice(0, 3).map((market) => ({
  ...market,
  value: '—',
  change: '—',
  up: null,
  source: 'loading',
})))
const marketNotice = computed(() =>
  stocks.value.some(({ source }) => source === 'demo')
    ? 'API 연결 실패로 참고용 시세를 표시하고 있습니다.'
    : 'Finnhub 미국 주식 현재가이며 투자 참고용입니다.',
)

onMounted(async () => {
  await Promise.all(stocks.value.map(async (stock) => {
    const result = await fetchStockSeries(stock)
    const latest = result.series.at(-1)?.value
    const previous = result.series.at(-2)?.value
    const percentChange = result.percentChange ?? ((latest - previous) / previous) * 100

    stock.value = currencyFormatter.format(latest)
    stock.change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`
    stock.up = percentChange >= 0
    stock.source = result.source
  }))
})

const CARD_BACK_COUNT = 6

const todayCard = ref(null)

const drawCard = () => {
  todayCard.value = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)]
}

const resetCard = () => {
  todayCard.value = null
}

const todayQuote = ref(null)
const isQuoteLoading = ref(true)
const quoteError = ref('')

const loadQuote = async () => {
  isQuoteLoading.value = true
  quoteError.value = ''
  try {
    todayQuote.value = await fetchDailyQuote()
  } catch {
    quoteError.value = '명언을 불러오지 못했어요.'
  } finally {
    isQuoteLoading.value = false
  }
}

onMounted(loadQuote)

let quoteRefreshTimer
onMounted(() => {
  quoteRefreshTimer = setInterval(loadQuote, 60 * 1000)
})
onUnmounted(() => clearInterval(quoteRefreshTimer))
</script>

<template>
  <main class="dashboard-page">
    <header class="dashboard-hero">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="date-label">{{ today }}</p>
        <h1 v-if="heroWeather">현재 {{ heroWeather.name }}의<br><span>체감온도는 {{ configStore.formatTemperature(heroWeather.feelsLike) }}</span></h1>
        <h1 v-else>{{ heroHeadlineFallback }}</h1>
        <p class="hero-copy">뉴스와 날씨, 주요 시세를 한 화면에 모았습니다.</p>
      </div>
    </header>

    <div class="page-inner">
    <section class="score-strip" aria-label="오늘의 핵심 정보">
      <div class="score-item">
        <span class="score-ring" aria-hidden="true">{{ heroWeather ? (weatherIcon[heroWeather.status] ?? '🌤️') : '🌡️' }}</span>
        <p class="score-label">{{ heroWeather?.name ?? '서울' }}</p>
        <strong class="score-value">{{ heroWeather ? `${configStore.formatTemperature(heroWeather.temp)} ${heroWeather.status}` : '—' }}</strong>
      </div>
      <div class="score-item">
        <span class="score-ring" aria-hidden="true">🍃</span>
        <p class="score-label">공기질</p>
        <strong class="score-value">{{ heroWeather ? getAirQualityLevel(heroWeather.airQualityIndex) : '—' }}</strong>
      </div>
      <div class="score-item">
        <span class="score-ring" aria-hidden="true">📈</span>
        <p class="score-label">{{ stocks[0].symbol }}</p>
        <strong class="score-value" :class="stocks[0].up === false ? 'negative' : 'positive'">{{ stocks[0].change }}</strong>
      </div>
      <div class="score-item">
        <span class="score-ring" aria-hidden="true">☔</span>
        <p class="score-label">최근 강수</p>
        <strong class="score-value">{{ heroWeather ? `${heroWeather.precipitation.toFixed(1)} mm` : '—' }}</strong>
      </div>
    </section>

    <div class="dashboard-grid">
      <div class="main-stack">
        <section class="panel news-panel tarot-panel" aria-labelledby="tarot-title">
          <div class="panel-heading">
            <div><p class="eyebrow">TODAY'S TAROT</p><h2 id="tarot-title">오늘의 타로</h2></div>
          </div>
          <div v-if="!todayCard" class="tarot-spread" role="group" aria-label="카드를 눌러 오늘의 타로를 뽑아보세요">
            <button
              v-for="n in CARD_BACK_COUNT"
              :key="n"
              type="button"
              class="tarot-back"
              aria-label="타로 카드 뽑기"
              @click="drawCard"
            >
              <svg viewBox="0 0 62 92" class="tarot-back-art" aria-hidden="true">
                <rect x="4" y="4" width="54" height="84" rx="9" fill="none" stroke="currentColor" stroke-width="1.1" />
                <rect x="8.5" y="8.5" width="45" height="75" rx="6" fill="none" stroke="currentColor" stroke-width=".6" opacity=".65" />
                <rect x="29.3" y="11.3" width="3.4" height="3.4" fill="currentColor" transform="rotate(45 31 13)" />
                <rect x="29.3" y="75.3" width="3.4" height="3.4" fill="currentColor" transform="rotate(45 31 77)" />
                <rect x="10.6" y="11.6" width="2.8" height="2.8" fill="currentColor" opacity=".75" transform="rotate(45 12 13)" />
                <rect x="47.6" y="11.6" width="2.8" height="2.8" fill="currentColor" opacity=".75" transform="rotate(45 49 13)" />
                <rect x="10.6" y="75.6" width="2.8" height="2.8" fill="currentColor" opacity=".75" transform="rotate(45 12 77)" />
                <rect x="47.6" y="75.6" width="2.8" height="2.8" fill="currentColor" opacity=".75" transform="rotate(45 49 77)" />
                <line x1="31" y1="21" x2="31" y2="69" stroke="currentColor" stroke-width=".8" opacity=".85" />
                <circle cx="31" cy="33" r="4.2" fill="none" stroke="currentColor" stroke-width=".8" opacity=".9" />
                <circle cx="31" cy="46" r="3.4" fill="currentColor" />
                <circle cx="31" cy="59" r="4.2" fill="none" stroke="currentColor" stroke-width=".8" opacity=".9" />
              </svg>
            </button>
          </div>
          <template v-else>
            <div class="tarot-card">
              <span class="tarot-symbol" aria-hidden="true">{{ todayCard.symbol }}</span>
              <h3>{{ todayCard.name }}</h3>
              <p>{{ todayCard.message }}</p>
            </div>
            <button type="button" class="tarot-redraw" @click="resetCard">다시 뽑기</button>
          </template>
          <p class="news-notice">재미로 보는 콘텐츠이니 참고만 해주세요.</p>
        </section>

        <section class="panel news-panel quote-panel" aria-labelledby="quote-title">
          <div class="panel-heading">
            <div><p class="eyebrow">TODAY'S QUOTE</p><h2 id="quote-title">오늘의 명언</h2></div>
          </div>
          <blockquote class="book-quote">
            <p v-if="isQuoteLoading" class="quote-state">명언을 불러오는 중…</p>
            <template v-else-if="quoteError">
              <p class="quote-state error">{{ quoteError }}</p>
              <button type="button" class="quote-retry" @click="loadQuote">다시 시도</button>
            </template>
            <template v-else-if="todayQuote">
              <p>“{{ todayQuote.message }}”</p>
              <footer>{{ todayQuote.author }}<span v-if="todayQuote.authorProfile" class="author-profile"> · {{ todayQuote.authorProfile }}</span></footer>
            </template>
          </blockquote>
        </section>
      </div>

      <div class="side-stack">
        <section class="panel weather-panel" aria-labelledby="weather-summary-title">
          <div class="panel-heading compact-heading">
            <div><p class="eyebrow">LIVE WEATHER</p><h2 id="weather-summary-title">지역별 날씨</h2></div>
            <RouterLink to="/weather">전체 보기 <span aria-hidden="true">→</span></RouterLink>
          </div>
          <p v-if="isWeatherLoading" class="weather-state" role="status">실시간 날씨를 불러오는 중입니다…</p>
          <div v-else-if="weather.length" class="weather-list">
            <RouterLink v-for="item in weather" :key="item.id" :to="`/weather/${item.id}`" class="weather-row">
              <span class="weather-icon" aria-hidden="true">{{ weatherIcon[item.status] ?? '🌤️' }}</span>
              <div><strong>{{ item.name }}</strong><span>{{ item.description }}</span></div>
              <p><strong>{{ configStore.formatTemperature(item.temp) }}</strong><span>체감 {{ configStore.formatTemperature(item.feelsLike) }}</span></p>
            </RouterLink>
          </div>
          <div v-else class="weather-error" role="alert">
            <p>{{ weatherError }}</p>
            <button type="button" @click="loadWeather">다시 시도</button>
          </div>
          <p v-if="weatherError && weather.length" class="partial-weather-error" role="status">일부 지역은 현재 정보를 불러오지 못했습니다.</p>
        </section>

        <section class="panel stock-panel" aria-labelledby="stock-summary-title">
          <div class="panel-heading compact-heading">
            <div><p class="eyebrow">U.S. MARKET</p><h2 id="stock-summary-title">미국 대형주</h2></div>
            <RouterLink to="/stocks">전체 보기 <span aria-hidden="true">→</span></RouterLink>
          </div>
          <div class="stock-list">
            <div v-for="stock in stocks" :key="stock.symbol" class="stock-row">
              <div class="stock-name"><span>{{ stock.name }}</span><small>{{ stock.symbol }}</small></div>
              <strong>{{ stock.value }}</strong>
              <span :class="stock.up === null ? 'pending' : stock.up ? 'up' : 'down'">{{ stock.change }}</span>
            </div>
          </div>
          <p class="market-notice">{{ marketNotice }}</p>
        </section>
      </div>
    </div>

    <aside class="pro-banner">
      <div class="pro-mark" aria-hidden="true">P</div>
      <div><strong>하루를 더 여유롭게 준비하고 싶다면</strong><p>14일 상세 예보와 맞춤 알림을 Weather Pro에서 만나보세요.</p></div>
      <RouterLink to="/subscribe">Pro 시작하기</RouterLink>
    </aside>

    <section class="panel favorites-panel" aria-labelledby="favorites-title">
      <div class="panel-heading compact-heading">
        <div><p class="eyebrow">MY CITIES</p><h2 id="favorites-title">즐겨찾기한 도시</h2></div>
        <RouterLink to="/weather">추가하러 가기 <span aria-hidden="true">→</span></RouterLink>
      </div>
      <p v-if="isFavoriteWeatherLoading" class="weather-state" role="status">즐겨찾기 날씨를 불러오는 중입니다…</p>
      <div v-else-if="favoriteWeather.length" class="favorites-grid">
        <RouterLink v-for="item in favoriteWeather" :key="item.id" :to="`/weather/${item.id}`" class="weather-row">
          <span class="weather-icon" aria-hidden="true">{{ weatherIcon[item.status] ?? '🌤️' }}</span>
          <div><strong>{{ item.name }}</strong><span>{{ item.description }}</span></div>
          <p><strong>{{ configStore.formatTemperature(item.temp) }}</strong><span>체감 {{ configStore.formatTemperature(item.feelsLike) }}</span></p>
        </RouterLink>
      </div>
      <div v-else class="favorites-empty">
        <p>즐겨찾기한 도시가 아직 없어요.</p>
        <RouterLink to="/weather">날씨 페이지에서 ☆ 버튼을 눌러 추가해보세요.</RouterLink>
      </div>
    </section>
    </div>
  </main>
</template>

<style scoped>
.dashboard-page { width: 100%; padding-bottom: 72px; }
.page-inner { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding-top: 32px; }
.dashboard-hero { position: relative; display: flex; align-items: flex-end; min-height: 460px; overflow: hidden; }
.hero-media { position: absolute; inset: 0; background-image: v-bind(heroImageStyle); background-position: center 60%; background-size: cover; }
.hero-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15, 13, 9, .1) 0%, rgba(15, 13, 9, .55) 70%, rgba(15, 13, 9, .78) 100%); }
.hero-inner { position: relative; z-index: 1; width: 100%; padding: 0 max(20px, calc((100% - 1120px) / 2)) 56px; }
.date-label { margin: 0 0 14px; color: rgba(255, 255, 255, .78); font-size: .82rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.dashboard-hero h1 { max-width: 760px; margin: 0; color: #fff; font-size: clamp(2.4rem, 6vw, 4.6rem); line-height: 1.05; letter-spacing: -.045em; font-weight: 800; }
.hero-copy { max-width: 480px; margin: 20px 0 0; color: rgba(255, 255, 255, .82); font-size: 1.05rem; }
.score-strip { display: grid; grid-template-columns: repeat(4, 1fr); margin: 0 0 20px; padding: 28px 10px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); }
.score-item { display: grid; justify-items: center; gap: 10px; padding: 0 16px; border-right: 1px solid var(--line); text-align: center; }
.score-item:last-child { border-right: 0; }
.score-ring { display: grid; width: 46px; height: 46px; border: 1px solid var(--line); border-radius: 50%; place-items: center; background: var(--blue-100); font-size: 1.3rem; }
.score-label { margin: 0; color: var(--muted); font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.score-value { color: var(--ink); font-size: 1rem; font-weight: 700; letter-spacing: -.01em; }
.score-value.positive { color: #1a8f5c; }
.score-value.negative { color: #e0453c; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.42fr) minmax(340px, .9fr); grid-template-rows: auto auto; gap: 20px; }
.panel { border: 1px solid var(--line); border-radius: 20px; background: var(--surface); box-shadow: var(--shadow); }
.news-panel { padding: 30px 32px; }
.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
.eyebrow { margin: 0 0 6px; color: var(--blue-700); font-size: .68rem; font-weight: 700; letter-spacing: .14em; }
.panel-heading h2 { margin: 0; color: var(--ink); font-size: 1.35rem; letter-spacing: -.03em; font-weight: 700; }
.source-label { padding: 5px 8px; border-radius: 99px; color: var(--muted); background: #f0f0f2; font-size: .62rem; font-weight: 700; }
.source-label.api { color: #1a8f5c; background: #e5f7ef; }
.source-label.loading { color: var(--muted); background: #f0f0f2; }
.news-state { display: grid; min-height: 300px; margin: 0; place-items: center; color: var(--muted); font-size: .78rem; }
.news-list { display: grid; }
.news-item { display: grid; grid-template-columns: 38px 1fr; gap: 14px; padding: 22px 0; border-top: 1px solid var(--line); }
.news-number { padding-top: 4px; color: #b0b0b5; font-size: .76rem; font-weight: 700; }
.news-meta { display: flex; gap: 8px; margin-bottom: 6px; color: var(--muted); font-size: .7rem; }
.news-meta span { color: var(--blue-700); font-weight: 700; }
.news-content h3 { margin: 0 0 7px; color: var(--ink); font-size: 1rem; line-height: 1.45; font-weight: 600; }
.news-content h3 a { color: inherit; text-decoration: none; }
.news-content h3 a:hover { color: var(--blue-700); text-decoration: underline; text-underline-offset: 3px; }
.news-content p { margin: 0; color: var(--muted); font-size: .78rem; line-height: 1.65; }
.news-notice { margin: 12px 0 0; color: #a1a1a6; font-size: .65rem; }
.tarot-panel { display: flex; flex-direction: column; }
.tarot-card { display: grid; justify-items: center; gap: 10px; padding: 40px 24px; margin: 4px 0 18px; border: 1px solid var(--line); border-radius: 18px; background: var(--blue-100); text-align: center; }
.tarot-symbol { font-size: 3.4rem; }
.tarot-card h3 { margin: 0; color: var(--ink); font-size: 1.3rem; font-weight: 700; letter-spacing: -.02em; }
.tarot-card p { max-width: 420px; margin: 0; color: var(--muted); font-size: .88rem; line-height: 1.6; }
.tarot-redraw { display: block; margin: 0 auto; padding: 10px 22px; border: 1px solid var(--line); border-radius: 999px; color: var(--ink); background: var(--surface); font-size: .82rem; font-weight: 600; transition: background .2s ease, border-color .2s ease; }
.tarot-redraw:hover { border-color: var(--blue-500); background: var(--blue-100); }
.tarot-spread { display: flex; justify-content: center; padding: 34px 10px 40px; margin-bottom: 18px; }
.tarot-back {
  display: grid;
  width: 62px;
  height: 92px;
  flex: 0 0 auto;
  margin-left: -18px;
  border: none;
  border-radius: 10px;
  place-items: center;
  padding: 0;
  color: #d9b877;
  background: linear-gradient(160deg, #271738, #150c1f);
  box-shadow: 0 6px 16px rgba(0, 0, 0, .32);
  transition: transform .2s ease, box-shadow .2s ease;
}
.tarot-back-art { width: 100%; height: 100%; }
.tarot-back:first-child { margin-left: 0; }
.tarot-back:hover { z-index: 1; box-shadow: 0 12px 24px rgba(0, 0, 0, .45); }
.tarot-back:nth-child(1) { transform: rotate(-12deg) translateY(10px); }
.tarot-back:nth-child(2) { transform: rotate(-7deg) translateY(4px); }
.tarot-back:nth-child(3) { transform: rotate(-2deg); }
.tarot-back:nth-child(4) { transform: rotate(2deg); }
.tarot-back:nth-child(5) { transform: rotate(7deg) translateY(4px); }
.tarot-back:nth-child(6) { transform: rotate(12deg) translateY(10px); }
.tarot-back:nth-child(1):hover { transform: rotate(-12deg) translateY(2px); }
.tarot-back:nth-child(2):hover { transform: rotate(-7deg) translateY(-4px); }
.tarot-back:nth-child(3):hover { transform: rotate(-2deg) translateY(-8px); }
.tarot-back:nth-child(4):hover { transform: rotate(2deg) translateY(-8px); }
.tarot-back:nth-child(5):hover { transform: rotate(7deg) translateY(-4px); }
.tarot-back:nth-child(6):hover { transform: rotate(12deg) translateY(2px); }
.main-stack { display: grid; grid-row: span 2; grid-template-rows: subgrid; row-gap: 20px; }
.quote-panel { display: flex; flex-direction: column; justify-content: center; }
.book-quote { display: grid; justify-items: center; gap: 14px; margin: 10px 0 0; padding: 8px 6px; text-align: center; }
.book-quote p { max-width: 480px; margin: 0; color: var(--ink); font-size: 1.05rem; font-style: italic; line-height: 1.7; word-break: keep-all; overflow-wrap: break-word; white-space: pre-line; }
.book-quote footer { color: var(--ink); font-size: .8rem; font-weight: 600; }
.book-quote .author-profile { color: var(--muted); font-weight: 400; }
.quote-state { min-height: 60px; color: var(--muted); font-size: .9rem; }
.quote-state.error { color: #b3453d; }
.quote-retry { padding: 8px 16px; border: 0; border-radius: 999px; color: #fff; background: var(--blue-700); font-size: .78rem; font-weight: 600; }
.side-stack { display: grid; grid-row: span 2; grid-template-rows: subgrid; row-gap: 20px; }
.weather-panel, .stock-panel { padding: 26px; }
.compact-heading { align-items: center; }
.compact-heading a { color: var(--blue-700); font-size: .74rem; font-weight: 600; text-decoration: none; }
.compact-heading a:hover { text-decoration: underline; }
.weather-list { display: grid; }
.weather-state { min-height: 154px; display: grid; margin: 0; place-items: center; color: var(--muted); font-size: .78rem; }
.weather-error { display: grid; min-height: 154px; place-items: center; align-content: center; gap: 10px; text-align: center; }
.weather-error p { margin: 0; color: #b3453d; font-size: .74rem; line-height: 1.5; }
.weather-error button { padding: 8px 16px; border: 0; border-radius: 999px; color: #fff; background: var(--blue-700); font-size: .7rem; font-weight: 600; }
.partial-weather-error { margin: 9px 0 0; color: #a17a4e; font-size: .65rem; }
.weather-row { display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 10px; padding: 13px 4px; border-top: 1px solid var(--line); color: inherit; text-decoration: none; border-radius: 10px; transition: background .2s ease; }
.weather-row:hover { background: var(--soft); }
.weather-icon { font-size: 1.65rem; }
.weather-row div, .weather-row p { display: grid; gap: 2px; margin: 0; }
.weather-row div span, .weather-row p span { color: var(--muted); font-size: .69rem; }
.weather-row div strong { color: var(--ink); font-size: .86rem; font-weight: 600; }
.weather-row p { text-align: right; }
.weather-row p strong { color: var(--ink); font-size: 1.1rem; }
.stock-list { display: grid; }
.stock-row { display: grid; grid-template-columns: 1fr auto 62px; align-items: center; gap: 10px; padding: 11px 4px; border-top: 1px solid var(--line); font-size: .79rem; }
.stock-name { display: grid; gap: 1px; }
.stock-name span { color: var(--ink); font-weight: 600; }
.stock-name small { color: var(--muted); font-size: .62rem; }
.stock-row strong { color: var(--ink); }
.stock-row .up, .stock-row .down, .stock-row .pending { text-align: right; font-weight: 600; }
.stock-row .up { color: #1a8f5c; }.stock-row .down { color: #e0453c; }
.stock-row .pending { color: var(--muted); }
.market-notice { margin: 10px 0 0; color: #a1a1a6; font-size: .66rem; }
.pro-banner { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 18px; margin-top: 20px; padding: 24px 28px; border: 1px solid var(--line); border-radius: 20px; background: var(--surface); }
.pro-mark { display: grid; width: 40px; height: 40px; border-radius: 11px; place-items: center; color: #fff; background: var(--ink); font-weight: 700; }
.pro-banner strong { color: var(--ink); font-size: .9rem; font-weight: 600; }
.pro-banner p { margin: 3px 0 0; color: var(--muted); font-size: .75rem; }
.pro-banner a { padding: 10px 18px; border-radius: 999px; color: #fff; background: var(--blue-700); font-size: .78rem; font-weight: 600; text-decoration: none; transition: background .2s ease; }
.pro-banner a:hover { background: var(--blue-700-hover); }
.favorites-panel { margin-top: 20px; padding: 26px; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
.favorites-empty { display: grid; min-height: 100px; place-items: center; gap: 8px; text-align: center; color: var(--muted); font-size: .82rem; }
.favorites-empty p { margin: 0; }
.favorites-empty a { color: var(--blue-700); font-weight: 600; text-decoration: none; }
.favorites-empty a:hover { text-decoration: underline; }

@media (max-width: 850px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .main-stack, .side-stack { grid-row: auto; grid-template-rows: initial; }
  .side-stack { grid-template-columns: repeat(2, 1fr); }
  .score-strip { grid-template-columns: repeat(2, 1fr); row-gap: 20px; }
  .score-item:nth-child(2) { border-right: 0; }
}
@media (max-width: 600px) {
  .page-inner { width: min(100% - 24px, 1120px); }
  .dashboard-hero { min-height: 340px; }
  .hero-copy { font-size: .92rem; }
  .side-stack { grid-template-columns: 1fr; }
  .news-panel { padding: 22px 18px; }
  .news-item { grid-template-columns: 30px 1fr; gap: 8px; }
  .pro-banner { grid-template-columns: auto 1fr; padding: 18px; }
  .pro-banner a { grid-column: 1 / -1; text-align: center; }
}
</style>
