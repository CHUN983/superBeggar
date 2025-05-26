<template>
  <div v-if="stores" class="product-list">
    <!-- Toggle 切換區塊略 -->
    <div class="toggle-container">
      <span>全家</span>
      <div class="slider" @click="toggle">
        <div class="toggle-button" :class="{ active: !isFamilyMart }"></div>
      </div>
      <span>7-11</span>
    </div>

    <!-- 全家區塊 -->
    <div v-if="isFamilyMart">
      <div v-if="stores.family.length === 0" :style="{textAlign: 'center'}">
        <h2>目前商家沒有即期品</h2>
      </div>
      <ul>
        <li
          v-for="s in sortedFamily"
          :key="s.oldPKey"
          class="storeBlock"
          @click="fetchDetail(s, 'family')"
        >
          {{s.name}} {{s.distance.toFixed(0)}}m

          <button @click="toggleFavorite({ id: s.oldPKey, name: s.name, type:s.type, lat: s.latitude, lng: s.longitude })">
            <font-awesome-icon :icon="isFavorited(s.oldPKey) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation(s)">
            導航
          </button>
          <br>
          <ul class="categoryList">
            <li v-for="k in s.info" :key="k.code" class="categoryBlock">
              <img
                  :src="getCategoryIconPath_f(k.code)"
                  class="categoryIcon"
              />
              <span>{{k.name}}</span>
              <span>{{k.qty}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-else>
      <div v-if="stores.seven.length === 0" :style="{textAlign: 'center'}">
        <h2>目前商家沒有即期品</h2>
      </div>
      <ul>
        <li v-for="s in sevenCategoriesGrouped" :key="s.StoreNo" class="storeBlock" @click="fetchDetail(s, 'seven')">
          7-11{{s.StoreName}}店 {{s.Distance.toFixed(0)}}m

          <button @click="toggleFavorite({ id: s.StoreNo, name: s.StoreName,  type:s.type, lat: s.Latitude, lng: s.Longitude})">
            <font-awesome-icon :icon="isFavorited(s.StoreNo) ? ['fas', 'heart'] : ['far', 'heart']" />
          </button>
          <button @click="handleNavigation(s)">
            導航
          </button>
          <br>
          <ul class="categoryList">
            <li v-for="k in s.groupedItems" :key="k.name" class="categoryBlock">
              <img
                  :src="getCategoryIconPath_7(k.name)"
                  class="categoryIcon"
              />
              <span>{{k.name}}</span>
              <span>{{k.qty}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Store Detail 顯示區塊 -->
    <div v-if="selectedStoreDetail" class="store-detail-panel">
      <StoreDetail :detail="selectedStoreDetail" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFavorites } from '@/composables/useFavorites.js'
import StoreDetail from './StoreDetail.vue'  // 匯入元件
import axios from 'axios'

const isFamilyMart = ref(true);
const selectedStoreDetail = ref(null) // 儲存詳細資料
const props = defineProps({ stores: Object });
const { toggleFavorite, isFavorited } = useFavorites()


function toggle() {
  isFamilyMart.value = !isFamilyMart.value;
}


// 全家依距離排序
// 根據距離排序的 computed 屬性
const sortedFamily = computed(() => {
  return [...(props.stores.family || [])].sort((a, b) => a.distance - b.distance);
});

// 7-11 重分類並合併
const sevenCategoriesGrouped = computed(() => {
  if (!props.stores?.seven) return [];

  const groupMap = {
    '中式': '便當粥品',
    '燴飯': '便當粥品',
    '炒飯': '便當粥品',
    '粥品': '便當粥品',
    '蔬食米食': '便當粥品',

    '涼麵': '麵食',
    '義大利麵': '麵食',
    '炒麵': '麵食',
    '湯麵': '麵食',
    '蔬食麵': '麵食',

    '切片水果': '生鮮蔬果',

    '配菜型沙拉': '沙拉',
    '主食型沙拉': '沙拉',

    '配菜': '配菜湯品',
    '小吃': '配菜湯品',

    '壽司手捲類': '飯糰手卷',
    '4℃加熱飯糰': '飯糰手卷',
    '蔬食飯糰': '飯糰手卷',
    '三角飯糰': '飯糰手卷',
    '圓形飯糰': '飯糰手卷',

    '麵包': '麵包蛋糕',
    '點心': '麵包蛋糕',
    '吐司': '麵包蛋糕',

    '袋裝三明治': '三明治堡類',
    '長堡': '三明治堡類',
    '漢堡': '三明治堡類',
    '熱壓土司': '三明治堡類',

    '蛋糕': '甜點',
    '湯類甜點': '甜點',
    '泡芙': '甜點',

    '其他': '其他',
    '輕食便當': '其他',
    '異國料理/焗烤': '其他'
  };

  return props.stores.seven.map(store => {
    const grouped = {};
    store.items.forEach(item => {
      const groupName = groupMap[item.name] || '其他';
      if (!grouped[groupName]) grouped[groupName] = 0;
      grouped[groupName] += item.qty;
    });
    const groupedItems = Object.entries(grouped).map(([name, qty]) => ({
      name,
      qty
    }));

    return {
      ...store,
      groupedItems
    };
  });
});

const getCategoryIconPath_7 = (name) => {
  if( name === '飯糰手卷' )  return new URL('@/assets/icons/rice-ball.svg', import.meta.url).href
  if( name === '便當粥品' )  return new URL('@/assets/icons/bento.svg', import.meta.url).href
  if( name === '麵食' )  return new URL('@/assets/icons/noodles.svg', import.meta.url).href
  if( name === '配菜湯品' )  return new URL('@/assets/icons/soup.svg', import.meta.url).href
  if( name === '三明治堡類' )  return new URL('@/assets/icons/sandwich.svg', import.meta.url).href
  if( name === '生鮮蔬果' )  return new URL('@/assets/icons/banana.svg', import.meta.url).href
  if( name === '麵包蛋糕' )  return new URL('@/assets/icons/bread.svg', import.meta.url).href
  if( name === '沙拉' )  return new URL('@/assets/icons/salad.svg', import.meta.url).href
  if( name === '甜點' )  return new URL('@/assets/icons/cake.svg', import.meta.url).href
  return new URL('@/assets/icons/other.svg', import.meta.url).href
}

const getCategoryIconPath_f = (code) => {
  if( code === 'A' )  return new URL('@/assets/icons/rice-ball.svg', import.meta.url).href
  if( code === 'B' )  return new URL('@/assets/icons/bento.svg', import.meta.url).href
  if( code === 'C' )  return new URL('@/assets/icons/noodles.svg', import.meta.url).href
  if( code === 'D' )  return new URL('@/assets/icons/soup.svg', import.meta.url).href
  if( code === 'E' )  return new URL('@/assets/icons/sandwich.svg', import.meta.url).href
  if( code === 'F' )  return new URL('@/assets/icons/banana.svg', import.meta.url).href
  if( code === 'G' )  return new URL('@/assets/icons/bread.svg', import.meta.url).href
  return new URL('@/assets/icons/cake.svg', import.meta.url).href
}

// 點擊商店後取得詳細資料
async function fetchDetail(store, type) {
  const storeNo = type === 'family' ? store.oldPKey : store.StoreNo;

  // 若點擊的是當前選中的商店，則收回
  if (selectedStoreDetail.value?.type === type &&
      selectedStoreDetail.value?.storeNo === storeNo) {
    selectedStoreDetail.value = null;
    return;
  }

  console.log(type)

  const lat = type === 'family' ? store.latitude : store.Latitude;
  const lng = type === 'family' ? store.longitude : store.Longitude;

  try {
    const res = await axios.post('/api/store-detail', {
      type,
      storeNo,
      latitude: lat,
      longitude: lng,
    });

    console.log(res.data)
    if (res.data.success) {
      selectedStoreDetail.value = res.data.data[type];
      selectedStoreDetail.value.type = type;  // 傳遞類型資訊
      selectedStoreDetail.value.storeNo = storeNo; // 新增 storeNo 用來識別
    }
  } catch (e) {
    console.error('取得商店詳細資料失敗', e);
  }
}
</script> 



<style scoped>
/* 原有樣式不變 */
  .product-list {
    position: relative;
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

  .storeBlock:hover{
    background-color: #dddada;
  }

  .categoryList {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 一行四格 */
    gap: 10px;
    margin-top: 10px;
    font-size: 12px;
  }

  .categoryBlock {
    list-style: none;
    border-radius: 8px;
    background-color: #f9f9f9;
    text-align: center;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .storeBlock:hover .categoryBlock {
    background-color: #dddada;
  }

  .categoryIcon {
    width: 28px;
    height: 28px;
    margin: 0 auto 4px;
  }

  .store-detail-panel {
    position: fixed;
    top: 12%;
    left: 31.5vw;
    padding: 10px;
    width: auto;
    height: 80vh;
    border-radius: 16px;
    background-color: white;
    border-left: 2px solid #ccc;
    overflow-y: auto;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
  }
</style>
