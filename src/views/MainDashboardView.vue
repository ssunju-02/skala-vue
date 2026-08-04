<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { STOCK_MARKETS, fetchStockSeries } from '../services/stockApi'
import { TAROT_CARDS } from '../data/tarotCards'
import { BOOK_QUOTES } from '../data/bookQuotes'
import { useConfigStore } from '../stores/configStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import {
  ALL_WEATHER_LOCATIONS,
  fetchCurrentWeather,
  getAirQualityLevel,
  getWeatherErrorMessage,
  WEATHER_CITIES,
} from '../services/weatherApi'

document.title = '오늘의 브리핑 | SKALA Weather'
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

const todayQuote = ref(BOOK_QUOTES[Math.floor(Math.random() * BOOK_QUOTES.length)])
</script>

<template>
  <main class="dashboard-page">
    <header class="dashboard-hero">
      <div>
        <p class="date-label">{{ today }}</p>
        <h1>오늘 필요한 정보만<br><span>가볍게 확인하세요.</span></h1>
        <p class="hero-copy">뉴스와 날씨, 주요 시세를 한 화면에 모았습니다.</p>
      </div>
      <div v-if="heroWeather" class="hero-weather" :aria-label="`${heroWeather.name} 현재 날씨 ${heroWeather.status}, ${configStore.formatTemperature(heroWeather.temp)}`">
        <span class="sun" aria-hidden="true">{{ weatherIcon[heroWeather.status] ?? '🌤️' }}</span>
        <div><strong>{{ configStore.formatTemperature(heroWeather.temp) }}</strong><span>{{ heroWeather.name }} · {{ heroWeather.description }}</span></div>
      </div>
      <div v-else class="hero-weather hero-weather-state" role="status">
        {{ isWeatherLoading ? '서울 날씨를 불러오는 중…' : '날씨 정보 없음' }}
      </div>
    </header>

    <section class="quick-strip" aria-label="오늘의 핵심 정보">
      <div><span class="quick-dot weather-dot" aria-hidden="true"></span><span>{{ heroWeather?.name ?? '서울' }}</span><strong>{{ heroWeather ? `${configStore.formatTemperature(heroWeather.temp)} ${heroWeather.status}` : '—' }}</strong></div>
      <div><span class="quick-dot air-dot" aria-hidden="true"></span><span>공기질</span><strong>{{ heroWeather ? getAirQualityLevel(heroWeather.airQualityIndex) : '—' }}</strong></div>
      <div><span class="quick-dot market-dot" aria-hidden="true"></span><span>{{ stocks[0].symbol }}</span><strong :class="stocks[0].up === false ? 'negative' : 'positive'">{{ stocks[0].change }}</strong></div>
      <div><span class="quick-dot rain-dot" aria-hidden="true"></span><span>최근 강수</span><strong>{{ heroWeather ? `${heroWeather.precipitation.toFixed(1)} mm` : '—' }}</strong></div>
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
            >✦</button>
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
            <p>“{{ todayQuote.quote }}”</p>
            <footer>— {{ todayQuote.author }}, <cite>『{{ todayQuote.title }}』</cite></footer>
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
  </main>
</template>

<style scoped>
.dashboard-page { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding: 56px 0 72px; }
.dashboard-hero { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 0 0 32px; }
.date-label { margin: 0 0 14px; color: var(--muted); font-size: .82rem; font-weight: 600; }
.dashboard-hero h1 { margin: 0; color: var(--ink); font-size: clamp(2.25rem, 5vw, 4rem); line-height: 1.08; letter-spacing: -.045em; font-weight: 700; }
.dashboard-hero h1 span { color: var(--blue-700); }
.hero-copy { margin: 18px 0 0; color: var(--muted); font-size: 1.05rem; }
.hero-weather { position: relative; display: flex; align-items: center; min-width: 250px; gap: 20px; padding: 26px; border: 1px solid var(--line); border-radius: 20px; background: var(--surface); box-shadow: var(--shadow); }
.sun { display: grid; width: 64px; height: 64px; border-radius: 50%; place-items: center; background: var(--blue-100); font-size: 2.3rem; }
.hero-weather div { display: grid; }
.hero-weather strong { color: var(--ink); font-size: 2.3rem; line-height: 1; letter-spacing: -.03em; }
.hero-weather span:last-child { margin-top: 8px; color: var(--muted); font-size: .84rem; }
.hero-weather-state { align-items: center; justify-content: center; color: var(--muted); font-size: .8rem; }
.quick-strip { display: grid; grid-template-columns: repeat(4, 1fr); margin: 0 0 20px; padding: 18px 22px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); }
.quick-strip > div { display: flex; align-items: center; gap: 8px; padding: 0 20px; border-right: 1px solid var(--line); }
.quick-strip > div:first-child { padding-left: 0; }
.quick-strip > div:last-child { padding-right: 0; border-right: 0; }
.quick-strip span:not(.quick-dot) { color: var(--muted); font-size: .76rem; }
.quick-strip strong { margin-left: auto; color: var(--ink); font-size: .82rem; }
.quick-strip .positive { color: #1a8f5c; }
.quick-strip .negative { color: #e0453c; }
.quick-dot { width: 7px; height: 7px; flex: 0 0 auto; border-radius: 50%; background: var(--blue-500); }
.air-dot { background: #34a670; }.market-dot { background: #f0a13a; }.rain-dot { background: #8b7ce8; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.42fr) minmax(340px, .9fr); gap: 20px; }
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
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 10px;
  place-items: center;
  color: rgba(255, 255, 255, .85);
  background: linear-gradient(160deg, var(--blue-700), var(--blue-500));
  box-shadow: 0 6px 16px rgba(0, 0, 0, .12);
  font-size: 1.2rem;
  transition: transform .2s ease, box-shadow .2s ease;
}
.tarot-back:first-child { margin-left: 0; }
.tarot-back:hover { z-index: 1; box-shadow: 0 12px 22px rgba(0, 0, 0, .18); }
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
.main-stack { display: grid; align-content: start; gap: 20px; }
.quote-panel { display: flex; flex-direction: column; }
.book-quote { display: grid; justify-items: center; gap: 14px; margin: 10px 0 0; padding: 8px 6px; text-align: center; }
.book-quote p { max-width: 480px; margin: 0; color: var(--ink); font-size: 1.05rem; font-style: italic; line-height: 1.7; }
.book-quote footer { color: var(--muted); font-size: .8rem; }
.book-quote cite { color: var(--blue-700); font-style: normal; font-weight: 600; }
.side-stack { display: grid; gap: 20px; }
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
.weather-row:hover { background: #f5f5f7; }
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
.pro-banner a:hover { background: #0068d9; }
.favorites-panel { margin-top: 20px; padding: 26px; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
.favorites-empty { display: grid; min-height: 100px; place-items: center; gap: 8px; text-align: center; color: var(--muted); font-size: .82rem; }
.favorites-empty p { margin: 0; }
.favorites-empty a { color: var(--blue-700); font-weight: 600; text-decoration: none; }
.favorites-empty a:hover { text-decoration: underline; }

@media (max-width: 850px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .side-stack { grid-template-columns: repeat(2, 1fr); }
  .hero-weather { min-width: 220px; }
  .quick-strip { grid-template-columns: repeat(2, 1fr); row-gap: 15px; }
  .quick-strip > div:nth-child(2) { border-right: 0; }
}
@media (max-width: 600px) {
  .dashboard-page { width: min(100% - 24px, 1120px); padding-top: 32px; }
  .dashboard-hero { flex-direction: column; align-items: flex-start; gap: 24px; }
  .hero-weather { display: none; }
  .hero-copy { font-size: .92rem; }
  .quick-strip { padding: 14px 12px; }
  .quick-strip > div { padding: 0 10px; }
  .quick-strip span:not(.quick-dot) { display: none; }
  .side-stack { grid-template-columns: 1fr; }
  .news-panel { padding: 22px 18px; }
  .news-item { grid-template-columns: 30px 1fr; gap: 8px; }
  .pro-banner { grid-template-columns: auto 1fr; padding: 18px; }
  .pro-banner a { grid-column: 1 / -1; text-align: center; }
}
</style>
