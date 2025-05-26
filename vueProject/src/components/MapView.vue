<template>
  <div id="map" class="map-container"></div>

  <!-- 右下角按鈕 -->
  <button class="gps-button" @click="moveToGPS">回到我的位置</button>
  <button class="search-button" @click="searchCurrentArea">搜尋這個區域</button>

  <!-- 導航取消按鈕（使用同 gps-button 樣式） -->
  <button v-if="routingControl" class="gps-button cancel-button" @click="cancelNavigation">
    取消導航
  </button>
</template>

<script setup>
import { onMounted, watch, defineEmits, ref, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import iconImg from '@/assets/familymart.png'
import sevenIconImg from '@/assets/seven11.png'
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
})

const props = defineProps({
  zip: String,
  stores: Object,
  centerLatLng: Object,
  navigationTarget: Object
})
const emit = defineEmits(['update-location', 'search-area', 'map-ready'])

let map, markersLayer, gpsMarker, destinationMarker = null
let currentNavigatedMarker = null
const routingControl = ref(null)

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
  if (!map) return
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
      .bindPopup(`<strong>${s.StoreName}</strong><br/>${s.address}`)
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

watch(() => props.centerLatLng, (newCenter) => {
  if (map && newCenter?.lat && newCenter?.lng) {
    map.setView([newCenter.lat, newCenter.lng], 15)
  }
})

watch(() => props.navigationTarget, (target) => {
  if (!target || !map || !gpsMarker) return

  const from = gpsMarker.getLatLng()
  const to = L.latLng(target.latitude, target.longitude)

  // 移除舊的路線
  if (routingControl.value) {
    map.removeControl(routingControl.value)
    routingControl.value = null
  }

  // 還原上次導航的 marker 圖示
  if (currentNavigatedMarker && currentNavigatedMarker.originalIcon) {
    currentNavigatedMarker.setIcon(currentNavigatedMarker.originalIcon)
    currentNavigatedMarker = null
  }

  // 找到目前要導航的 marker 並換成紅色水滴
  markersLayer.eachLayer(layer => {
    const latlng = layer.getLatLng()
    if (latlng.lat === target.latitude && latlng.lng === target.longitude) {
      currentNavigatedMarker = layer
      currentNavigatedMarker.originalIcon = layer.options.icon // 儲存原圖示
      currentNavigatedMarker.setIcon(redIcon)
    }
  })

  // 顯示導航路線
  routingControl.value = L.Routing.control({
    waypoints: [from, to],
    routeWhileDragging: false,
    show: true,
    addWaypoints: false,
    collapsible: true,
    createMarker: () => null
  }).addTo(map)
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

const cancelNavigation = () => {
  if (routingControl.value) {
    map.removeControl(routingControl.value)
    routingControl.value = null
  }

  // 還原店家 marker 圖示
  if (currentNavigatedMarker && currentNavigatedMarker.originalIcon) {
    currentNavigatedMarker.setIcon(currentNavigatedMarker.originalIcon)
    currentNavigatedMarker = null
  }
}


onBeforeUnmount(() => {
  if (routingControl.value && map) {
    map.removeControl(routingControl.value)
  }
  if (destinationMarker && map) {
    map.removeLayer(destinationMarker)
  }
})
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
}

.gps-button:hover {
  background-color: #0c70d3;
}

.search-button {
  position: absolute;
  z-index: 1000;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  bottom: 20px;
  right: 140px;
}

.search-button:hover {
  background-color: #218838;
}

/* 讓取消導航按鈕與 GPS 按鈕不同位置（例如往上浮） */
.cancel-button {
  bottom: 70px !important;
  background-color: #dc3545; /* Bootstrap 紅 */
}

.cancel-button:hover {
  background-color: #c82333; /* hover 紅色加深 */
}

</style>

<style>
/* 隱藏 Leaflet Routing Machine 的導航資訊卡 */
.leaflet-routing-container {
  display: none !important;
}
</style>
