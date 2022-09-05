<template>
  <div>
    <div class="layui-layer-tips layui-edit-face edit-content">
      <div class="layui-content">
        <ul class="layui-clear">
          <li
            v-for="(value, key) in lists"
            :key="'face' + key"
            @click.stop="handleFaceClick(key, value)"
          >
            <img :src="value" alt="" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import faces from "@/assets/js/face";
export default {
  data() {
    return {
      lists: faces,
    };
  },
  methods: {
    handleFaceClick(key, value) {
      const content = ` face${key}`;
      this.$emit("addEvent", content);
    },
  },
};
</script>

<style lang="less" scoped>
// .face-enter-active {
//   animation: bounceIn 0.3s;
// }
// .face-leave-active {
//   animation: bounceOut 0.3s;
// }
</style>
