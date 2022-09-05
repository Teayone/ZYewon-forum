<template>
  <div class="edit-wrap" ref="edit">
    <div class="layui-form-item layui-form-text">
      <div class="layui-input-block">
        <div class="layui-unselect fly-edit" ref="editIcons">
          <!-- 这里放置 icon -->
          <span @click.stop="chooseClick(0)"
            ><i class="layui-icon layui-icon-face-smile"></i
          ></span>
          <span @click.stop="chooseClick(1)"
            ><i class="layui-icon layui-icon-picture"></i
          ></span>
          <span @click.stop="chooseClick(2)"
            ><i class="layui-icon layui-icon-link"></i
          ></span>
          <span @click.stop="chooseClick(3)" class="quote">”</span>
          <span @click.stop="chooseClick(4)"
            ><i class="layui-icon layui-icon-fonts-code"></i
          ></span>
          <span @click.stop="chooseClick(5)">hr</span>
          <span @click.stop="chooseClick(6)"
            ><i class="iconfont icon-yulan1"></i
          ></span>
        </div>
      </div>
      <textarea
        @focus="handleFocus"
        @blur="handleBlur"
        class="layui-textarea fly-editor"
        name="content"
        id="edit"
        :value="value"
        @input="handleInput"
      ></textarea>
    </div>
    <transition-group
      name="edit"
      tag="div"
      style="position: absolute; top: 45px; left: 0px"
      mode="out-in"
    >
      <face
        v-show="showIndex === 0"
        @addEvent="addEvent"
        ref="face"
        key="face"
      />
      <img-upload
        v-show="showIndex === 1"
        key="imgUpload"
        @close="close"
        @addEvent="addEvent"
      />
      <link-add
        v-show="showIndex === 2"
        key="LinkAdd"
        @close="close"
        @addEvent="addEvent"
      />
      <quote
        v-show="showIndex === 3"
        key="quote"
        @close="close"
        @addEvent="addEvent"
      />
      <Code
        v-show="showIndex === 4"
        key="code"
        @close="close"
        @addEvent="addEvent"
        :width="400"
        :height="200"
      />
      <preview
        v-show="showIndex === 6"
        key="preview"
        @close="close"
        :content="value"
      />
    </transition-group>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
import Face from "./Face.vue";
import ImgUpload from "./ImgUpload.vue";
import LinkAdd from "./LinkAdd.vue";
import Quote from "./Quote.vue";
import Code from "./Code.vue";
import Preview from "./Preview.vue";
export default {
  components: { Face, ImgUpload, LinkAdd, Quote, Code, Preview },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showIndex: "",
      cursorPos: 0, // 焦点位置
      content: "", // 文本框的内容
    };
  },
  mounted() {
    document.body.addEventListener("click", this.handleClose.bind(this), false);
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.handleClose);
  },
  methods: {
    // body 事件
    handleClose(e) {
      if (!e.target.contains(this.$refs.editIcons)) {
        if (!isEmpty(this.showIndex)) {
          this.showIndex = null;
        }
      }
    },
    // 主动关闭
    close() {
      this.showIndex = null;
    },
    // 切换弹出框
    chooseClick(index) {
      if (this.showIndex === index) {
        return (this.showIndex = null);
      }
      if (index === 5) {
        this.showIndex = null;
        return this.handleInput(null, this.insert(` \n[hr]`));
      }
      this.showIndex = index;
    },
    // 添加的内容
    addEvent(value) {
      this.showIndex = null;
      this.handleInput(null, this.insert(value));
    },
    // 插入表情、文本、链接、图片、引用、代码
    // 所用到的思路就是先拆分成数组，后使用 splice 追加，然后转换成字符串，然后在移动光标位置
    insert(val) {
      // if (isEmpty(this.value)) return "";
      const tem = this.value.split("");
      tem.splice(this.cursorPos, 0, val);
      this.cursorPos += val.length;
      return tem.join("");
    },
    // 获取焦点位置
    getPos() {
      const edit = document.getElementById("edit");
      if (edit.selectionStart || edit.selectionStart == "0") {
        // 保存光标位置
        this.cursorPos = edit.selectionStart;
      }
    },
    handleFocus() {
      this.getPos();
    },
    // 一般失去焦点时会获取到真实的焦点位置
    handleBlur() {
      this.getPos();
    },
    handleInput(e, val) {
      if (e) {
        this.$emit("input", e.target.value);
      } else {
        this.$emit("input", val);
      }
    },
    focus() {
      document.getElementById("edit").focus();
    },
  },
};
</script>

<style lang="less">
.edit-enter-active {
  animation: bounceIn 0.3s;
}
.edit-leave-active {
  animation: bounceOut 0.3s;
}
.edit-content {
  position: absolute;
}
.layui-layer {
  top: 0 !important;
}
.edit-wrap {
  position: relative;
}
.fly-editor {
  height: 260px;
}
.layui-input-block {
  margin-left: 0;
}
.quote {
  font-size: 22px;
  vertical-align: middle;
  position: relative;
  top: 4px;
}
</style>
