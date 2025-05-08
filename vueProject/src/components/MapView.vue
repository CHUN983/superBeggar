<!-- src/components/MapView.vue -->
<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({ zip: String })
let map, markersLayer

onMounted(() => {
  map = L.map('map').setView([22.627, 120.301], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  markersLayer = L.layerGroup().addTo(map)
})

watch(() => props.zip, async (zip) => {
  markersLayer.clearLayers()                      // 清除舊標記
  if (!zip) return
  const res = await fetch('https://stamp.family.com.tw/api/maps/MapProductInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      OldPKeys: [],
      PostInfo: zip,
      Latitude: 0,
      Longitude: 0,
      ProjectCode: '202106302'
    })
  })
  const json = await res.json()
  json.data.forEach(s => {                         // 加上每家店標記
    L.marker([s.latitude, s.longitude])
      .bindPopup(`<strong>${s.name}</strong><br/>${s.address}`)
      .addTo(markersLayer)
  })
}, { immediate: true })
</script>

<style scoped>
.map-container { width: 100%; height: 100%; }
</style>
