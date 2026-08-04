<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '../stores/configStore'

const configStore = useConfigStore()
const { unit } = storeToRefs(configStore)
</script>

<template>
  <button class="unit-toggler" type="button" :aria-label="`현재 단위 ${unit === 'celsius' ? '섭씨' : '화씨'}. ${unit === 'celsius' ? '화씨' : '섭씨'}로 변경`" :title="`현재 단위: °${unit === 'celsius' ? 'C' : 'F'}`" @click="configStore.toggleTemperatureUnit">
    <span :class="{ active: unit === 'celsius' }">°C</span>
    <span class="divider">/</span>
    <span :class="{ active: unit === 'fahrenheit' }">°F</span>
  </button>
</template>

<style scoped>
.unit-toggler { display: inline-flex; align-items: center; gap: 5px; min-height: 40px; padding: 8px 11px; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); background: var(--surface); cursor: pointer; font-weight: 600; transition: border-color .2s ease, background .2s ease; }
.unit-toggler .active { color: var(--blue-700); }
.divider { color: var(--line); }
.unit-toggler:hover { border-color: var(--blue-500); background: var(--blue-100); }
</style>
