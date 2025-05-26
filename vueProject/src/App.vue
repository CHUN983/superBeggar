<template>
  <div class="body-grid">
    <div :class="['menu']">
      <Menu :currentSidebar="currentSidebar" @select="openSidebar" />
    </div>

    <div :class="['productList', currentSidebar ? 'open' : 'closed']">
    <component
      :is="sidebarComponent"
      :stores="filteredStores"
      v-if="sidebarComponent"
      @update-selection="onSelect"
      @navigate-to="navigationTarget = $event"  
    />
  </div>
    <div class="header">
      <HeaderBar />
    </div>
    <div class="main">
      <MapView
        ref="mapRef"
        :stores="stores"
        :zip="zip"
        :centerLatLng="{ lat: userLat, lng: userLng }"
        :navigationTarget="navigationTarget"
        @update-location="handleUpdateLocation"
        @search-area="onSearchArea"
        @toggleList="ListOpen = !ListOpen" 
        @searchClick="isSearchOpen = !isSearchOpen" 
      />
    </div>
  </div>


</template>

<script setup>
import { ref, watch, computed, provide } from 'vue'
import Menu from '@/components/Menu.vue'
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView from '@/components/MapView.vue'
import ProductList from '@/components/ProductList.vue'
import { useFavorites } from '@/composables/useFavorites.js'
import Favorite from '@/components/Favorite.vue'



const mapRef = ref(null) // 🌟 用來取得 MapView 的 exposed 方法

const navigateToStore = (lat, lng, name) => {
  const mapComponent = mapRef.value
  if (!mapComponent || !mapComponent.navigateToStore) {
    alert('導航功能尚未就緒')
    return
  }
  mapComponent.navigateToStore(lat, lng, name)
}

provide('navigateToStore', navigateToStore)



const currentSidebar = ref(null)  // null / 'search' / 'favorite' / 'other'
const ListOpen = ref(false)
const isSearchOpen = ref(false) // 控制是否顯示 ProductList
const zip = ref('')
const userLat = ref(0)
const userLng = ref(0)
const navigationTarget = ref(null)

const stores = ref({ family: [], seven: [] })
const loading = ref(false)
const error = ref(null)

const { getAllFavorites } = useFavorites()


const sidebarComponent = computed(() => {
  switch (currentSidebar.value) {
    case 'bar':
      return ProductList
    case 'search':
      return ProductList
    case 'location':
      return Sidebar
    case 'favorite':
      return  Favorite 
    // case 'other':
    //   return OtherPanel
    default:
      return null
  }
})

const filteredStores = computed(() => {
  if (currentSidebar.value !== 'favorite') return stores.value

  const favorites = getAllFavorites()
  return {
    family: favorites.filter(s => typeof s.oldPKey !== 'undefined'),
    seven: favorites.filter(s => typeof s.StoreNo !== 'undefined')
  }
})

function onSelect({ zip: z, latitude, longitude }) {
  zip.value = z
  userLat.value = latitude
  userLng.value = longitude
}

function handleUpdateLocation({ latitude, longitude }) {
  userLat.value = latitude
  userLng.value = longitude
}

function onSearchArea({ latitude, longitude }) {
  zip.value = ''  // 👈 清除 zip，代表不是從行政區查詢
  userLat.value = latitude
  userLng.value = longitude
}


function openSidebar(name) {
  if (name === 'bar') {
    // 切換 bar 狀態（實際切到 search）
    if (currentSidebar.value === null) {
      currentSidebar.value = 'search'
    } else {
      currentSidebar.value = null
    }
  } else {
    currentSidebar.value = name
  }
}

watch([zip, userLat, userLng], async ([z, lat, lng]) => {
  if (!z && !(lat && lng)) {
    stores.value = { family: [], seven: [] }
    return
  }
  loading.value = true
  error.value = null

  try {
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zip: z, latitude: lat, longitude: lng })
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const json = await res.json()
    stores.value = {
      family: json.family || [],
      seven: json.seven || []
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}, { immediate: true })

</script>