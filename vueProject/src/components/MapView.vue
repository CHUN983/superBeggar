<template>
  <div id="map" class="map-container"></div>
  <button class="gps-button" @click="moveToGPS">回到我的位置</button>
  <button 
    class="search-button" 
    @click="searchCurrentArea"
  >搜尋這個區域</button>
</template>

<script setup>
import { onMounted, watch, defineEmits, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconImg from '@/assets/familymart.png'
import sevenIconImg from '@/assets/seven11.png'

const props = defineProps({
  zip: String,
  stores: Object,
  centerLatLng: Object, // 新增
})
const emit = defineEmits(['update-location', 'search-area'])

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

const searchCurrentArea = () => {
  const center = map.getCenter()
  emit('search-area', {
    latitude: center.lat,
    longitude: center.lng
  })
}

onMounted(() => {
  map = L.map('map').setView([22.627, 120.301], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      gpsMarker = L.marker([latitude, longitude])
        .bindPopup('<strong>你的位置</strong>')
        .addTo(map)
      map.setView([latitude, longitude], 15)
      emit('update-location', { latitude, longitude })
    }, () => {
      console.warn('無法取得 GPS 位置')
    })
  }

})

watch(() => props.stores, (json) => {
  if (!json || !map || !markersLayer) return
  markersLayer.clearLayers()

  json.family.forEach(s => {
    L.marker([s.latitude, s.longitude], { icon: familyIcon })
      .bindPopup(`<strong>${s.name}</strong><br/>${s.address}`)
      .addTo(markersLayer)
  })

  json.seven.forEach(s => {
    L.marker([s.latitude, s.longitude], { icon: sevenIcon })
      .bindPopup(`<strong>${s.StoreName}</strong><br/>${s.StoreAddress}`)
      .addTo(markersLayer)
  })

  if (json.family.length > 0) {
    const { latitude, longitude } = json.family[0]
    map.setView([latitude, longitude], 15)
  } else if (json.seven.length > 0) {
    const { latitude, longitude } = json.seven[0]
    map.setView([latitude, longitude], 15)
  }

  if (gpsMarker) gpsMarker.addTo(map)
}, { immediate: true })

// 監聽外部要求的地圖移動（例如選擇行政區）
watch(() => props.centerLatLng, (newCenter) => {
  if (map && newCenter?.lat && newCenter?.lng) {
    map.setView([newCenter.lat, newCenter.lng], 15)
  }
})

const moveToGPS = () => {
  if (gpsMarker && map) {
    const latlng = gpsMarker.getLatLng()
    map.setView(latlng, 15)
    gpsMarker.openPopup()
  } else {
    alert('目前尚未取得 GPS 位置')
  }
}
</script>

<style scoped>
.map-container {
  width: 150%;
  height: 100%;
}

.gps-button{
  position: absolute;
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

.gps-button {
  bottom: 20px;
  right: 20px;
}

.gps-button:hover{
  background-color: #0c70d3;
}


.search-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
.search-button:hover {
  background-color: #218838;
}
</style>
