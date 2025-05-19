<template>
  <div v-if="stores" class="product-list">
    <h3>搜尋結果</h3>

    <h4>全家即期品</h4>
    <ul>
      <li v-for="s in stores.family" :key="s.oldPKey">
        {{ s.name }} — {{ s.address }}
      </li>
    </ul>

    <h4>7-11 即期品</h4>
    <ul>
      <li v-for="s in stores.seven" :key="s.StoreNo">
        {{ s.StoreName }} — {{ s.StoreAddress }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  stores: Object // ✅ 傳入共用資料
})
</script>

<style scoped>
.product-list { overflow-y: auto; max-height: 80vh; }
</style>
