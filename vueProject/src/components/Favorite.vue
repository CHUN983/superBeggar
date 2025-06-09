<template>
  <div class="product-list">
    <h2 class="text-xl font-bold mb-4">我的最愛</h2>
    <div v-if="loading">載入中...</div>
    <div v-else-if="detailedFavorites.length === 0" class="text-gray-500 text-center">目前沒有收藏的店家。</div>
    <ul v-else>
      <li
        v-for="store in detailedFavorites"
        :key="store.id"
        class="storeBlock"
        @click="handleDetail(store)"
      >
        {{ store.name }}
        <button @click.stop="onUnfavorite(store)">
          <font-awesome-icon
            :icon="[isFavorited(store) ? 'fas' : 'far', 'heart']"
            :class="isFavorited(store) ? 'text-red-500' : 'text-gray-400'"
          />
        </button>
        <button @click.stop="handleNavigation(store)">
          導航
        </button>
        <br />

        <div v-if="store.items && store.items.length > 0">
          <ul class="categoryList">
            <li v-for="item in store.items" :key="item.code || item.name" class="categoryBlock">
              <img
                :src="getCategoryIconPath(store, item)"
                class="categoryIcon"
              />
              <span>{{ item.name }}</span>
              <span>{{ item.qty }}</span>
            </li>
          </ul>
        </div>
        <div v-else style="text-align: center; color: gray">
          當前門市沒有即期品
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites.js'

const { getAllFavorites, toggleFavorite } = useFavorites()
const favorites = ref(getAllFavorites())
const detailedFavorites = ref([])
const loading = ref(true)

function isFavorited(store) {
  return favorites.value.some(f => f.id === store.id && f.type === store.type)
}

// 修改取消收藏邏輯
function onUnfavorite(store) {
  toggleFavorite(store)
  favorites.value = getAllFavorites()
  loadDetails()
}

function handleNavigation(store) {
  console.log('導航到：', store)
}

function handleDetail(store) {
  console.log('跳到詳細資料：', store)
}

function getCategoryIconPath(store, item) {
  if (store.type === 'seven') {
    if( item.name === '飯糰手卷' )  return new URL('@/assets/icons/rice-ball.svg', import.meta.url).href
    if( item.name === '便當粥品' )  return new URL('@/assets/icons/bento.svg', import.meta.url).href
    if( item.name === '麵食' )  return new URL('@/assets/icons/noodles.svg', import.meta.url).href
    if( item.name === '配菜湯品' )  return new URL('@/assets/icons/soup.svg', import.meta.url).href
    if( item.name === '三明治堡類' )  return new URL('@/assets/icons/sandwich.svg', import.meta.url).href
    if( item.name === '生鮮蔬果' )  return new URL('@/assets/icons/banana.svg', import.meta.url).href
    if( item.name === '麵包蛋糕' )  return new URL('@/assets/icons/bread.svg', import.meta.url).href
    if( item.name === '沙拉' )  return new URL('@/assets/icons/salad.svg', import.meta.url).href
    if( item.name === '甜點' )  return new URL('@/assets/icons/cake.svg', import.meta.url).href
    return new URL('@/assets/icons/other.svg', import.meta.url).href
  }else{
    if( item.code === 'A' )  return new URL('@/assets/icons/rice-ball.svg', import.meta.url).href
    if( item.code === 'B' )  return new URL('@/assets/icons/bento.svg', import.meta.url).href
    if( item.code === 'C' )  return new URL('@/assets/icons/noodles.svg', import.meta.url).href
    if( item.code === 'D' )  return new URL('@/assets/icons/soup.svg', import.meta.url).href
    if( item.code === 'E' )  return new URL('@/assets/icons/sandwich.svg', import.meta.url).href
    if( item.code === 'F' )  return new URL('@/assets/icons/banana.svg', import.meta.url).href
    if( item.code === 'G' )  return new URL('@/assets/icons/bread.svg', import.meta.url).href
    return new URL('@/assets/icons/cake.svg', import.meta.url).href
  }
}

async function loadDetails() {
  loading.value = true
  const all = getAllFavorites()
  const results = []

  for (const store of all) {
  try {
    const res = await fetch('/api/store-detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: store.type,
        storeNo: store.id,
        latitude: 0,
        longitude: 0,
      }),
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      // 無即期品或店家找不到（例如 404）
      results.push({
        id: store.id,
        type: store.type,
        name: store.name || '未知店名',
        lat: 0,
        lng: 0,
        items: [], // 讓前端進入「沒有即期品」的條件
      })
      continue
    }

    let s = store.type === 'family' ? json.data.family : json.data.seven
    results.push({
      id: store.id,
      type: store.type,
      name: s.name || '7-11'+s.rawItems.StoreName+'店',
      lat: s.latitude,
      lng: s.longitude,
      items: s.info || s.groupedItems || [], // 統一用 items
    })
  } catch (err) {
    console.error('Fetch error for store', store.id, err)

    // 也可以在例外情況下加入 placeholder
    results.push({
      id: store.id,
      type: store.type,
      name: store.name || '未知店名',
      lat: 0,
      lng: 0,
      items: [],
    })
  }
}


  detailedFavorites.value = results
  loading.value = false
}

onMounted(() => {
  loadDetails()
})
</script>

<style scoped>
.product-list {
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 90vh;
  padding: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
.storeBlock {
  border: 2px solid #6d6d6d;
  border-radius: 8px;
  margin: 10px 0;
  padding: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.categoryList {
  margin-top: 8px;
}
.categoryBlock {
  display: flex;
  align-items: center;
  gap: 8px;
}
.categoryIcon {
  width: 24px;
  height: 24px;
}
</style>
