<template>
  <div id="map" class="map-container"></div>
  <button class="gps-button" @click="moveToGPS">回到我的位置</button>
  <button class="search-button" @click="searchCurrentArea">搜尋這個區域</button>
</template>

<script setup>
import { onMounted, watch, defineEmits, defineExpose } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import iconImg from '@/assets/familymart.png'
import sevenIconImg from '@/assets/seven11.png'

const props = defineProps({
  zip: String,
  stores: Object,
  centerLatLng: Object
})
const emit = defineEmits(['update-location', 'search-area', 'map-ready'])

let map, markersLayer, gpsMarker, routingControl

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

  emit('map-ready', map)

  defineExpose({
    getMap: () => map
  })
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

const moveToGPS = () => {
  if (gpsMarker && map) {
    const latlng = gpsMarker.getLatLng()
    map.setView(latlng, 15)
    gpsMarker.openPopup()
  } else {
    alert('目前尚未取得 GPS 位置')
  }
}

const navigateToStore = (targetLat, targetLng, storeName) => {
  if (!map) return

  navigator.geolocation.getCurrentPosition(position => {
    const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude)
    const storeLatLng = L.latLng(targetLat, targetLng)

    if (routingControl) {
      map.removeControl(routingControl)
    }

    routingControl = L.Routing.control({
      waypoints: [userLatLng, storeLatLng],
      routeWhileDragging: false,
      draggableWaypoints: false,
      show: true,
      createMarker: () => null
    }).addTo(map)

    routingControl.on('routesfound', function (e) {
      const route = e.routes[0]
      const totalSeconds = route.summary.totalTime

      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.round((totalSeconds % 3600) / 60)

      let timeStr = ''
      if (hours > 0) {
        timeStr += `${hours} 小時 `
      }
      timeStr += `${minutes} 分鐘`

      console.log(`導航完成，車程時間：${timeStr}`)

      setTimeout(() => {
        const existingBtn = document.getElementById('cancelRouteFixedBtn')
        if (!existingBtn) {
          const btn = document.createElement('button')
          btn.id = 'cancelRouteFixedBtn'
          btn.textContent = '取消導航'
          btn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 1100;
            padding: 6px 10px;
            font-size: 13px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          `
          btn.onclick = () => {
            if (routingControl) {
              map.removeControl(routingControl)
              routingControl = null
            }
            map.closePopup()
            btn.remove()
          }
          document.getElementById('map')?.appendChild(btn)
        }
      }, 100)

      map.setView(storeLatLng, 15)
    })
  }, () => {
    alert('無法取得您的 GPS 位置')
  })
}

defineExpose({
  getMap: () => map,
  navigateToStore
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.gps-button {
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
  bottom: 20px;
  right: 20px;
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

.leaflet-routing-container {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background-color: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  width: 260px;
  max-height: 320px;
  overflow-y: auto;
  font-size: 14px;
}
</style>
