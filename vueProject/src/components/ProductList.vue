<!-- src/components/ProductList.vue -->
<template>
    <div v-if="zip" class="product-list">
      <h3>區域 {{ zip }} 全家即期品</h3>
      <div v-if="loading">載入中…</div>
      <div v-else-if="error">載入失敗：{{ error }}</div>
      <ul v-else>
        <li v-for="shop in shops" :key="shop.oldPKey">
          <strong>{{ shop.name }}</strong> — {{ shop.address }}
          <ul>
            <li v-for="group in shop.info" :key="group.code">
              {{ group.name }} (共 {{ group.qty }} 件)
              <ul>
                <li v-for="cat in group.categories" :key="cat.code">
                  {{ cat.name }}: {{ cat.qty }}
                  <ul>
                    <li v-for="p in cat.products" :key="p.code">
                      {{ p.name }} × {{ p.qty }}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({ zip: String })
  const shops = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  watch(() => props.zip, async (newZip) => {       // 當 zip 改變時，重新呼叫 API:contentReference[oaicite:5]{index=5}
    if (!newZip) {
      shops.value = []
      return
    }
    loading.value = true; error.value = null
    try {
      const res = await fetch('https://stamp.family.com.tw/api/maps/MapProductInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OldPKeys: [],
          PostInfo: newZip,            // 使用選到的 zip 作為 PostInfo
            Latitude: 0,
            Longitude: 0,
          ProjectCode: '202106302'
        })                            // POST JSON 格式:contentReference[oaicite:6]{index=6}
      })
      const json = await res.json()    // 解析回傳 JSON:contentReference[oaicite:7]{index=7}
      shops.value = json.data || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  .product-list { overflow-y: auto; max-height: 87%; font-size: 20px;}
  </style>
  