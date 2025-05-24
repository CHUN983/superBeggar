<template>
  <div class="menu-content">
    <div class="menu-item" @click="$emit('toggleList')">
        <font-awesome-icon size="3x" icon="bars" />
        <br>
    </div>
    <div class="menu-item">
      <font-awesome-icon size="3x" icon="magnifying-glass" />
      <span style="font-size: 15px;">搜尋</span>
    </div>

    <div class="menu-item">
      <font-awesome-icon size="3x" icon="heart" />
      <span style="font-size: 15px;">我的最愛</span>
    </div>
  </div>
</template>


<script>

</script>

<style scoped>

.menu-content {
  background-color: rgb(240, 240, 240);
  padding: 1em;
  height: 100vh;
  width: auto; /* 加寬讓 icon 和文字都有空間 */
  overflow-y: auto;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

button {
  width: 5em;
  padding: 0.6em 0em 0.6em 0em;
  cursor: pointer;
}


.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  padding: 0.5em 0;
  border-radius: 8px;           /* 圓角 */
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: #dcdcdc;    /* 比原本的 rgb(240,240,240) 深一點 */
}




</style>