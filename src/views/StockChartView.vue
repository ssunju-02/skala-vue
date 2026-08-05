<script setup>
import { computed, onMounted, ref } from 'vue'
import { STOCK_MARKETS, fetchStockSeries } from '../services/stockApi'
import heroImage from '../assets/images/hero-bubbles.jpg'

document.title = '주식 시세 | 오늘, 브리핑'
const heroImageStyle = `url(${heroImage})`
const cards = ref(STOCK_MARKETS.map((market) => ({ market, series: [], loading: true, error: '' })))
const todayLabel = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})
const formatValue = (value) => currencyFormatter.format(value)
const formatChange = (value) => currencyFormatter.format(Math.abs(value))
const chartPoints = (series) => {
  if (!series.length) return ''
  const min = Math.min(...series.map(({ value }) => value))
  const max = Math.max(...series.map(({ value }) => value))
  const range = max - min || 1
  return series.map(({ value }, i) => `${(i / Math.max(series.length - 1, 1)) * 100},${92 - ((value - min) / range) * 76}`).join(' ')
}
const cardView = computed(() => cards.value.map((card) => ({
  ...card,
  latest: card.series.at(-1)?.value,
  change: card.change ?? (card.series.length > 1 ? card.series.at(-1).value - card.series.at(-2).value : 0),
  points: chartPoints(card.series),
})))

onMounted(async () => {
  await Promise.all(cards.value.map(async (card) => {
    try {
      const result = await fetchStockSeries(card.market)
      card.series = result.series
      card.source = result.source
      card.change = result.change
      card.percentChange = result.percentChange
    }
    catch (error) { card.error = error.message }
    finally { card.loading = false }
  }))
})
</script>

<template>
  <main class="stocks-page">
    <header class="stocks-header">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="eyebrow">MARKET SNAPSHOT</p>
        <h1>미국 시가총액 상위 10개</h1>
        <time class="today-date" :datetime="new Date().toISOString().slice(0, 10)">{{ todayLabel }}</time>
        <p>미국 대표 대형주의 현재가와 최근 흐름을 한눈에 확인해 보세요.</p>
        <small>투자 참고용 정보이며, 실제 매매 전 공식 거래소와 증권사 정보를 확인하세요.</small>
      </div>
    </header>
    <div class="page-inner">
    <section class="stock-table" aria-label="미국 시가총액 상위 10개 종목">
      <div class="stock-row stock-row--head" aria-hidden="true">
        <span class="col-rank">#</span>
        <span class="col-name">종목</span>
        <span class="col-price">현재가</span>
        <span class="col-change">등락</span>
        <span class="col-chart">최근 30일</span>
      </div>
      <article v-for="card in cardView" :key="card.market.id" class="stock-row">
        <span class="col-rank"><span class="rank">{{ card.market.rank }}</span></span>
        <div class="col-name">
          <strong>{{ card.market.name }}</strong>
          <span class="symbol">{{ card.market.symbol }}</span>
          <span v-if="card.source === 'demo'" class="demo-badge">DEMO</span>
        </div>
        <p v-if="card.loading" class="state" role="status">시세를 불러오는 중입니다…</p>
        <p v-else-if="card.error" class="state error" role="alert">{{ card.error }}</p>
        <template v-else>
          <div class="col-price">{{ formatValue(card.latest) }}</div>
          <div :class="['col-change', { down: card.change < 0 }]">
            <span class="arrow">{{ card.change >= 0 ? '▲' : '▼' }}</span>{{ formatChange(card.change) }}<span v-if="Number.isFinite(card.percentChange)" class="percent">({{ Math.abs(card.percentChange).toFixed(2) }}%)</span>
          </div>
          <svg class="col-chart" viewBox="0 0 100 100" role="img" :aria-label="`${card.market.name} 최근 가격 흐름`" preserveAspectRatio="none"><polyline :points="card.points" fill="none" stroke="currentColor" stroke-width="2.5" vector-effect="non-scaling-stroke" /></svg>
        </template>
      </article>
    </section>
    </div>
  </main>
</template>

<style scoped>
.stocks-page { width: 100%; padding-bottom: 64px; }
.page-inner { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding-top: 32px; }
.stocks-header { position: relative; display: flex; align-items: flex-end; min-height: 340px; overflow: hidden; }
.hero-media { position: absolute; inset: 0; background-image: v-bind(heroImageStyle); background-position: center 45%; background-size: cover; }
.hero-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15, 13, 9, .08) 0%, rgba(15, 13, 9, .55) 65%, rgba(15, 13, 9, .78) 100%); }
.hero-inner { position: relative; z-index: 1; width: 100%; padding: 0 max(20px, calc((100% - 1120px) / 2)) 44px; }
.stocks-header h1 { margin: 0 0 10px; color: #fff; font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -.045em; font-weight: 700; }
.today-date { display: block; margin-bottom: 12px; color: rgba(255, 255, 255, .85); font-size: .9rem; font-weight: 600; }
.stocks-header p { margin: 0 0 8px; color: rgba(255, 255, 255, .85); font-size: 1.02rem; }
.stocks-header small { color: rgba(255, 255, 255, .6); }
.eyebrow { margin: 0 0 8px !important; color: rgba(255, 255, 255, .85) !important; font-size: .72rem; font-weight: 700; letter-spacing: .14em; }
.stock-table { display: grid; overflow: hidden; border: 1px solid var(--line); border-radius: 18px; background: var(--surface); box-shadow: var(--shadow); }
.stock-row {
  display: grid;
  grid-template-columns: 44px minmax(140px, 1.4fr) 110px 150px minmax(120px, 1fr);
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  border-top: 1px solid var(--line);
}
.stock-row:first-child { border-top: 0; }
.stock-row--head { padding: 14px 22px; color: var(--muted); background: var(--soft); font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.stock-row--head .col-price, .stock-row--head .col-change { text-align: right; }
.rank { display: inline-grid; width: 26px; height: 26px; border-radius: 7px; place-items: center; color: var(--blue-700); background: var(--blue-100); font-size: .74rem; font-weight: 700; }
.col-name { display: flex; align-items: baseline; gap: 8px; overflow: hidden; }
.col-name strong { overflow: hidden; color: var(--ink); font-size: .96rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.col-name .symbol { flex: 0 0 auto; color: var(--muted); font-size: .74rem; }
.demo-badge { flex: 0 0 auto; padding: 3px 7px; border-radius: 999px; color: var(--blue-700); background: var(--blue-100); font-size: .62rem; font-weight: 700; }
.col-price { color: var(--ink); font-size: 1.05rem; font-weight: 700; letter-spacing: -.02em; text-align: right; }
.col-change { display: flex; align-items: center; justify-content: flex-end; gap: 5px; color: #1a8f5c; font-size: .84rem; font-weight: 600; white-space: nowrap; }
.col-change.down { color: #e0453c; }
.col-change .arrow { font-size: .72rem; }
.col-change .percent { color: var(--muted); font-weight: 500; }
.col-chart { display: block; width: 100%; height: 40px; overflow: visible; color: var(--blue-500); }
.state { grid-column: 3 / -1; margin: 0; color: var(--muted); font-size: .82rem; text-align: right; }
.state.error { color: #b3453d; }
@media (max-width: 760px) {
  .stock-row { grid-template-columns: 36px minmax(0, 1.4fr) 96px 116px; }
  .col-chart, .stock-row--head .col-chart { display: none; }
  .state { grid-column: 3 / -1; }
}
@media (max-width: 650px) { .page-inner { width: min(100% - 24px, 1120px); } .stocks-header { min-height: 260px; } }
@media (max-width: 480px) {
  .stock-row { grid-template-columns: 30px minmax(0, 1fr) 90px; gap: 10px; }
  .col-change { display: none; }
  .stock-row--head .col-change { display: none; }
}
</style>
