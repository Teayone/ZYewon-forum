<template>
  <div class="layui-form-item layui-form-text">
    <label for="L_sign" class="layui-form-label">{{ label }}</label>
    <div class="layui-input-block">
      <textarea
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event.target.value)"
        class="layui-textarea"
        :style="{ height: height }"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "80px",
    },
  },
};
</script>

<style lang="less" scoped></style>
