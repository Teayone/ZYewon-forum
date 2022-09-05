<template>
  <div
    class="layui-layer-page layui-layer-prompt edit-content"
    @click.stop="() => {}"
  >
    <div class="layui-layer-title">请贴入代码或任意文本</div>
    <div class="layui-layer-content">
      <textarea
        class="layui-layer-input"
        v-model="code"
        ref="codeInput"
        v-on:keydown.enter="$event.stopPropagation()"
        :style="{ width: width + 'px', height: height + 'px' }"
      ></textarea>
    </div>
    <span class="layui-layer-setwin" @click="cancel()">
      <a
        class="layui-layer-ico layui-layer-close layui-layer-close1"
        href="javascript:;"
      ></a>
    </span>
    <div class="layui-layer-btn layui-layer-btn-">
      <a class="layui-layer-btn0" @click.prevent="submit()">确定</a>
      <a class="layui-layer-btn1" @click.prevent="cancel()">取消</a>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
export default {
  props: ["width", "height"],
  data() {
    return {
      code: "",
    };
  },
  methods: {
    submit() {
      if (isEmpty(this.code)) {
        this.$pop.show({ msg: "请输入代码", type: "shake" });
        return this.$refs.codeInput.focus();
      }
      const content = ` \n[pre]\n${this.code}\n[/pre]`;
      this.$emit("addEvent", content);
      this.code = "";
    },
    cancel() {
      this.code = "";
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.edit-content {
  background-color: #fff;
  z-index: 22;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1);
}
</style>
