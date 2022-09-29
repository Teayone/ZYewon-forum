<template>
  <div
    class="layui-layer-page layui-layer-border edit-content"
    @click.stop="() => {}"
  >
    <div class="layui-layer-title">插入图片</div>
    <div class="layui-layer-content">
      <ul class="layui-form layui-form-pane">
        <li class="layui-form-item flex item-set">
          <label class="layui-form-label">URL</label>
          <div class="layui-input-inline">
            <input
              type="text"
              id="fileInput"
              placeholder="粘贴图片地址或者点击上传"
              v-model="pic"
              class="layui-input"
              ref="fileInput"
            />
          </div>
          <button
            type="button"
            class="layui-btn layui-btn-primary"
            @click="uploadBtn"
          >
            <i class="layui-icon layui-icon-upload"></i>上传图片
          </button>
          <input
            type="file"
            name="file"
            class="layui-upload-file"
            ref="inputFile"
            @change="upload"
          />
        </li>
        <li class="layui-form-item flex flex-center">
          <button type="button" class="layui-btn" @click="submit()">
            确认
          </button>
        </li>
      </ul>
    </div>
    <span class="layui-layer-setwin" @click.stop="close()">
      <a
        href="javascript:void(0)"
        class="layui-layer-ico layui-layer-close layui-layer-close1"
      ></a>
    </span>
  </div>
</template>

<script>
import { uploadImg } from "@/api/content";
import { baseURL } from "@/config";
import { isEmpty } from "@/utils";
export default {
  data() {
    return {
      pic: "",
    };
  },
  methods: {
    uploadBtn() {
      this.$refs.inputFile.value = "";
      this.$refs.inputFile.click();
    },
    close() {
      this.$refs.inputFile.value = "";
      this.pic = "";
      this.$emit("close");
    },
    submit() {
      // 如果点击确认时却没有图片路径，则让输入框聚焦
      if (isEmpty(this.pic)) {
        this.$pop.show({ msg: "请上传图片或复制图片链接", type: "shake" });
        return this.$refs.fileInput.focus();
      }
      // 创建文本，发送事件给父元素
      const content = ` img[${this.pic}]`;
      this.$emit("addEvent", content);
      this.$nextTick(() => {
        this.pic = "";
      });
    },
    async upload(e) {
      const file = e.target.files[0];
      const fm = new FormData();
      fm.append("file", file);

      // 上传图片
      const res = await uploadImg(fm);
      if (res.code !== 200) {
        this.$alert.show({ msg: "图片上传失败" });
      }
      // 图片上传成功，保存链接
      const imgUrl = res.imgUrl;
      this.pic = imgUrl;
      this.$refs.inputFile.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 450px) {
  .layui-form-item .layui-input-inline {
    margin: 0;
  }
}

.edit-content {
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}
.flex {
  display: flex;
}
.item-set {
  padding: 0 10px;
  margin-top: 10px;
}
.flex-center {
  justify-content: center;
}
</style>
