<template>
  <div class="body-grid">
    <div :class="['menu']">
      <Menu :currentSidebar="currentSidebar" @select="openSidebar" />
    </div>

    <div :class="['productList', currentSidebar ? 'open' : 'closed']">
    <component
      :is="sidebarComponent"
      :stores="stores"
      v-if="sidebarComponent"
      @update-selection="onSelect"
    />
  </div>
    <div class="header">
      <HeaderBar />
    </div>
    <div class="main">
      <MapView
        :stores="stores"
        :zip="zip"
        :centerLatLng="{ lat: userLat, lng: userLng }"
        @update-location="handleUpdateLocation"
        @search-area="onSearchArea"
        @toggleList="ListOpen = !ListOpen" 
        @searchClick="isSearchOpen = !isSearchOpen" 
      />
    </div>
  </div>


</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Menu from '@/components/Menu.vue'
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView from '@/components/MapView.vue'
import ProductList from '@/components/ProductList.vue'


const currentSidebar = ref(null)  // null / 'search' / 'favorite' / 'other'
const ListOpen = ref(false)
const isSearchOpen = ref(false) // 控制是否顯示 ProductList
const zip = ref('')
const userLat = ref(0)
const userLng = ref(0)

const stores = ref({ family: [], seven: [] })
const loading = ref(false)
const error = ref(null)


const sidebarComponent = computed(() => {
  switch (currentSidebar.value) {
    case 'bar':
      return ProductList
    case 'search':
      return ProductList
    case 'location':
       return Sidebar
    // case 'other':
    //   return OtherPanel
    default:
      return null
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