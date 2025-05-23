<template>
  <div class="menu-content">
    <img src="@/assets/setting.svg" style="width: 36px; height: 36px;"/>
    設定
    <br>
    <img src="@/assets/heart.svg" style="width: 36px; height: 36px;"/>
    我的最愛
    <br>
  </div>
</template>

<script>

</script>

<style scoped>

.menu-content {
  padding: 1em;
  height: 100vh;
  width: 50px;
  overflow-y: fixed;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;                   /* 每個選項間隔 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

</style>