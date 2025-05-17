<!-- src/App.vue -->
<template>
  <div class="body-grid">
    <!-- Sidebar wrapper：綁定 open 狀態並套用 class -->
    <div :class="['sidebar', sidebarOpen ? 'open' : 'closed']">
      <Sidebar @update-selection="onSelect" />
      <ProductList
        :zip="zip"
        :latitude="userLat"
        :longitude="userLng"
      />              <!-- 傳 zip 給商品列表元件 -->
    </div>
    <!-- Header：接收切換事件 -->
    <div class="header">
      <HeaderBar @toggleSidebar="sidebarOpen = !sidebarOpen" />
    </div>
    <!-- Main 地圖區 -->
    <div class="main">
      <MapView :zip="zip" @update-location="handleUpdateLocation" />                   <!-- 傳 zip 給地圖元件 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar   from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView   from '@/components/MapView.vue'
import ProductList from '@/components/ProductList.vue'
import { LatLng } from 'leaflet'

const sidebarOpen = ref(true)
const zip = ref('')                            // 儲存當前選擇的郵遞區號
const userLat = ref(0)
const userLng = ref(0)


function onSelect({ zip: z, latitude, longitude }) {
  zip.value     = z
  userLat.value = latitude
  userLng.value = longitude
}
</script>
