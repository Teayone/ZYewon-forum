<template>
  <div
    id="preview"
    class="layui-layer-page layui-layer-prompt edit-content"
    @click.stop="() => {}"
  >
    <div class="layui-layer-title">预览</div>
    <div class="layui-layer-content">
      <div class="detail-body" v-html="replaceContent"></div>
    </div>
    <span class="layui-layer-setwin" @click="cancel()">
      <a class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
    </span>
  </div>
</template>

<script>
import escapeHtml from "@/utils/escapeHtml";
import { isEmpty } from "@/utils";
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
  },
  computed: {
    replaceContent() {
      if (isEmpty(this.content)) return;
      const res = escapeHtml(this.content);
      // console.log(res);
      return res;
    },
  },
};
</script>

<style lang="less">
#preview {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 10000;
  overflow-y: auto;
}
.detail-body {
  max-width: 1000px;
  margin: 0 auto;
}

pre {
  position: relative;
  margin: 10px 0;
  padding: 15px;
  line-height: 20px;
  background: #f2f2f2;
  color: #333;
  font-family: "Courier New", Courier, monospace, serif;
  font-size: 12px;
  border: none;
  border-left: 5px solid #ddd;
}
</style>
