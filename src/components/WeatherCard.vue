<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

const onSelect = () => {
  emit('select-card', props.city.name)
}

const onDetail = () => {
  emit('click-detail', props.city.name, props.city.status)
}
</script>

<template>
  <li class="weather-card" @click="onSelect">
    <div class="card-top">
      <span class="city-name">{{ city.name }} ({{ city.status }})</span>
      <button type="button" @click.stop="onDetail">상세보기</button>
    </div>
    <p class="temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
  </li>
</template>

<style scoped>
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
</style>
