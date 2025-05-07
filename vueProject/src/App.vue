<!-- src/App.vue -->
<template>
  <div class="body-grid">
    <!-- Sidebar wrapper：綁定 open 狀態並套用 class -->
    <div :class="['sidebar', sidebarOpen ? 'open' : 'closed']">
      <Sidebar />
    </div>
    <!-- Header：接收切換事件 -->
    <div class="header">
      <HeaderBar @toggleSidebar="sidebarOpen = !sidebarOpen" />
    </div>
    <!-- Main 地圖區 -->
    <div class="main">
      <MapView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar   from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView   from '@/components/MapView.vue'

const sidebarOpen = ref(true)
</script>
