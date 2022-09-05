<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel" pad20 style="padding-top: 5px">
      <!--<div class="fly-none">没有权限</div>-->
      <div class="layui-form layui-form-pane">
        <div class="layui-tab layui-tab-brief" lay-filter="user">
          <ul class="layui-tab-title">
            <li class="layui-this">编辑帖子</li>
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
                      <div class="layui-input-block">
                        <div class="layui-unselect layui-form-select">
                          <div class="layui-select-title">
                            <input
                              type="text"
                              placeholder="请选择"
                              readonly
                              v-model="transformCatalog"
                              class="layui-input layui-unselect layui-disabled"
                            />
                            <i class="layui-edge"></i>
                          </div>
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
                    <div class="layui-input-inline" style="width: 190px">
                      <div class="layui-unselect layui-form-select">
                        <div class="layui-select-title">
                          <input
                            type="text"
                            placeholder="请选择"
                            v-model="favs"
                            readonly
                            class="layui-input layui-unselect layui-disabled"
                          />
                          <i class="layui-edge"></i>
                        </div>
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
                  :errorMessage="codeErr"
                />
                <div class="layui-form-item">
                  <button type="button" class="layui-btn" @click="publish">
                    编辑完成
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
import { isEmpty } from "@/utils";
import { editPost } from "@/api/content";
export default {
  components: { ValidateForm, ValidateInput, Editor },
  mixins: [getCaptcha],
  data() {
    return {
      rules,
      code: "",
      codeErr: "",
      tid: "",
      favs: 0,
      title: "",
      content: "",
      catalog: "ask",
      page: {},
    };
  },
  mounted() {
    // 文章内容
    this.page = this.$route.params.post;
    // 文章 ID
    this.tid = this.$route.params.tid;
    // 代表用户是第一次进入编辑页
    if (!isEmpty(this.page)) {
      this.content = this.page.content;
      this.title = this.page.title;
      this.favs = this.page.favs;
      this.catalog = this.page.catalog;
      localStorage.setItem("editData", JSON.stringify(this.page));
    } else {
      let saveData = localStorage.getItem("editData") || "";
      if (!isEmpty(saveData)) {
        this.page = JSON.parse(saveData);
        this.favs = this.page.favs;
        this.catalog = this.page.catalog;
        // 如果本地的缓存 content 和 title 其中一个有值，就提醒用户有未编辑完的文本
        if (this.page.content.trim() && this.page.title.trim()) {
          this.$alert.show({
            type: "confirm",
            msg: "当前有尚未编辑完的内容，是否读取并编辑？",
            success: () => {
              this.content = this.page.content;
              this.title = this.page.title;
              localStorage.setItem("editData", JSON.stringify(this.page));
            },
            cancel: () => {
              this.content = "";
              this.title = "";
              localStorage.setItem(
                "editData",
                JSON.stringify({
                  ...this.page,
                  content: "",
                  title: "",
                })
              );
            },
          });
        }
        // 如果都没值，就什么都不用做，因为 data 中已经设置了 content 和 title 的默认值
      }
    }
  },
  methods: {
    async publish() {
      if (!this.title.trim() || !this.content.trim()) {
        this.getCaptcha();
        return this.$pop.show({ msg: "标题或内容不能为空", type: "shake" });
      }
      const data = {
        content: this.content,
        title: this.title,
        sid: this.$store.state.global.sid,
        code: this.code,
        tid: this.tid,
      };
      const res = await editPost(data);
      if (res.code >= 400 && res.code < 500) {
        this.getCaptcha();
        return (this.codeErr = res.msg);
      }
      if (res.code !== 200) {
        this.getCaptcha();
        return this.$pop.show({ msg: res.msg, type: "shake" });
      }
      this.$pop.show({ msg: res.msg });
      this.getCaptcha();
      this.code = "";
      setTimeout(() => {
        this.$router.replace({
          name: "detail",
          params: {
            tid: this.page._id,
          },
        });
        localStorage.setItem("editData", "");
      }, 1000);
    },
    // 添加缓存
    add() {
      localStorage.setItem(
        "editData",
        JSON.stringify({
          ...this.page,
          content: this.content,
          title: this.title,
        })
      );
    },
  },
  computed: {
    transformCatalog() {
      const data = {
        ask: "提问",
        share: "分享",
        discuss: "讨论",
        advise: "建议",
      }[this.catalog];
      return data;
    },
  },
  beforeDestroy() {
    localStorage.setItem("editData", "");
  },
  watch: {
    content() {
      this.add();
    },
    title() {
      this.add();
    },
    code() {
      this.codeErr = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
