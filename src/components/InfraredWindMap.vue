<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  regions: { type: Array, default: () => [] },
})

const mapElement = ref(null)
let map
const markers = []

const COMPASS_TO_DEG = { 북: 0, 북동: 45, 동: 90, 남동: 135, 남: 180, 남서: 225, 서: 270, 북서: 315 }

const tempToColor = (temp) => {
  const clamped = Math.max(-10, Math.min(40, temp ?? 15))
  const hue = 240 - ((clamped + 10) / 50) * 240
  return `hsl(${hue}, 90%, 58%)`
}

const buildIcon = (region) => {
  const color = tempToColor(region.temp)
  const toDeg = ((COMPASS_TO_DEG[region.windDirection] ?? 0) + 180) % 360
  const size = Math.min(30, 16 + (region.windSpeed ?? 0) * 1.6)
  const half = size / 2
  return L.divIcon({
    className: 'wind-marker',
    html: `
      <div class="wind-marker-glow" style="--glow-color:${color}"></div>
      <div class="wind-marker-arrow" style="width:${size}px;height:${size}px;margin:-${half}px 0 0 -${half}px;color:${color};transform:rotate(${toDeg}deg);">
        <svg viewBox="0 0 24 24"><path d="M12 2 L19 20 L12 15.5 L5 20 Z" /></svg>
      </div>
      <span class="wind-marker-label">${region.name}</span>
    `,
    iconSize: [0, 0],
  })
}

const renderMarkers = () => {
  markers.forEach((marker) => marker.remove())
  markers.length = 0
  if (!map) return
  props.regions.forEach((region) => {
    if (!Number.isFinite(region.lat) || !Number.isFinite(region.lon)) return
    const marker = L.marker([region.lat, region.lon], { icon: buildIcon(region), interactive: false }).addTo(map)
    markers.push(marker)
  })
}

onMounted(() => {
  map = L.map(mapElement.value, {
    center: [36.2, 127.8],
    zoom: 6.6,
    minZoom: 6,
    maxZoom: 9,
    scrollWheelZoom: false,
    zoomControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors',
  }).addTo(map)

  renderMarkers()
})

watch(() => props.regions, renderMarkers)

onBeforeUnmount(() => {
  map?.remove()
})
</script>

<template>
  <div class="infrared-map">
    <div ref="mapElement" class="infrared-map-canvas" role="img" aria-label="전국 기온과 바람이 흘러가는 방향을 표시한 지도"></div>
    <p class="infrared-map-legend">
      <span class="legend-dot cold" aria-hidden="true"></span> 차가움
      <span class="legend-dot hot" aria-hidden="true"></span> 따뜻함
      <span aria-hidden="true">➤</span> 바람이 흘러가는 방향 (구름 이동 방향의 근사치)
    </p>
  </div>
</template>

<style scoped>
.infrared-map-canvas {
  width: 100%;
  height: 420px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
}
.infrared-map-canvas :deep(.leaflet-control-attribution) {
  color: rgba(0, 0, 0, .5);
  background: rgba(255, 255, 255, .65);
  font-size: 8px;
}
.infrared-map-canvas :deep(.leaflet-control-attribution a) { color: rgba(0, 0, 0, .7); }
.infrared-map :deep(.wind-marker) { position: relative; }
.infrared-map :deep(.wind-marker-glow) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
  opacity: .55;
  filter: blur(2px);
  mix-blend-mode: screen;
}
.infrared-map :deep(.wind-marker-arrow) {
  position: absolute;
  top: 50%;
  left: 50%;
  filter: drop-shadow(0 0 4px currentColor);
}
.infrared-map :deep(.wind-marker-arrow svg) { width: 100%; height: 100%; fill: currentColor; }
.infrared-map :deep(.wind-marker-label) {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-top: 4px;
  color: var(--ink);
  font-size: 10px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(255, 255, 255, .85), 0 0 4px rgba(255, 255, 255, .7);
  transform: translateX(-50%);
  white-space: nowrap;
}
.infrared-map-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: .72rem;
}
.legend-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; }
.legend-dot.cold { background: hsl(220, 90%, 58%); }
.legend-dot.hot { background: hsl(10, 90%, 58%); }
</style>
