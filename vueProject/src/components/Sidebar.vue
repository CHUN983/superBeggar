<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar-content">
    <h2>選擇地區</h2>
    <select v-model="city" @change="onCityChange">
      <option value="">請選縣市</option>
      <option v-for="c in areas" :key="c.name" :value="c.name">
        {{ c.name }}
      </option>
    </select>
    <select v-model="district" :disabled="!city" @change="onDistrictChange">
      <option value="">請選區域</option>
      <option v-for="d in districts" :key="d.zip" :value="d.zip">
        {{ d.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['update-selection'])
const areas = ref([])
const city = ref('')
const district = ref('')

onMounted(async () => {
  areas.value = await (await fetch('/data/taiwan_districts.json')).json()
})

const districts = computed(() => {
  const obj = areas.value.find(c => c.name === city.value)
  return obj ? obj.districts : []
})

function onCityChange() {
  district.value = ''
  // 直接告訴父層已清空
  emit('update-selection', { zip: '', latitude: 0, longitude: 0 })
}

function onDistrictChange() {
  const zip = district.value
  // 找出選中的區域物件
  const sel = districts.value.find(d => d.zip === zip)
  const lat = sel?.latitude ?? 0
  const lng = sel?.longitude ?? 0
  // 發出包含 zip、latitude、longitude 的物件
  emit('update-selection', { zip, latitude: lat, longitude: lng })
}
</script>
<style scoped>
.sidebar-content {
  padding: 1em; height: 25%; overflow-y: auto; font-size: 20px;
}
select { display: block; margin: .5em 0; width: 100%; font-size: 20px;}
</style>
