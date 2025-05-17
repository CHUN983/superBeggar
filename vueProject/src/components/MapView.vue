<!-- src/components/MapView.vue -->
<template>
  <div id="map" class="map-container"></div>
  <button class="gps-button" @click="moveToGPS"> 回到我的位置</button>
</template>

<script setup>
import { onMounted, watch, defineEmits } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconImg from '@/assets/familymart.png'
import sevenIconImg from '@/assets/seven11.png'


const props = defineProps({ zip: String })

let map, markersLayer, gpsMarker


const familyIcon = L.icon({
  iconUrl: iconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -30]
})

const sevenIcon = L.icon({
  iconUrl: sevenIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -30]
})

// 地圖初始化與 GPS
onMounted(() => {
  map = L.map('map').setView([22.627, 120.301], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords

      gpsMarker = L.marker([latitude, longitude])
        .bindPopup('<strong>你的位置</strong>')
        .addTo(map)
      map.setView([latitude, longitude], 15)

      emit('update-location', { latitude, longitude })

      // 只呼叫一次
      loadNearbyStores(latitude, longitude)
    }, () => {
      console.warn('無法取得 GPS 位置，使用預設位置。')
    })
  } else {
    console.warn('此瀏覽器不支援 GPS 定位。')
  }
})



watch(() => props.zip, async (zip) => {
  if (!zip) return
  // 清除 marker
  if (markersLayer) markersLayer.clearLayers()

  // 這裡你沒有 GPS，就不用傳座標
  const res = await fetch('/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zip })
  })
  const json = await res.json()
  showShops(json)

  if (json.family.length > 0) {
    const { latitude, longitude } = json.family[0]
    map.setView([latitude, longitude], 15)
  } else if (json.seven.length > 0) {
    const { latitude, longitude } = json.seven[0]
    map.setView([latitude, longitude], 15)
  }
}, { immediate: true })

// 📍 回到 GPS 的位置
const moveToGPS = async () => {
  if (gpsMarker && map) {
    const latlng = gpsMarker.getLatLng()
    map.setView(latlng, 15)
    gpsMarker.openPopup()

    loadNearbyStores(latlng.lat, latlng.lng)
  } else {
    alert('目前尚未取得 GPS 位置')
  }
}


const showShops = (json) => {
  markersLayer.clearLayers()

  json.family.forEach(s => {
    L.marker([s.latitude, s.longitude], { icon: familyIcon })
      .bindPopup(`<strong>${s.name}</strong><br/>${s.address}`)
      .addTo(markersLayer)
  })

  json.seven.forEach(s => {
    L.marker([s.latitude, s.longitude], { icon: sevenIcon })
      .bindPopup(`<strong>${s.name}</strong><br/>${s.address}`)
      .addTo(markersLayer)
  })

  if (gpsMarker) gpsMarker.addTo(map)
}

const loadNearbyStores = async (latitude, longitude) => {
  const res = await fetch('/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zip: props.zip, latitude, longitude })
  })
  const json = await res.json()
  showShops(json)
}


</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.gps-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
}

.gps-button:hover {
  background-color: #0c70d3;
}
</style>



