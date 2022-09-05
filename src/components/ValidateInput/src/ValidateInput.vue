<template>
  <div>
    <div class="layui-form-item">
      <label class="layui-form-label">{{ label }}</label>
      <div :class="inline ? 'layui-input-inline' : 'layui-input-block'">
        <input
          v-bind="$attrs"
          autocomplete="off"
          class="layui-input"
          :value="value"
          @input="handleInput"
          @blur="validateInput"
          :class="{
            disabled: $attrs.disabled || $attrs === '',
          }"
        />
      </div>
      <div class="error layui-form-mid" v-show="error || errorMessage">
        {{ message || errorMessage }}
      </div>
    </div>
    <div
      class="code"
      v-if="captcha !== ''"
      v-html="captcha"
      @click="captchaClick"
      style="display: inline-block; margin-top: -20px; margin-bottom: 10px"
    ></div>
    <div style="margin-top: -10px">
      <slot name="tips"></slot>
    </div>
  </div>
</template>

<script>
import mitt from "@/mitt";
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    inline: {
      type: Boolean,
      default: true,
    },
    captcha: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      error: false,
      message: "",
    };
  },
  mounted() {
    mitt.emit("form-item-created", {
      validateInput: this.validateInput,
      resetInput: this.resetInput,
    });
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event.target.value);
    },
    validateInput() {
      if (this.rules.length) {
        const result = this.rules.every((rule) => {
          this.message = rule.message;
          if (rule.required) {
            // 如果字符串为空，打开错误提示
            if (!this.value.trim()) {
              return !(this.error = true);
            }
          }

          if (rule.pattern) {
            if (!rule.required && !this.value.trim()) {
              this.error = false;
              this.message = "";
            }
            const result = rule.pattern.test(this.value.trim());
            // 如果校验失败，打开错误提示
            if (!result) {
              this.error = true;
              return false;
            }
          }
          // 如果到了这就代表没有错误，关闭错误提示，返回 true
          this.error = false;
          this.message = "";
          return true;
        });

        // 如果在遍历的过程中有任何一个返回了 false 就代表当前校验失败
        if (!result) return false;
      }
      this.$emit("handleBlur");
      // 没有写规则就直接返回 true
      return true;
    },
    captchaClick() {
      this.$emit("captchaClick");
    },
    resetInput() {
      this.$emit("input", "");
    },
  },
};
</script>

<style lang="less" scoped>
.layui-form-item {
  position: relative;
}
.layui-input-block {
  width: 190px;
}
.error {
  color: red;
}
.disabled {
  background: #f5f7fa;
  color: #adb0b7;
}
// .code {
//   width: 100%;
//   div {
//     display: inline;
//   }
// }
</style>
