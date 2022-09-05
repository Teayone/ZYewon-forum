<template>
  <form class="layui-form layui-form-pane" action="">
    <slot></slot>
  </form>
</template>

<script>
import mitt from "@/mitt";

export default {
  props: {
    pane: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      validateFuncArr: [],
      resetFuncArr: [],
    };
  },
  created() {
    mitt.on("form-item-created", this._callback);
  },
  methods: {
    _callback(data) {
      const { validateInput, resetInput } = data;
      this.validateFuncArr.push(validateInput);
      this.resetFuncArr.push(resetInput);
    },
    // 向外暴露验证函数
    validate(fn) {
      let flag = true;
      this.validateFuncArr.forEach((fun) => {
        let result = fun();

        if (!result) {
          flag = false;
        }
      });
      if (fn) {
        return fn(flag);
      }
      return flag;
    },
    reset() {
      this.resetFuncArr.forEach((fun) => {
        fun();
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
