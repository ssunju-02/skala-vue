<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { useFavoritesStore } from '../../stores/favoritesStore'

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const favoritesStore = useFavoritesStore()
const displayTemp = computed(() => configStore.formatTemperature(props.weather.temp))
const isFavorite = computed(() => favoritesStore.isFavorite(props.weather.id))

const weatherIcon = {
  맑음: '☀️',
  비: '🌧️',
  구름: '☁️',
  눈: '🌨️',
  안개: '🌫️',
}

const selectCard = (weather) => {
  emit('select-card', weather)
}

const showDetail = (weather) => {
  emit('click-detail', weather)
}
</script>

<template>
  <article
    class="weather-card"
    :class="{ selected }"
    role="button"
    :aria-pressed="selected"
    :aria-label="`${props.weather.name} ${props.weather.status}, ${displayTemp}. 선택하려면 Enter를 누르세요.`"
    tabindex="0"
    @click="selectCard(props.weather)"
    @keydown.enter="selectCard(props.weather)"
    @keydown.space.prevent="selectCard(props.weather)"
  >
    <div class="card-top">
      <div>
        <p class="city-name">{{ props.weather.name }}</p>
        <p class="weather-status">{{ props.weather.status }}</p>
      </div>
      <div class="card-top-actions">
        <button
          type="button"
          class="favorite-toggle"
          :class="{ active: isFavorite }"
          :aria-pressed="isFavorite"
          :aria-label="`${props.weather.name} ${isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}`"
          @click.stop="favoritesStore.toggleFavorite(props.weather.id)"
        >{{ isFavorite ? '★' : '☆' }}</button>
        <span class="weather-icon" aria-hidden="true">
          {{ weatherIcon[props.weather.status] ?? '🌤️' }}
        </span>
      </div>
    </div>

    <p class="temperature">{{ displayTemp }}</p>

    <dl class="weather-metrics">
      <div>
        <dt>체감온도</dt>
        <dd>{{ configStore.formatTemperature(props.weather.feelsLike) }}</dd>
      </div>
      <div>
        <dt>습도</dt>
        <dd>{{ props.weather.humidity }}%</dd>
      </div>
      <div>
        <dt>최근 1시간 강수</dt>
        <dd>{{ props.weather.precipitation.toFixed(1) }} mm</dd>
      </div>
      <div>
        <dt>바람</dt>
        <dd>{{ props.weather.windSpeed?.toFixed(1) ?? '—' }} m/s <small>{{ props.weather.windDirection }}풍</small></dd>
      </div>
    </dl>

    <div class="card-bottom">
      <span v-if="props.weather.temp >= 25" class="temperature-label hot">
        🔥 더움 (25도 이상)
      </span>
      <span v-else class="temperature-label cool">
        ❄️ 선선함 (25도 미만)
      </span>
      <button type="button" @click.stop="showDetail(props.weather)">상세보기</button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 20px;
  outline: none;
  background: var(--surface);
  box-shadow: var(--shadow);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.weather-card:hover,
.weather-card:focus-visible,
.weather-card.selected {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.09);
}

.card-top,
.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.city-name {
  margin: 0 0 4px;
  font-size: 1.25rem;
  font-weight: 700;
}

.weather-status {
  margin: 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.card-top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-toggle {
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  place-items: center;
  color: var(--muted);
  background: var(--soft);
  font-size: 1.15rem;
  line-height: 1;
  transition: color 150ms ease, background 150ms ease;
}

.favorite-toggle:hover {
  background: var(--blue-100);
}

.favorite-toggle.active {
  color: #f0a13a;
}

.weather-icon {
  display: grid;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  place-items: center;
  font-size: 2rem;
  background: var(--blue-100);
}

.temperature {
  margin: 26px 0 30px;
  color: var(--ink);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.temperature span {
  margin-left: 3px;
  color: var(--muted);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: -10px 0 24px;
}

.weather-metrics div {
  padding: 10px;
  border-radius: 12px;
  background: var(--soft);
}

.weather-metrics dt {
  margin-bottom: 3px;
  color: var(--muted);
  font-size: .65rem;
}

.weather-metrics dd {
  margin: 0;
  color: var(--ink);
  font-size: .8rem;
  font-weight: 700;
}

.weather-metrics small {
  margin-left: 2px;
  color: var(--muted);
  font-size: .62rem;
  font-weight: 500;
}

.temperature-label {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}

.temperature-label.hot {
  color: #c2410c;
  background: #fff0e8;
}

.temperature-label.cool {
  color: var(--blue-700);
  background: var(--blue-100);
}

.card-bottom button {
  padding: 8px 16px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: var(--blue-700);
  font-weight: 600;
  transition: background 150ms ease;
}

.card-bottom button:hover {
  background: var(--blue-700-hover);
}

@media (max-width: 560px) {
  .card-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-bottom button {
    width: 100%;
  }
}
</style>
