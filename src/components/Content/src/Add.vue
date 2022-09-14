<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel" pad20 style="padding-top: 5px">
      <!--<div class="fly-none">没有权限</div>-->
      <div class="layui-form layui-form-pane">
        <div class="layui-tab layui-tab-brief" lay-filter="user">
          <ul class="layui-tab-title">
            <li class="layui-this">
              发表新帖
              <!-- 编辑帖子 -->
            </li>
          </ul>
          <div
            class="layui-form layui-tab-content"
            id="LAY_ucm"
            style="padding: 20px 0"
          >
            <div class="layui-tab-item layui-show">
              <validate-form ref="formRef">
                <div class="layui-row layui-col-space15 layui-form-item">
                  <div class="layui-col-md3">
                    <div class="layui-row">
                      <label class="layui-form-label">所在专栏</label>
                      <div class="layui-input-block" @click="catalogClick">
                        <div
                          class="layui-unselect layui-form-select"
                          :class="{ 'layui-form-selected': showCatalogs }"
                        >
                          <div class="layui-select-title">
                            <input
                              type="text"
                              placeholder="请选择"
                              readonly
                              v-model="catalogs[catalogIndex].text"
                              class="layui-input layui-unselect"
                            />
                            <i class="layui-edge"></i>
                          </div>
                          <dl class="layui-anim layui-anim-upbit">
                            <dd
                              v-for="(item, index) in catalogs"
                              :class="{ 'layui-this': index === catalogIndex }"
                              :key="item.value"
                              @click="chooseCatalog(item, index)"
                            >
                              {{ item.text }}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-md9">
                    <div class="layui-row">
                      <label for="L_title" class="layui-form-label">标题</label>
                      <div class="layui-input-block">
                        <input
                          type="text"
                          class="layui-input"
                          v-model="title"
                        />
                        <!-- <input type="hidden" name="id" value="{{d.edit.id}}"> -->
                      </div>
                    </div>
                  </div>
                </div>
                <editor ref="editor" v-model="content"></editor>
                <div class="layui-form-item">
                  <div class="layui-inline">
                    <label class="layui-form-label">悬赏飞吻</label>
                    <div
                      class="layui-input-inline"
                      style="width: 190px"
                      @click="favsClick"
                    >
                      <div
                        class="layui-unselect layui-form-select"
                        :class="{ 'layui-form-selected': showFavs }"
                      >
                        <div class="layui-select-title">
                          <input
                            type="text"
                            placeholder="请选择"
                            v-model="favList[favIndex]"
                            readonly
                            class="layui-input layui-unselect"
                          />
                          <i class="layui-edge"></i>
                        </div>
                        <dl class="layui-anim layui-anim-upbit">
                          <dd
                            v-for="(item, index) in favList"
                            :key="item"
                            :class="{ 'layui-this': favIndex === index }"
                            @click="favClick(item, index)"
                          >
                            {{ item }}
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                      发表后无法更改飞吻
                    </div>
                  </div>
                </div>
                <validate-input
                  label="验证码"
                  v-model="code"
                  :captcha="svg"
                  placeholder="请输入验证码"
                  @captchaClick="getCaptcha"
                  :rules="rules.code"
                />
                <div class="layui-form-item">
                  <button type="button" class="layui-btn" @click="publish">
                    立即发布
                  </button>
                </div>
              </validate-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ValidateForm from "@/components/ValidateForm";
import ValidateInput from "@/components/ValidateInput";
import Editor from "@/components/Editor";
import getCaptcha from "@/mixins/getCaptcha";
import rules from "@/rules";
import { addPost } from "@/api/content";
import { isEmpty } from "@/utils";
export default {
  components: { ValidateForm, ValidateInput, Editor },
  mixins: [getCaptcha],
  data() {
    return {
      rules,
      showCatalogs: false,
      showFavs: false,
      catalogIndex: 0,
      favIndex: 0,
      code: "",
      codeErr: "",
      content: "",
      title: "",
      catalogs: [
        {
          text: "请选择",
          value: "",
        },
        {
          text: "提问",
          value: "ask",
        },
        {
          text: "分享",
          value: "share",
        },
        {
          text: "讨论",
          value: "discuss",
        },
        {
          text: "建议",
          value: "advice",
        },
      ],
      favList: [20, 30, 50, 60, 80],
    };
  },
  mounted() {
    // 读取本地是否有为编辑完的内容
    const saveData = localStorage.getItem("addData") || "";
    if (!isEmpty(saveData)) {
      this.$alert.show({
        type: "confirm",
        msg: "当前有尚未编辑完的内容，是否读取并编辑？",
        success: () => {
          const data = JSON.parse(saveData);
          this.title = data.title;
          this.content = data.content;
          this.favIndex = data.favIndex;
          this.catalogIndex = data.catalogIndex;
        },
        cancel: () => {
          localStorage.setItem("addData", "");
        },
      });
    }
  },
  methods: {
    catalogClick() {
      this.showCatalogs = !this.showCatalogs;
    },
    favsClick() {
      this.showFavs = !this.showFavs;
    },
    chooseCatalog(item, index) {
      this.catalogIndex = index;
    },
    favClick(item, index) {
      this.favIndex = index;
    },
    // 发布
    async publish() {
      // 判断是否输入帖子内容
      if (!this.content.trim())
        return this.$alert.show({ msg: "文章内容不能为空" });
      // 判断是否选择专栏
      if (this.catalogIndex === 0)
        return this.$pop.show({ msg: "请选择专栏", type: "shake" });
      // 判断是否输入标题
      if (!this.title.trim())
        return this.$pop.show({ msg: "请输入标题", type: "shake" });
      // 判断是否输入验证码
      if (!this.$refs.formRef.validate()) return;
      // 发送请求,添加新的文章
      const res = await addPost({
        title: this.title,
        catalog: this.catalogs[this.catalogIndex].value,
        content: this.content,
        fav: this.favList[this.favIndex],
        code: this.code,
        sid: this.$store.state.global.sid,
      });
      if (res.code >= 400 && res.code < 500) {
        return (this.codeErr = res.msg);
      }
      if (res.code !== 200) {
        return this.$alert.show({ msg: res.msg });
      }
      this.$alert.show({ msg: "发表成功，2s后进行跳转" });
      console.log(res.data);
      // 跳转至帖子详情
      setTimeout(() => {
        this.$router.push({
          name: "detail",
          params: {
            tid: res.data._id,
          },
        });
      }, 2000);
      localStorage.setItem("addData", "");
    },
    // 缓存到本地
    add() {
      if (this.content.trim() && this.title.trim()) {
        const data = {
          title: this.title,
          content: this.content,
          favIndex: this.favIndex,
          catalogIndex: this.catalogIndex,
        };
        localStorage.setItem("addData", JSON.stringify(data));
      }
    },
  },
  // 监听数据变化，将数据存储到本地，刷新网页或重新也如发帖页面时读取数据
  watch: {
    content() {
      this.add();
    },
    title() {
      this.add();
    },
    favIndex() {
      this.add();
    },
    catalogIndex() {
      this.add();
    },
    code() {
      this.codeErr = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
