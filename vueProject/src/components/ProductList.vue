  <template>
    <div v-if="stores" class="product-list">
      <ul>
        <li v-for="s in stores.family" :key="s.oldPKey" class="storeBlock">
          {{s.name}}
          <button @click="handleNavigation">
            導航
          </button>
          <button @click="handleNavigation">
            詳細資料
          </button>
          <br>
          <ul>
            <li v-for="k in s.info" :key="k.code" class="categoryBlock">
              {{k.name}} — {{k.qty}}
            </li>
          </ul>
        </li>
      </ul>

      <ul>
        <li v-for="s in stores.seven" :key="s.StoreNo" class="storeBlock">
          7-11{{s.StoreName}}店
          <button @click="handleNavigation">
            導航
          </button>
          <button @click="handleNavigation">
            詳細資料
          </button>
          <br>
          <ul>
            <li v-for="k in s.CategoryStockItems" :key="k.NodeID" class="categoryBlock">
              {{k.Name}} — {{k.RemainingQty}}
            </li>
          </ul>
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
  ul, li {
    margin: 0;
    padding: 0;
  }

  .product-list {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    height: 97vh;
    padding: 10px; 
  }

  .storeBlock {
    list-style: none;
    border: 2px solid #6d6d6d;
    border-radius: 8px;
    margin: 10px 0;
    padding: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .categoryBlock {
    list-style: none;
  }
</style>
