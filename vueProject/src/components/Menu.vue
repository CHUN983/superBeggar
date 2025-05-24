<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  currentSidebar: String
})

const activeIcon = computed(() => props.currentSidebar)
</script>

<template>
  <div class="menu-content">
    <!-- bar（不根據 currentSidebar 判斷是否亮起） -->
    <div class="menu-item" @click="$emit('select', 'bar')">
      <font-awesome-icon size="3x" icon="bars" />
      <br>
    </div>

    <!-- search (乞丐內容) -->
    <div
      class="menu-item"
      :class="{ active: activeIcon === 'search' }"
      @click="$emit('select', 'search')"
    >
      <font-awesome-icon size="3x" icon="utensils" />
      <span style="font-size: 15px;">乞丐內容</span>
    </div>

    <!-- location -->
    <div
      class="menu-item"
      :class="{ active: activeIcon === 'location' }"
      @click="$emit('select', 'location')"
    >
      <font-awesome-icon size="3x" icon="magnifying-glass" />
      <span style="font-size: 15px;">搜尋</span>
    </div>

    <!-- favorite（暫時先同樣用 search） -->
    <div
      class="menu-item"
      :class="{ active: activeIcon === 'favorite' }"
      @click="$emit('select', 'favorite')"
    >
      <font-awesome-icon size="3x" icon="heart" />
      <span style="font-size: 15px;">我的最愛</span>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  padding: 0.5em 0;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: #dcdcdc;
}

.menu-item.active {
  background-color: #c7c4c4; /* 更深的背景色 */
}
</style>
