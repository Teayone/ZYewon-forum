<template>
  <div>
    <div class="alert">
      <div class="flex">{{ msg }}</div>
      <div v-if="type === 'alert'">
        <div class="btnCommon success" @click="close">确定</div>
      </div>
      <div v-else class="space-round">
        <div class="btnCommon cancel" @click="cancelEvent">取消</div>
        <div class="btnCommon success" @click="confirmEvent">确定</div>
      </div>
    </div>
    <div class="mask" @click="closeMask"></div>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    type: {
      type: String,
      default: "alert",
    },
    msg: {
      type: String,
      default: "",
    },
    success: {
      type: Function,
      default: () => {},
    },
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    close() {
      this.$alert.hide();
    },
    closeMask() {
      if (this.type === "alert") {
        this.close();
      }
    },
    cancelEvent() {
      this.cancel();
      this.close();
    },
    confirmEvent() {
      this.success();
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
@btn-main: #009688;
@btn-dark: #077066;
.alert {
  width: 300px;
  height: 150px;
  position: fixed;
  background-color: #fff;
  border-radius: 6px;
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -75px;
  padding: 20px 10px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
  z-index: 3000;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .space-round {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0 10px;
  }
  .btnCommon {
    width: 105px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 6px;
    transition: all 0.3s;
    cursor: pointer;
    &.success {
      background-color: @btn-main;
      color: #fff;
      &:hover {
        background-color: @btn-dark;
      }
    }
    &.cancel {
      background-color: #ededed;
      color: #333;
    }
  }
}
.flex {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  left: 0;
  top: 0;
  overflow: hidden;
  z-index: 2000;
}
</style>
