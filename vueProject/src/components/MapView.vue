<!-- src/components/MapView.vue -->
<template>
    <div id="map" class="map-container"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  onMounted(async () => {
    const map = L.map('map').setView([22.627,120.301],14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OSM' }).addTo(map)
    map.invalidateSize()
    const shopData = await (await fetch('/data/shops.json')).json()
    shopData.forEach(s => L.marker([s.latitude,s.longitude]).addTo(map).bindPopup(s.name))
  })
  </script>
  
  <style scoped>
  .map-container {
    width: 100%; height: 100%; /* 填滿 grid-area main */ 
  }
  </style>
  