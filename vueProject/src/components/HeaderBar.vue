<!-- src/components/HeaderBar.vue -->
<template>
    <div class="header-bar">
      <button @click="$emit('toggleSidebar')">
        {{ /* 可顯示 icon */ '☰' }}
      </button>
      <span class="title">我的超人地圖</span>
    </div>
  </template>
  <script setup></script>
  <style scoped>
  .header-bar {
    display: flex; align-items: center; gap: 1em;
  }
  button {
    padding: 0.3em 0.6em; cursor: pointer;
  }
  .title { font-size: 1.2em; }
  </style>
  