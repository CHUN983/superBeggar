<!-- src/App.vue -->
<template>
  <div class="body-grid">
    <!-- Sidebar wrapper：綁定 open 狀態並套用 class -->
    <div :class="['sidebar', sidebarOpen ? 'open' : 'closed']">
      <Sidebar @update:zip="zip = $event" />   <!-- 接收子元件 emit 的 zip -->
      <ProductList :zip="zip" />               <!-- 傳 zip 給商品列表元件 -->
    </div>
    <!-- Header：接收切換事件 -->
    <div class="header">
      <HeaderBar @toggleSidebar="sidebarOpen = !sidebarOpen" />
    </div>
    <!-- Main 地圖區 -->
    <div class="main">
      <MapView :zip="zip" />                   <!-- 傳 zip 給地圖元件 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar   from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView   from '@/components/MapView.vue'
import ProductList from '@/components/ProductList.vue'

const sidebarOpen = ref(true)
const zip = ref('')                            // 儲存當前選擇的郵遞區號
</script>
