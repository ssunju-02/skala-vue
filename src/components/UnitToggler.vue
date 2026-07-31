<script setup>
import { useConfigStore } from '../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨단위: {{ configStore.unit === 'fahrenheit' ? '화씨' : '섭씨' }}({{ configStore.unitSymbol }})
    </span>
    <button type="button" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.unit-label {
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
}

.unit-toggler button {
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: #333;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
}

.unit-toggler button:hover {
  background: #555;
}
</style>
