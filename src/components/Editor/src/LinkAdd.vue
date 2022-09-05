<template>
  <div
    class="layui-layer-page layui-layer-prompt edit-content"
    @click.stop="() => {}"
  >
    <div class="layui-layer-title">请输入合法链接</div>
    <div class="layui-layer-content">
      <input
        type="text"
        class="layui-layer-input"
        id="linkInput"
        v-model="link"
        ref="linkInput"
      />
    </div>
    <span class="layui-layer-setwin" @click="cancel()">
      <a
        href="javascript:void(0)"
        class="layui-layer-ico layui-layer-close layui-layer-close1"
      ></a>
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
      link: "",
    };
  },
  methods: {
    submit() {
      if (isEmpty(this.link)) {
        this.$pop.show({ msg: "请输入合法的链接", type: "shake" });
        return this.$refs.linkInput.focus();
      }
      const reg =
        /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      if (!reg.test(this.link)) {
        return this.$pop.show({ msg: "请输入合法的链接", type: "shake" });
      }
      const content = ` a(${this.link})[${this.link}]`;
      this.$emit("addEvent", content);
      this.link = "";
    },
    cancel() {
      this.link = "";
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.layui-layer-page.layui-layer-prompt.edit-content {
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}
</style>
