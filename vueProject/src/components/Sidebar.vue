<!-- src/components/Sidebar.vue -->
<template>
    <div class="sidebar-content">
      <h2>選擇地區</h2>
      <select v-model="city" @change="onCityChange">
        <option value="">請選縣市</option>
        <option v-for="c in areas" :key="c.name" :value="c.name">{{ c.name }}</option>
      </select>
      <select v-model="district" :disabled="!city" @change="onDistrictChange">
        <option value="">請選區域</option>
        <option v-for="d in districts" :key="d.zip" :value="d.zip">{{ d.name }}</option>
      </select>
      <p v-if="zip">📮 郵遞區號：{{ zip }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  const areas = ref([]), city = ref(''), district = ref(''), zip = ref('')
  onMounted(async () => {
    areas.value = await (await fetch('/data/taiwan_districts.json')).json()
  })
  const districts = computed(() => {
    const obj = areas.value.find(c => c.name === city.value)
    return obj ? obj.districts : []
  })
  function onCityChange()   { district.value = ''; zip.value = '' }
  function onDistrictChange(){ zip.value = district.value }
  </script>
  
  <style scoped>
  .sidebar-content {
    padding: 1em; background: #f8f8f8; height: 100%; overflow-y: auto;
  }
  h2 { margin-top: 0; }
  select { display: block; margin: 0.5em 0; width: 100%; }
  </style>
  