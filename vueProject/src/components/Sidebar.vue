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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['update:zip'])               // 宣告將發出 update:zip 事件:contentReference[oaicite:2]{index=2}
const areas = ref([])
const city = ref('')
const district = ref('')
const zip = ref('')

onMounted(async () => {
  areas.value = await (await fetch('/data/taiwan_districts.json')).json()  // 讀取縣市區域資料:contentReference[oaicite:3]{index=3}
})

const districts = computed(() => {                          // 計算屬性，依 city 選項動態更新:contentReference[oaicite:4]{index=4}
  const obj = areas.value.find(c => c.name === city.value)
  return obj ? obj.districts : []
})

function onCityChange() {
  district.value = ''
  zip.value = ''
  emit('update:zip', '')                                   // 清空 zip 通知父層
}

function onDistrictChange() {
  zip.value = district.value
  emit('update:zip', zip.value)                            // 選擇後發出 zip 給父層
}
</script>

<style scoped>
.sidebar-content {
  padding: 1em; height: 25%; overflow-y: auto; font-size: 20px;
}
select { display: block; margin: .5em 0; width: 100%; font-size: 20px;}
</style>
