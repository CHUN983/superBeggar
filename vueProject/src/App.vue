<template>
  <div class="body-grid">
    <div :class="['menu']">
      <Menu @toggleList="ListOpen = !ListOpen" />
    </div>
    <div :class="['productList', ListOpen ? 'open' : 'closed']">
      <ProductList :stores="stores" :loading="loading" :error="error" />
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
      />
    </div>
  </div>


</template>

<script setup>
import { ref, watch } from 'vue'
import Menu from '@/components/Menu.vue'
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import MapView from '@/components/MapView.vue'
import ProductList from '@/components/ProductList.vue'

const ListOpen = ref(true)
const zip = ref('')
const userLat = ref(0)
const userLng = ref(0)

const stores = ref({ family: [], seven: [] })
const loading = ref(false)
const error = ref(null)

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