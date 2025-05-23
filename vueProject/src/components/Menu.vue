<template>
  <div class="menu-content">
    <button class="handleSetting" @click="$emit('toggleSidebar')">
      <br>
      <img src="@/assets/bars.svg" style="width: 36px; height: 36px;"/>
      <br>
      
    </button>

    <button class="handleSearch" @click="goSetting">
      <img src="@/assets/search.svg" style="width: 36px; height: 36px;"/>
      <br>
      搜尋
    </button>

    <button class="handleFavorite" @click="goToFavorites">
      <img src="@/assets/heart.svg" style="width: 36px; height: 36px;"/>
      <br>
      我的最愛
    </button>
    
  </div>
</template>

<script setup>
  function handleSearch() {
    console.log('跳轉到設定');
  }
  function habdleFavorites() {
    console.log('前往我的最愛')
  }
</script>

<style scoped>

.menu-content {
  background-color: rgb(240, 240, 240);
  overflow-y: fixed;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 2em;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

button {
  border: none;
  cursor: pointer;
}
</style>