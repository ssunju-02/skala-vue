<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapElement = ref(null)
let map
const RADAR_FRAME_MS = 600
let radarLayer = null
let radarHost = ''
let radarTimer = null
const radarFrames = ref([])
const radarFrameIndex = ref(0)
const isRadarPlaying = ref(true)
const isRadarAvailable = ref(false)

const buildRadarUrl = (frame) => `${radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`

const radarTimeLabel = computed(() => {
  const frame = radarFrames.value[radarFrameIndex.value]
  if (!frame) return ''
  return new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date(frame.time * 1000))
})

const toggleRadarPlay = () => { isRadarPlaying.value = !isRadarPlaying.value }

const startRadarLoop = () => {
  clearInterval(radarTimer)
  radarTimer = setInterval(() => {
    if (!isRadarPlaying.value || !radarLayer || !radarFrames.value.length) return
    radarFrameIndex.value = (radarFrameIndex.value + 1) % radarFrames.value.length
    radarLayer.setUrl(buildRadarUrl(radarFrames.value[radarFrameIndex.value]))
  }, RADAR_FRAME_MS)
}

const loadRadar = async () => {
  try {
    const response = await fetch('https://api.rainviewer.com/public/weather-maps.json')
    const data = await response.json()
    radarHost = data.host
    radarFrames.value = [...(data.radar?.past ?? []), ...(data.radar?.nowcast ?? [])]
    if (!radarFrames.value.length || !map) return
    radarFrameIndex.value = radarFrames.value.length - 1
    radarLayer = L.tileLayer(buildRadarUrl(radarFrames.value[radarFrameIndex.value]), {
      opacity: .6,
      zIndex: 5,
    }).addTo(map)
    isRadarAvailable.value = true
    startRadarLoop()
  } catch {
    radarFrames.value = []
  }
}

onMounted(() => {
  map = L.map(mapElement.value, {
    center: [36.2, 127.8],
    zoom: 6.3,
    minZoom: 6,
    maxZoom: 9,
    scrollWheelZoom: false,
    zoomControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors',
  }).addTo(map)

  loadRadar()
})

onBeforeUnmount(() => {
  clearInterval(radarTimer)
  map?.remove()
})
</script>

<template>
  <div class="rain-radar">
    <div ref="mapElement" class="rain-radar-canvas" role="img" aria-label="전국 실시간 강수 레이더 지도"></div>
    <div v-if="isRadarAvailable" class="radar-controls">
      <button type="button" class="radar-toggle" :aria-label="isRadarPlaying ? '레이더 애니메이션 정지' : '레이더 애니메이션 재생'" @click="toggleRadarPlay">
        {{ isRadarPlaying ? '⏸' : '▶' }}
      </button>
      <span class="radar-time">{{ radarTimeLabel }} 기준</span>
    </div>
    <p v-else class="radar-loading">강수 레이더를 불러오는 중이거나 이용할 수 없어요.</p>
  </div>
</template>

<style scoped>
.rain-radar { position: relative; }
.rain-radar-canvas {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
}
.rain-radar-canvas :deep(.leaflet-control-attribution) {
  color: rgba(0, 0, 0, .5);
  background: rgba(255, 255, 255, .65);
  font-size: 7px;
}
.rain-radar-canvas :deep(.leaflet-control-attribution a) { color: rgba(0, 0, 0, .7); }
.radar-controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px 5px 5px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, .92);
  box-shadow: var(--shadow);
}
.radar-toggle {
  display: grid;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  place-items: center;
  color: #fff;
  background: var(--blue-700);
  font-size: .62rem;
}
.radar-time { color: var(--ink); font-size: .64rem; font-weight: 600; }
.radar-loading { margin: 8px 0 0; color: var(--muted); font-size: .72rem; text-align: center; }
</style>
