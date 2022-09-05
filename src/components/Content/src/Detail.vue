<template>
  <div class="layui-container">
    <Panel />
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8 content detail">
        <div class="fly-panel detail-box">
          <h1>{{ page.title }}</h1>
          <div class="fly-detail-info">
            <!-- <span class="layui-badge">审核中</span> -->
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-if="page.catalog === 'share'"
            >
              分享
            </span>
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'ask'"
              >提问</span
            >
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'advise'"
              >建议</span
            >
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'logs'"
              >动态</span
            >
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'discuss'"
              >交流</span
            >
            <span
              class="layui-badge layui-bg-green fly-detail-column"
              v-else-if="page.catalog === 'notice'"
              >公告</span
            >

            <span
              class="layui-badge"
              style="background-color: #999"
              v-if="+page.isEnd === 0"
              >未结</span
            >
            <span class="layui-badge" style="background-color: #5fb878" v-else
              >已结</span
            >

            <span class="layui-badge layui-bg-black" v-show="+page.isTop === 1"
              >置顶</span
            >
            <template
              v-if="
                page.tags && page.tags.length > 0 && page.tags[0].name !== ''
              "
            >
              <span
                class="layui-badge"
                :class="item.class"
                v-for="(item, index) in page.tags"
                :key="'tag' + index"
                >{{ item.name }}</span
              >
            </template>

            <!-- method1: vuex -> userInfo -> roles -> includes admin -->
            <!-- method2: 组件级权限控制 richtext -->
            <div
              style="display: inline-block"
              v-if="page.uid && page.uid._id === userId"
            >
              <div class="fly-admin-box" data-id="123">
                <span class="layui-btn layui-btn-xs jie-admin" type="del"
                  >删除</span
                >

                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="1"
                  >置顶</span
                >
                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="0"
                  style="background-color: #ccc"
                  v-if="true"
                  >取消置顶</span
                >

                <!-- <span class="layui-btn layui-btn-xs jie-admin" type="set" field="status" rank="1">加精</span>
                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="status"
                  rank="0"
                  style="background-color:#ccc;"
                >取消加精</span>-->
              </div>
            </div>

            <span class="fly-list-nums">
              <a href="#comment">
                <i class="iconfont" title="回答">&#xe60c;</i>
                {{ page.answer }}
              </a>
              <i class="iconfont" title="人气">&#xe60b;</i>
              {{ page.reads }}
            </span>
          </div>
          <!-- 收藏、作者信息 -->
          <div class="detail-about">
            <router-link
              class="fly-avatar"
              :to="{
                name: 'user',
                params: { id: page.uid ? page.uid._id : 'x' },
              }"
            >
              <img
                :src="
                  page.uid && page.uid.pic
                    ? page.uid.pic
                    : '/img/bear-200-200.jpg'
                "
              />
            </router-link>
            <div class="fly-detail-user">
              <router-link
                :to="{
                  name: 'user',
                  params: { id: page.uid ? page.uid._id : 'x' },
                }"
                class="fly-link"
              >
                <cite>{{ page.uid && page.uid.nickname }}</cite>
                <!-- <i class="iconfont icon-renzheng" title="认证信息："></i> -->
                <i
                  class="layui-badge fly-badge-vip mr1"
                  style="margin-left: 5px"
                  v-if="page.uid && +page.uid.isVip !== 0"
                  >VIP{{ page.uid.isVip }}</i
                >
              </router-link>
              <span>{{ formatTime(page.created) }}</span>
            </div>
            <div class="detail-hits">
              <span style="padding-right: 10px; color: #ff7200"
                >悬赏：{{ page.favs }}</span
              >
            </div>
          </div>
          <div class="layui-btn-container fly-detail-admin pt1">
            <span
              class="layui-btn layui-btn-sm jie-admin"
              v-if="page.uid && page.uid._id === userId && +page.isEnd !== 1"
              @click="editPost(page)"
              >编辑</span
            >
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm jie-admin-collect"
              :class="{ 'layui-btn-primary': +page.isCollect === 1 }"
              @click="handleCollect(page)"
              v-if="page.uid && page.uid._id !== userId"
              >{{ +page.isCollect === 1 ? "取消收藏" : "收藏" }}</a
            >
          </div>
          <!-- 这是帖子的文本信息 -->
          <div class="detail-body photos" v-richtext="page.content"></div>
        </div>

        <!-- 回帖相关的内容 -->
        <div class="fly-panel detail-box" id="flyReply" ref="flyReply">
          <fieldset
            class="layui-elem-field layui-field-title"
            style="text-align: center"
          >
            <legend>回帖</legend>
          </fieldset>
          <!-- 采纳的评论 -->
          <div class="jieda-daan isBest" v-if="isBest">
            <div class="detail-about detail-about-reply">
              <a class="fly-avatar">
                <img :src="bestComment.cuid.pic" alt=" " />
              </a>
              <div class="fly-detail-user">
                <router-link
                  class="fly-link"
                  :to="{ name: 'user', params: { id: bestComment.cuid._id } }"
                >
                  <cite>{{ bestComment.cuid.nickname }}</cite>
                  <i
                    class="layui-badge fly-badge-vip comment-user-vip"
                    v-if="+bestComment.cuid.isVip > 0"
                    >VIP{{ bestComment.cuid.isVip }}</i
                  >
                </router-link>

                <span v-if="bestComment.cuid._id === page.uid._id">(楼主)</span>
                <!--
                <span style="color:#5FB878">(管理员)</span>
                <span style="color:#FF9E3F">（社区之光）</span>
                <span style="color:#999">（该号已被封）</span>
                  -->
              </div>

              <div class="detail-hits">
                <span>{{ formatTime(bestComment.created) }}</span>
              </div>

              <i class="iconfont icon-caina caina" title="最佳答案"></i>
            </div>
            <div
              class="detail-body jieda-body photos"
              v-html="escapeHtml(bestComment.content)"
            ></div>
            <div class="jieda-reply">
              <span
                class="jieda-zan"
                type="zan"
                :class="{ zanok: bestComment.handed === 1 }"
                @click="hands(bestComment)"
              >
                <i class="iconfont icon-zan"></i>
                <em>{{ bestComment.hands }}</em>
              </span>
              <!-- <span type="reply">
                <i class="iconfont icon-svgmoban53"></i>
                回复
              </span>
              <div class="jieda-admin">
                <span>编辑</span>
              <span type="del">删除</span> 
                <span class="jieda-accept">采纳 </span>
              </div> -->
            </div>
          </div>
          <!-- 普通评论 -->
          <ul class="jieda" id="jieda">
            <template v-if="comments && comments.length > 0">
              <li
                class="jieda-daan"
                v-for="(item, index) in comments"
                :key="'comments' + index"
              >
                <div class="detail-about detail-about-reply">
                  <a class="fly-avatar">
                    <img
                      :src="
                        item.cuid && item.cuid.pic
                          ? item.cuid.pic
                          : '/img/bear-200-200.jpg'
                      "
                      alt=" "
                    />
                  </a>
                  <div class="fly-detail-user">
                    <router-link
                      class="fly-link"
                      :to="{ name: 'user', params: { id: item._id } }"
                    >
                      <cite>{{
                        item.cuid ? item.cuid.nickname : "ZYewon"
                      }}</cite>
                      <i
                        class="layui-badge fly-badge-vip comment-user-vip"
                        v-if="
                          item.cuid && item.cuid.isVip && +item.cuid.isVip !== 0
                        "
                        >VIP{{ item.uid.isVip }}</i
                      >
                    </router-link>

                    <span v-if="item.cuid && item.cuid._id === page.uid._id"
                      >(楼主)</span
                    >
                    <!--
                <span style="color:#5FB878">(管理员)</span>
                <span style="color:#FF9E3F">（社区之光）</span>
                <span style="color:#999">（该号已被封）</span>
                  --></div>

                  <div class="detail-hits">
                    <span>{{ formatTime(item.created) }}</span>
                  </div>

                  <i
                    class="iconfont icon-caina"
                    title="最佳答案"
                    v-if="+item.isBest !== 0"
                  ></i>
                </div>
                <div
                  class="detail-body jieda-body photos"
                  v-html="escapeHtml(item.content)"
                ></div>
                <div class="jieda-reply">
                  <span
                    class="jieda-zan"
                    type="zan"
                    :class="{ zanok: item.handed === 1 }"
                    @click="hands(item)"
                  >
                    <i class="iconfont icon-zan"></i>
                    <em>{{ item.hands }}</em>
                  </span>
                  <span type="reply" @click="reply(item)">
                    <i class="iconfont icon-svgmoban53"></i>
                    回复
                  </span>
                  <div class="jieda-admin">
                    <span
                      v-if="item.cuid && item.cuid._id === userId && !isBest"
                      @click="editComment(item)"
                      >编辑</span
                    >
                    <!-- <span type="del">删除</span> -->
                    <span
                      class="jieda-accept"
                      v-if="page.uid && page.uid._id === userId && !isBest"
                      @click="setBest(item._id)"
                      >采纳
                    </span>
                  </div>
                </div>
              </li>
            </template>
            <!-- 无数据时 -->
            <li class="fly-none" v-else-if="!isBest && comments.length === 0">
              消灭零回复
            </li>
          </ul>
          <!-- 翻页组件 -->
          <Pagination
            align="center"
            :total="total"
            :pageSize="pageSize"
            @currentPage="currentPage"
            :pageSizeList="pageSizeList"
            @changePageSize="changePageSize"
            ref="pagination"
            v-if="comments.length > 0"
          />
          <!-- 验证码、提交回复 -->
          <div class="layui-form layui-form-pane" ref="editContainer">
            <validate-form ref="formRef">
              <!-- 文本框组件 -->
              <Editor v-model="content" ref="edit" />
              <validate-input
                v-model="code"
                label="验证码"
                placeholder="请输入验证码"
                :rules="rules.code"
                :captcha="svg"
                @captchaClick="getCaptcha"
                :errorMessage="codeErr"
              />
              <div class="layui-form-item">
                <button class="layui-btn" type="button" @click="submitComments">
                  {{ submitText }}
                </button>
                <button
                  class="layui-btn layui-btn-primary"
                  type="button"
                  @click="cancelEdit"
                  v-if="this.submitText === '确认修改'"
                >
                  取消编辑
                </button>
              </div>
            </validate-form>
          </div>
        </div>
      </div>
      <div class="layui-col-md4">
        <HotList />
        <Ads />
        <Links />
      </div>
    </div>
  </div>
</template>

<script>
import HotList from "@/components/Sidebar/src/HotList.vue";
import Links from "@/components/Sidebar/src/Links.vue";
import Ads from "@/components/Sidebar/src/Ads.vue";
import Panel from "@/components/Panel";
import Editor from "@/components/Editor";
import Pagination from "@/components/Pagination/Pagination.vue";
import ValidateForm from "@/components/ValidateForm";
import ValidateInput from "@/components/ValidateInput";
import getCaptcha from "@/mixins/getCaptcha";
import rules from "@/rules";
import { getDetail } from "@/api/content";
import { setReads } from "@/api/public";
import { setCollect } from "@/api/user";
import {
  getComments,
  addComment,
  setBestAsync,
  setHadns,
} from "@/api/comments";
import formatTime from "@/utils/formatTime";
import escapeHtml from "@/utils/escapeHtml";
export default {
  mixins: [getCaptcha],
  components: {
    HotList,
    Links,
    Ads,
    Panel,
    Editor,
    Pagination,
    ValidateForm,
    ValidateInput,
  },
  data() {
    return {
      content: "", // 新增评论的内容
      pageSizeList: [10, 20, 30, 40, 50],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      rules,
      code: "",
      codeErr: "",
      tid: "",
      page: {}, // 页面信息
      comments: [], // 评论信息
      bestComment: null, // 采纳评论
      formatTime,
      escapeHtml,
      timer: null,
      submitText: "提交回复",
      cid: "",
      handsTimer: null,
    };
  },
  mounted() {
    this.tid = this.$route.params.tid;
    this.setReadsAsync();
  },
  methods: {
    // 增加文章阅读数
    async setReadsAsync() {
      const res = await setReads({ tid: this.tid });
      if (res.code === 200) {
        this.getDetailAsync();
        this.getCommentsAsync();
      }
    },
    // 获取文章详情
    async getDetailAsync() {
      const res = await getDetail(this.tid);
      if (res.code !== 200) {
        // 显示页面为空，让用户跳转回首页
        return this.$router.replace("/404");
      }
      this.page = res.data;
    },
    // 获取评论列表
    async getCommentsAsync() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        const res = await getComments({
          tid: this.tid,
          limit: this.pageSize,
          pageNum: this.pageNum,
        });
        this.comments = res.data;
        this.total = res.total;
      }, 100);
    },
    // 更新当前页码
    currentPage(e) {
      if (e !== this.pageNum) {
        this.pageNum = e;
        this.getCommentsAsync();
        this.$refs.flyReply.scrollIntoView({ behavior: "smooth" });
      }
    },
    // 更新页面数据条数
    changePageSize(e) {
      this.pageSize = e;
      this.getCommentsAsync();
    },
    // 清空编辑器内容
    clearEdit() {
      this.content = "";
      this.code = "";
      this.getCaptcha();
    },
    // 提交评论
    async submitComments() {
      if (+this.page.isEnd === 1) {
        this.clearEdit();
        return this.$alert.show({
          msg: "当前文章已结帖，请在未结帖的文章评论",
        });
      }
      if (!this.$store.state.login.isLogin) {
        this.clearEdit();
        return this.$alert.show({ msg: "请登陆后发表评论" });
      }
      if (+this.$store.state.login.userinfo.status !== 0) {
        this.clearEdit();
        return this.$alert.show({
          msg: "用户已被禁言，请联系管理员",
        });
      }
      if (!this.content.trim()) {
        return this.$pop.show({ msg: "请输入评论内容", type: "shake" });
      }
      if (!this.$refs.formRef.validate()) return;
      const params = {
        tid: this.tid,
        code: this.code,
        sid: this.$store.state.global.sid,
        content: this.content,
      };
      let res = null;
      if (this.submitText === "提交回复") {
        params.type = "add";
        res = await addComment(params);
      } else if (this.submitText === "确认修改") {
        params.type = "edit";
        params.cid = this.cid;
        console.log(this.cid);
        res = await addComment(params);
        this.cid = "";
      }

      // TODO:发送请求

      if (res.code !== 200) {
        return this.$alert.show({ msg: res.msg });
      }
      this.$pop.show({
        msg: res.msg,
      });
      this.getCommentsAsync();
      this.clearEdit();
      this.submitText = "提交回复";
    },
    // 编辑评论
    async editComment(item) {
      if (+this.$store.state.login.userinfo.status !== 0) {
        return this.$alert.show({ msg: "用户已被禁言，请联系管理员" });
      }
      // 聚焦
      this.content = item.content;
      this.cid = item._id;
      this.$refs.edit.focus();
      this.submitText = "确认修改";
    },
    // 修改发布评论和编辑评论时按钮的文本和状态
    cancelEdit() {
      this.submitText = "提交回复";
      this.content = "";
    },
    // 设置最佳答案
    setBest(cid) {
      const success = async () => {
        const params = {
          cid,
          tid: this.tid,
        };
        const res = await setBestAsync(params);
        if (res.code !== 200) {
          return this.$pop.show({ msg: res.msg, type: "shake" });
        }
        this.$pop.show({ msg: "采纳成功" });
        this.page.isEnd = 1;
        this.getCommentsAsync();
      };
      this.$alert.show({
        type: "confirm",
        msg: "确定要设置为最佳答案吗？",
        success,
      });
    },
    // 点赞
    async hands(data) {
      this.handsTimer && clearTimeout(this.handsTimer);
      this.$loading.show();
      this.handsTimer = setTimeout(async () => {
        const params = {
          cid: data._id,
          tid: this.tid,
          cuid: data.cuid._id,
        };
        const res = await setHadns(params);
        // 点赞 or 取消点赞失败
        if (res.code !== 200) {
          return this.$pop.show({ msg: res.msg, type: "shake" });
        }
        // 取消点赞
        if (data.handed) {
          data.handed = 0;
          data.hands--;
        } else {
          data.handed = 1;
          data.hands++;
        }
        this.$forceUpdate();
        this.$loading.hide();
      }, 800);
    },
    // 回复评论
    async reply(item) {
      if (!this.$store.state.login.isLogin) {
        return this.$pop.show({ msg: "请登陆后在回复", type: "shake" });
      }
      if (+this.$store.state.login.userinfo.status !== 0) {
        return this.$alert.show({ msg: "用户已被禁言，请联系管理员" });
      }
      // 聚焦
      const replyReg = /^@[\S]+/;
      // 判断输入框是否有值
      if (this.content.trim()) {
        // 有值就会判断输入框是否写了 @xxx 这种格式
        if (replyReg.test(this.content)) {
          // 如果写了在判断 @xxx 是否在输入框的头部
          const group = this.content.match(replyReg);
          // 如果是就直接替换为当前点击回复的用户
          if (group.index === 0) {
            this.content = this.content.replace(
              replyReg,
              `@${item.cuid.nickname} `
            );
          } else {
            // 如果不是就有可能使用户想要发表的言论里包含 @ 符号，不需要替换
            this.content = `@${item.cuid.nickname} ` + this.content;
          }
        } else {
          // 如果输入框有值，并且没有 @xxx 的格式，则直接在文本前插入 @xxx
          this.content = `@${item.cuid.nickname} ` + this.content;
        }
      } else {
        // 如果输入框没值，则直接将输入框设置为 @xxx
        this.content = `@${item.cuid.nickname} `;
      }

      this.cid = item._id;
      this.$refs.edit.focus();
    },
    // 编辑文章
    editPost(page) {
      this.$router.push({
        name: "edit",
        params: {
          tid: page._id,
          post: this.page,
        },
      });
    },
    // 收藏文章
    async handleCollect(page) {
      // 判断是否登录
      const isLogin = this.$store.state.login.isLogin;
      if (!isLogin) {
        return this.$pop.show({ msg: "请先登录", type: "shake" });
      }

      // 如果已登陆，则发送请求
      const isCollect = page.isCollect ? 0 : 1;
      const params = {
        tid: this.tid,
        isCollect,
        title: page.title,
      };
      this.$loading.show();
      await this.delay(500);
      const res = await setCollect(params);
      if (res.code !== 200) {
        return this.$pop.show({ msg: res.msg, type: "shake" });
      }
      page.isCollect = isCollect;
      this.$loading.hide();
      this.$forceUpdate();
    },
    delay(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
  },
  computed: {
    userId() {
      return this.$store.state.login.userinfo._id;
    },
    // 是否有采纳的评论，一旦采纳，则不会显示采纳按钮
    isBest() {
      const bestIndex = this.comments.findIndex((item) => {
        return +item.isBest === 1;
      });
      if (bestIndex > -1) {
        this.bestComment = this.comments[bestIndex];

        this.comments.splice(bestIndex, 1);
        return true;
      }
      return false;
    },
  },
  watch: {
    code() {
      this.codeErr = "";
    },
    "$route.params.tid"(newVal) {
      this.tid = newVal;
      this.setReadsAsync();
    },
  },
};
</script>

<style lang="less" scoped>
.fly-detail-admin {
  text-align: right;
  border-top: 1px dotted #eaeaea;
  background: #f8f8f8;
}

.fly-detail-info {
  span {
    margin-right: 5px;
  }
}

.fly-admin-box {
  margin-left: 0;
  // margin-top: 15px;
}

.jieda-body {
  margin: 25px 0 20px !important;
}
.pt1 {
  padding-top: 10px;
}
.comment-user-vip {
  margin: 0 5px;
}
div.isBest {
  margin-bottom: 10px;
  padding-bottom: 15px;
  border-bottom: 3px solid #f1f2f3;
}
i.iconfont.icon-caina.caina {
  position: absolute;
  right: 0;
  top: 8px;
  font-size: 60px;
  color: green;
}
</style>
