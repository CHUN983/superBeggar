<template>
    <div>
      <h2 class="text-xl font-bold mb-4">我的最愛</h2>
      <div v-if="loading">載入中...</div>
      <div v-else-if="detailedFavorites.length === 0" class="text-gray-500">目前沒有收藏的店家。</div>
      <div v-else class="product-list">
        <ul>
          <li v-for="store in detailedFavorites" :key="store.id" class="storeBlock">
            {{ store.name }}
            <button @click="onUnfavorite(store)">
              <font-awesome-icon :icon="['fas', 'heart']" class="text-red-500" />
            </button>
            <button @click="handleNavigation(store)">導航</button>
            <button @click="handleDetail(store)">詳細資料</button>
            <br />
            <ul>
              <li
                v-for="item in store.items"
                :key="item.code"
                class="categoryBlock"
              >
                {{ item.name }} — {{ item.qty }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFavorites } from '@/composables/useFavorites.js'
  
  
  const { getAllFavorites, toggleFavorite } = useFavorites()
  const favorites = ref(getAllFavorites())
  
  const detailedFavorites = ref([])
  const loading = ref(true)
  
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
  
  async function loadDetails() {
    loading.value = true
    const all = getAllFavorites()
    const familyIds = all.filter(s => s.type === 'family').map(s => s.id)
    const sevenIds = all.filter(s => s.type === 'seven').map(s => s.id)
    console.log("all", all)

    const results = []

    for (const id of familyIds) {
        console.log("family: ", id);
        const res = await fetch('/api/store-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'family', storeNo: id, latitude: 0, longitude: 0 })
        })
        const json = await res.json()
        const s = json.data.family
        results.push({
        id: s.oldPKey,
        name: s.name,
        lat: s.latitude,
        lng: s.longitude,
        items: s.info.map(k => ({ name: k.name, qty: k.qty, code: k.code }))
        })
    }

    for (const id of sevenIds) {
        console.log("seven: ", id);
        const res = await fetch('/api/store-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'seven', storeNo: id, latitude: 0, longitude: 0 })
        })
        const json = await res.json()
        const s = json.data.seven
        results.push({
        id: s.StoreNo,
        name: s.StoreName,
        items: s.CategoryStockItems.map(k => ({
            name: k.Name,
            qty: k.RemainingQty,
            code: k.NodeID
        }))
        })
    }

    detailedFavorites.value = results
    loading.value = false
    }

  
    console.log("pass before onMounted")
   
    onMounted(() => {
      console.log('FavoritesList onMounted 執行')
      try {
        loadDetails()
      } catch (e) {
        console.error('loadDetails 發生錯誤', e)
      }
    })
  </script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  
  .product-list {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    height: 90vh;
    padding: 10px;
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
  