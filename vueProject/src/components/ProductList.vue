<template>
  <div v-if="stores" class="product-list">
    <div class="toggle-container">
      <span :style="{textAlign: 'left'}">全家</span>
      <div class="slider" @click="toggle">
        <div class="toggle-button" :class="{ active: !isFamilyMart }"></div>
      </div>
      <span :style="{textAlign: 'right'}">7-11</span>
    </div>

    <div v-if="isFamilyMart">
      <ul>
        <li v-for="s in stores.family" :key="s.oldPKey" class="storeBlock">
          {{s.name}} {{s.distance.toFixed(0)}}m

          <button @click="toggleFavorite({ id: s.oldPKey, name: s.name, lat: s.latitude, lng: s.longitude })">
            <font-awesome-icon :icon="isFavorited(s.oldPKey) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation">
            導航
          </button>
          <button @click="handleNavigation">
            詳細資料
          </button>
          <br>
          <ul>
            <li v-for="k in s.info" :key="k.code" class="categoryBlock">
              {{k.name}} — {{k.qty}}
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-else="">
      <ul>
        <li v-for="s in stores.seven" :key="s.StoreNo" class="storeBlock">
          7-11{{s.StoreName}}店 {{s.Distance.toFixed(0)}}m
          <button @click="toggleFavorite({ id: s.StoreNo, name: s.StoreName, lat: s.Latitude, lng: s.Longitude })">
            <font-awesome-icon :icon="isFavorited(s.StoreNo) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation">
            導航
          </button>
          <button @click="handleNavigation">
            詳細資料
          </button>
          <br>
          <ul>
            <li v-for="k in s.CategoryStockItems" :key="k.NodeID" class="categoryBlock">
              {{k.Name}} — {{k.RemainingQty}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFavorites } from '@/composables/useFavorites.js'

  const isFamilyMart = ref(true);

  function toggle() {
    isFamilyMart.value = !isFamilyMart.value;
  }

  const props = defineProps({ stores: Object })
  const { toggleFavorite, isFavorited } = useFavorites()
</script>

<style scoped>
  .product-list {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    height: 97vh;
    padding: 10px; 
  }

  .toggle-container {
    width: 100%;
    display: flex;
    font-size: 20px;
    font-weight:  bold;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .slider {
    width: 60%;
    height: 30px;
    background-color: #ccc;
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    align-items: center;
    transition: background-color 0.3s;
  }

  .toggle-button {
    width: 50%;
    height: 100%;
    background-color: rgb(150, 150, 150);
    border-radius: 8px;
    position: absolute;
    left: 0.1px;
    transition: left 0.3s;
  }

  .toggle-button.active {
    left: 50%;
  }

    
  ul, li {
    margin: 0;
    padding: 0;
  }

  .storeBlock {
    list-style: none;
    border: 2px solid #6d6d6d;
    border-radius: 8px;
    margin: 10px 0;
    padding: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .categoryBlock {
    list-style: none;
  }
</style>
