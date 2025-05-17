<template>
  <div v-if="zip || (latitude && longitude)" class="product-list">
    <h3>搜尋結果</h3>
    <div v-if="loading">載入中…</div>
    <div v-else-if="error">載入失敗：{{ error }}</div>
    <div v-else>
      <h4>全家即期品</h4>
      <ul>
        <li v-for="s in shops.family" :key="s.oldPKey">
          {{ s.name }} — {{ s.address }}
        </li>
      </ul>
      <h4>7-11 即期品</h4>
      <ul>
        <li v-for="s in shops.seven" :key="s.StoreNo">
          {{ s.StoreName }} — {{ s.StoreAddress }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  zip:       String,
  latitude:  Number,
  longitude: Number
})

const shops  = ref({ family: [], seven: [] })
const loading = ref(false)
const error   = ref(null)

watch(
  () => [props.zip, props.latitude, props.longitude],
  async ([zip, lat, lon]) => {
    if (!zip && !(lat && lon)) {
      shops.value = { family: [], seven: [] }
      return
    }
    loading.value = true
    error.value   = null

    try {
      // 呼叫後端整合端點
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip, latitude: lat, longitude: lon })
      }) 
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const json = await res.json()
      shops.value = {
        family: json.family  || [], 
        seven:  json.seven   || []
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.product-list { overflow-y: auto; max-height: 80vh; }
</style>
