<template>
  <div>
    <div class="fly-home fly-panel" style="background-image: url()">
      <img :src="userInfo.pic ? userInfo.pic : '/img/bear-200-200.jpg'" />
      <!-- <i class="iconfont icon-renzheng" title="Imooc社区认证"></i> -->
      <h1>
        {{ userInfo.name }}
        <template v-if="userInfo.gender">
          <i class="iconfont icon-nan" v-if="userInfo.gender === 0"></i>
          <i class="iconfont icon-nv" v-else></i>
        </template>
        <i class="layui-badge fly-badge-vip">{{
          userInfo.isVip === "0" ? "非VIP" : "VIP" + userInfo.isVip
        }}</i>
        <!--
    <span style="color:#c00;">（管理员）</span>
    <span style="color:#5FB878;">（社区之光）</span>
    <span>（该号已被封）</span>
        -->
      </h1>

      <!-- <p style="padding: 10px 0; color: #5FB878;">认证信息：layui 作者</p> -->

      <p class="fly-home-info">
        <i class="iconfont icon-kiss" title="飞吻"></i>
        <span style="color: #ff7200">{{ userInfo.favs }} 积分</span>
        <i class="iconfont icon-shijian"></i>
        <span>{{ formatTime(userInfo.created) }} 加入</span>
        <i class="iconfont icon-chengshi"></i>
        <span>{{ userInfo.location || "未知" }}</span>
      </p>

      <p class="fly-home-sign">{{ userInfo.regmark }}</p>

      <div class="fly-sns" data-user>
        <a
          href="javascript:;"
          class="layui-btn layui-btn-primary fly-imActive"
          data-type="addFriend"
          >加为好友</a
        >
        <a
          href="javascript:;"
          class="layui-btn layui-btn-normal fly-imActive"
          data-type="chat"
          >发起会话</a
        >
      </div>
    </div>

    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md6 fly-home-jie">
          <div class="fly-panel overflowY">
            <h3 class="fly-panel-title">{{ userInfo.nickname }} 最近的提问</h3>
            <ul class="jie-row">
              <li v-for="(item, index) in postList" :key="'postlist' + index">
                <div
                  class="fly-list-badge"
                  v-show="item.tags.length > 0 && item.tags[0].name !== ''"
                >
                  <span
                    class="layui-badge tag-name"
                    v-for="(tag, index) in item.tags"
                    :key="'tag' + index"
                    :class="tag.class"
                    >{{ tag.name }}</span
                  >
                </div>
                <router-link
                  class="jie-title link"
                  :to="{ name: 'detail', params: { tid: item._id } }"
                  >{{ item.title }}</router-link
                >
                <i>{{ formatTime(item.created) }}</i>
                <em class="layui-hide-xs"
                  >{{ formatCount(item.reads) }}阅/{{
                    formatCount(item.answer)
                  }}答</em
                >
              </li>
              <div
                v-show="postList.length === 0"
                class="fly-none"
                style="min-height: 50px; padding: 30px 0; height: auto"
              >
                <i style="font-size: 14px">没有发表任何求解</i>
              </div>
            </ul>

            <!-- <ul class="jie-row">
              <li v-for="(item, index) in 50" :key="'postlist' + index">
                <div class="fly-list-badge">
                  <span class="layui-badge tag-name">热门</span>
                  <span class="layui-badge tag-name">热门</span>
                </div>
                <a class="jie-title link"
                  >标题啊啊是阿德飒飒大苏打收到asdasdasdasdasdasdasdasdasdasd</a
                >
                <i>2022-08-27</i>
                <em class="layui-hide-xs"
                  >{{ formatCount(154661464) }}阅/{{ formatCount(15666) }}答</em
                >
              </li>
              <div
                class="fly-none"
                style="min-height: 50px; padding: 30px 0; height: auto"
              >
                <i style="font-size: 14px">没有发表任何求解</i>
              </div>
            </ul> -->
          </div>
        </div>

        <div class="layui-col-md6 fly-home-da">
          <div class="fly-panel">
            <h3 class="fly-panel-title">{{ userInfo.nickname }} 最近的回答</h3>
            <ul class="home-jieda">
              <li
                v-for="(item, index) in commentsList"
                :key="'comments' + index"
              >
                <p>
                  <span>{{ formatTime(item.created) }}</span>
                  在
                  <router-link
                    :to="
                      item.tid
                        ? {
                            name: 'detail',
                            params: { tid: item.tid ? item.tid._id : '' },
                          }
                        : { name: '404' }
                    "
                    >{{
                      item.tid ? item.tid.title : "(用户已经删除该贴)"
                    }}</router-link
                  >中回答：
                </p>
                <div
                  class="home-dacontent"
                  v-html="escapeHtml(item.content)"
                ></div>
              </li>
              <div
                v-show="commentsList.length === 0"
                class="fly-none"
                style="min-height: 50px; padding: 30px 0; height: auto"
              >
                <span>没有回答任何问题</span>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formatTime from "@/utils/formatTime";
import escapeHtml from "@/utils/escapeHtml";
import { getBasicInfo, getPostList, getCommentsList } from "@/api/public";
export default {
  data() {
    return {
      formatTime,
      escapeHtml,
      uid: "",
      postList: [], // 文章列表
      userInfo: {}, // 用户信息
      commentsList: [], // 评论列表
      postPage: {
        limit: 10,
        pageNum: 1,
      },
      commentsPage: {
        limit: 10,
        pageNum: 1,
      },
    };
  },
  mounted() {
    this.uid = this.$route.params.id;
    this.init();
  },
  methods: {
    init() {
      this.getUserInfoAsync();
      this.getPostListAsync();
      this.getCommentsListAsync();
    },
    async getUserInfoAsync() {
      const res = await getBasicInfo({
        uid: this.uid,
      });
      // if (res.code !== 200) {
      //   this.$alert.show({ msg: res.msg });
      //   this.$router.replace({ name: "home" });
      // }
      this.userInfo = res.data;
    },
    // 获取用户的提问列表
    async getPostListAsync() {
      const params = {
        uid: this.uid,
        ...this.postPage,
      };

      const result = await getPostList(params);
      this.postList = result.data;
    },
    // 获取我最近发表的评论
    async getCommentsListAsync() {
      const res = await getCommentsList({
        uid: this.uid,
        ...this.commentsPage,
      });
      this.commentsList = res.data;
    },
    // 转换数字
    formatCount(value) {
      const newValue = Number(value);
      if (newValue >= 1000 && newValue < 10000) {
        return (newValue / 1000).toFixed(1) + "千";
      } else if (newValue >= 10000 && newValue < 100000000) {
        return (newValue / 10000).toFixed(1) + "万";
      } else if (newValue >= 100000000 && newValue < 1000000000000) {
        return (newValue / 100000000).toFixed(1) + "亿";
      } else {
        return newValue;
      }
    },
  },
  watch: {
    "$route.params.id"(newVal) {
      this.uid = newVal;
      this.init();
    },
  },
  // computed: {
  //   userInfo() {
  //     return this.$store.state.login.userinfo;
  //   },
  // },
};
</script>

<style lang="less" scoped>
// .overflowY {
//   height: 500px;
//   overflow-y: auto;
//   &::-webkit-scrollbar {
//     width: 4px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 10px;
//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background-color: #009688;
//   }
//   &::-webkit-scrollbar-track {
//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     border-radius: 0px;
//     background: rgba(0, 0, 0, 0.1);
//   }
// }
.fly-list-badge {
  top: 1px;
}
.jie-title.link {
  max-width: 47%;
}
// .tag-name {
//   position: relative;
//   top: -14px;
// }
</style>
