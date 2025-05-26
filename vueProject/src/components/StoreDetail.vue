<!-- StoreDetail.vue -->
<template>
  <div class="store-detail">
    <h2>{{ detail.name }}</h2>
    <p>{{ detail.address }}</p>
    <p>電話：{{ detail.tel }}</p>

    <div v-for="category in detail.info" :key="category.code">
      <h3>{{ category.name }}（{{ category.qty }}）</h3>
      <ul>
        <li v-for="product in category.categories?.flatMap(c => c.products)" :key="product.code">
          {{ product.name }} x {{ product.qty }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ detail: Object })
</script>

<style scoped>
.store-detail {
  padding: 20px;
}
</style>
