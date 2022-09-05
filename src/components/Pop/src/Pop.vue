<template>
  <div class="tips animation" :class="{ shake: type === 'shake' }">
    <div class="content">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    msg: {
      type: String,
      default: "",
    },
    time: {
      type: Number,
      default: 2000,
    },
  },
  watch: {
    time: {
      handler() {
        setTimeout(() => {
          this.$pop.hide();
        }, this.time);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}
.tips {
  position: fixed;
  z-index: 21000;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.animation {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}
.content {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}
.shake {
  animation-name: shake;
}
</style>
