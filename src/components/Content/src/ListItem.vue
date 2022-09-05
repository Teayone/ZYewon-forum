<template>
  <div>
    <ul class="fly-list">
      <li v-for="(item, index) in items" :key="'listitem' + index">
        <router-link
          :to="{ name: 'user', params: { id: item.uid._id } }"
          class="fly-avatar"
        >
          <img
            :src="item.uid.pic || defaultAvatar"
            :alt="item.uid.nickname || 'avatar'"
          />
        </router-link>
        <h2>
          <a class="layui-badge">{{ item.catalog }}</a>
          <router-link :to="{ name: 'detail', params: { tid: item._id } }">{{
            item.title
          }}</router-link>
        </h2>
        <div class="fly-list-info">
          <router-link
            :to="{ name: 'user', params: { id: item.uid._id } }"
            link
          >
            <cite>{{ item.uid.nickname }}</cite>
            <!--<i class="iconfont icon-renzheng" title="认证信息：XXX"></i>-->
            <i class="layui-badge fly-badge-vip" v-if="+item.uid.isVip !== 0">{{
              "VIP" + item.uid.isVip
            }}</i>
          </router-link>
          <span>{{ formatTime(item.created) }}</span>

          <span
            class="fly-list-kiss layui-hide-xs"
            title="悬赏飞吻"
            v-show="item.favs !== 0"
          >
            <i class="iconfont icon-kiss"></i>
            {{ item.favs }}
          </span>
          <span
            class="layui-badge fly-badge-accept layui-hide-xs"
            v-show="+item.isEnd === 1"
            >已结</span
          >
          <span class="fly-list-nums">
            <i class="iconfont icon-pinglun1" title="回答"></i>
            {{ item.answer }}
          </span>
        </div>
        <div
          class="fly-list-badge"
          v-show="item.tags.length > 0 && item.tags[0].name !== ''"
        >
          <span
            class="layui-badge"
            v-for="(tag, index) in item.tags"
            :key="'tag' + index"
            :class="tag.class"
            >{{ tag.name }}</span
          >
        </div>
      </li>
    </ul>
    <div style="text-align: center" v-show="isShow">
      <div class="laypage-main" v-if="!isEnd">
        <a @click.prevent="more()" class="laypage-next">更多求解</a>
      </div>
      <div class="nomore gray" v-else>没有更多了</div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import formatTime from "@/utils/formatTime";
export default {
  props: {
    lists: {
      default: () => [],
      type: Array,
    },
    isShow: {
      default: true,
      type: Boolean,
    },
    isEnd: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      defaultAvatar: require("@/assets/img/avatar.jpg"),
      formatTime,
    };
  },
  computed: {
    items() {
      _.map(this.lists, (item) => {
        switch (item.catalog) {
          case "ask":
            item.catalog = "提问";
            break;
          case "share":
            item.catalog = "分享";
            break;
          case "logs":
            item.catalog = "动态";
            break;
          case "notice":
            item.catalog = "公告";
            break;
          case "advise":
            item.catalog = "建议";
            break;
          case "discuss":
            item.catalog = "交流";
            break;
        }
      });
      return this.lists;
    },
  },
  methods: {
    more() {
      this.$emit("nextPage");
    },
  },
};
</script>

<style lang="less" scoped>
.nomore {
  font-size: 16px;
  padding: 30px 0;
  cursor: default;
}
</style>
