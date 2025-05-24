<template>
    <div>
      <h2 class="text-xl font-bold mb-4">我的最愛</h2>
      <div v-if="favorites.length === 0" class="text-gray-500">目前沒有收藏的店家。</div>
      <ul v-else>
        <li
          v-for="store in favorites"
          :key="store.id"
          class="mb-4 p-3 border rounded shadow-sm bg-white"
        >
          <div class="font-semibold text-lg">{{ store.name }}</div>
          <div class="text-sm text-gray-600">
            經緯度：({{ store.lat }}, {{ store.lng }})
          </div>
          <button
            @click="onUnfavorite(store)"
            class="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            取消收藏
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { useFavorites } from '@/composables/useFavorites.js'
  import { ref, watchEffect } from 'vue'
  
  const { getAllFavorites, toggleFavorite } = useFavorites()
  const favorites = ref(getAllFavorites())
  
  function onUnfavorite(store) {
    toggleFavorite(store)
    favorites.value = getAllFavorites()
  }
  </script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  </style>
  