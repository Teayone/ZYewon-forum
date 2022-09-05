<template>
  <div class="loading-wrap">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style lang="less" scoped>
.loading-wrap {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.loading {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: #1e9fff;
  animation: ball-scale infinite linear 0.75s;
}

@keyframes ball-scale {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
