<template>
  <div v-if="stores" class="product-list">
    <div class="toggle-container">
      <span>全家</span>
      <div class="slider" @click="toggle">
        <div class="toggle-button" :class="{ active: !isFamilyMart }"></div>
      </div>
      <span>7-11</span>
    </div>

    <div v-if="isFamilyMart">
      <div v-if="stores.family.length === 0" :style="{textAlign: 'center'}">
        <h2>目前商家沒有即期品</h2>
      </div>
      <ul>
        <li v-for="s in sortedFamily" :key="s.oldPKey" class="storeBlock">
          {{s.name}} {{s.distance.toFixed(0)}}m

          <button @click="toggleFavorite({ id: s.oldPKey, name: s.name, type:s.type, lat: s.latitude, lng: s.longitude })">
            <font-awesome-icon :icon="isFavorited(s.oldPKey) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation(s)">
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
      <div v-if="stores.seven.length === 0" :style="{textAlign: 'center'}">
        <h2>目前商家沒有即期品</h2>
      </div>
      <ul>
        <li v-for="s in stores.seven" :key="s.StoreNo" class="storeBlock">
          7-11{{s.StoreName}}店 {{s.Distance.toFixed(0)}}m

          <button @click="toggleFavorite({ id: s.StoreNo, name: s.StoreName,  type:s.type, lat: s.Latitude, lng: s.Longitude})">
            <font-awesome-icon :icon="isFavorited(s.StoreNo) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation(s)">
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
import { ref, computed } from 'vue';
import { useFavorites } from '@/composables/useFavorites.js'

const isFamilyMart = ref(true);
function toggle() {
  isFamilyMart.value = !isFamilyMart.value;
}

const props = defineProps({ stores: Object });
const { toggleFavorite, isFavorited } = useFavorites()

// 根據距離排序的 computed 屬性
const sortedFamily = computed(() => {
  return [...(props.stores.family || [])].sort((a, b) => a.distance - b.distance);
});

const sortedSeven = computed(() => {
  return [...(props.stores.seven || [])].sort((a, b) => a.Distance - b.Distance);
});
const emit = defineEmits(['navigate-to'])

function handleNavigation(store) {
  emit('navigate-to', {
    latitude: store.latitude,
    longitude: store.longitude
  })
}
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
    cursor: pointer;
  }

  .storeBlock:hover {
    background-color: #e0e0e0;
  }

  .categoryBlock {
    list-style: none;
  }
</style>
