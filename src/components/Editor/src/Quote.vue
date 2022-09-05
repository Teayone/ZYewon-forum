<template>
  <div
    class="layui-layer-page layui-layer-prompt edit-content"
    @click.stop="() => {}"
  >
    <div class="layui-layer-title">请输入引用内容</div>
    <div class="layui-layer-content">
      <textarea
        class="layui-layer-input"
        ref="quoteInput"
        v-model="quote"
        style="width: 300px; height: 100px"
      ></textarea>
    </div>
    <span class="layui-layer-setwin" @click="cancel()">
      <a class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
    </span>
    <div class="layui-layer-btn">
      <a class="layui-layer-btn0" @click.prevent="submit()">确定</a>
      <a class="layui-layer-btn" @click.prevent="cancel()">取消</a>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
export default {
  data() {
    return {
      quote: "",
    };
  },
  methods: {
    submit() {
      if (isEmpty(this.quote)) {
        this.$pop.show({ msg: "请输入内容", type: "shake" });
        return this.$refs.quoteInput.focus();
      }
      const content = ` \n[quote]\n${this.quote}\n[/quote]`;
      this.$emit("addEvent", content);

      this.quote = "";
    },
    cancel() {
      this.quote = "";
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.edit-content {
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}
</style>
