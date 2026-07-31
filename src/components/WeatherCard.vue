<script setup>
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

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
    <p class="temp">현재 기온: {{ city.temp }}℃</p>
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
