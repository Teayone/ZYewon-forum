<template>
  <div class="layui-container flex">
    <img src="~@/assets/img/icon-404.png" alt="" width="100px" />
    <p>找不到页面了</p>
    <router-link class="layui-btn" :to="{ name: 'home' }">回到首页</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.flex {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    padding: 10px 0 15px 0;
    color: #ddd;
  }
}
</style>
