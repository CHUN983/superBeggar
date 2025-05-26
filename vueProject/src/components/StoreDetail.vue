<template>
  <div class="store-detail">



    <!-- 全家格式 -->
    <template v-if="detail.type === 'family'">
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
    </template>

    <!-- 7-11 格式 -->
    <template v-else-if="detail.type === 'seven'">
      <h2>711 - {{ detail.StoreName }}店</h2>
      <p>{{ detail.address }}</p>
      <p>電話：{{ detail.tel }}</p>
      <div v-for="category in detail.rawItems.CategoryStockItems" :key="category.NodeID">
        <h3>{{ category.Name }}（{{ category.RemainingQty }}）</h3>
        <ul>
          <li v-for="product in category.ItemList" :key="product.ItemName">
            {{ product.ItemName }} x {{ product.RemainingQty }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 接收 props
const props = defineProps({ detail: Object })

// 用來儲存展開的分類代碼
const expandedCategories = ref([])

// 展開 / 收合 切換函式
function toggleCategory(code) {
  const index = expandedCategories.value.indexOf(code)
  if (index === -1) {
    expandedCategories.value.push(code)
  } else {
    expandedCategories.value.splice(index, 1)
  }
}
</script>

<style scoped>
.store-detail {
  padding: 20px;
}
.category-title {
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-icon {
  margin-left: 8px;
  font-size: 0.8em;
}
</style>
