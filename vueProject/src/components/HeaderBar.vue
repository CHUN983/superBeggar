<template>
  <div class="header-bar">

    <span class="title">我的超人地圖</span>

    <div class="favorite-btn">
      <button variant="ghost" @click="$emit('toggleFavoriteMode')">
        <Heart class="mr-2" /> 我的最愛
      </button>
    </div>
  </div>
</template>

<script setup>
import { Heart } from 'lucide-vue-next' // 確保你有引入這個 icon
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.5em;
}

button {
  padding: 0.3em 0.6em;
  cursor: pointer;
}

.title {
  font-size: 2.0em;
}

/* 將我的最愛推到最右邊 */
.favorite-btn {
  margin-left: auto;
}
</style>
