<template>
  <!-- 签到说明 -->
  <div class="modal" v-show="isShow">
    <div class="mask" @click="close"></div>
    <div class="layui-layer layui-layer-page info active">
      <div class="layui-layer-title">
        <span>签到活跃帮-TOP</span>
        <i class="layui-icon layui-icon-close pull-right" @click="close"></i>
      </div>
      <div class="layui-layer-content pd0 ov">
        <div class="layui-tab layui-tab-brief">
          <ul class="layui-tab-title">
            <li
              v-for="(item, index) in tabList"
              :key="index"
              :class="{ 'layui-this': index === curIndex }"
              @click="tabClick(index, item.sort)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="layui-tab-content">
            <!-- 因为是榜单，所以 ul 是 item -->
            <ul class="layui-tab-item layui-show sign-content">
              <li v-for="(item, index) in lists" :key="'sign' + index">
                <img :src="isAvatar(item)" alt="avatar" />
                <cite class="fly-link">{{
                  item.uid?.nickname || item.nickname
                }}</cite>
                <span class="fly-grey" v-if="curIndex !== 2">
                  签到于 {{ item.created }}
                </span>
                <span class="fly-grey" v-else>
                  以连续签到 <i class="orange">{{ item.count }}</i> 天
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSignList } from "@/api/public";
import moment from "moment";
import formatTime from "@/utils/formatTime";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tabList: [
        {
          name: "最新签到",
          sort: "new",
        },
        {
          name: "今日最快",
          sort: "fast",
        },
        {
          name: "总签到榜",
          sort: "all",
        },
      ],
      curIndex: 0,
      lists: [],
      sort: "new",
    };
  },
  mounted() {
    this.getSignListAsync(this.sort);
  },
  methods: {
    async getSignListAsync(sort) {
      const res = await getSignList(sort);

      const newRes = res.data.map((item) => {
        item.created = formatTime(item.created);
        // if (moment(item.created).isBefore(moment().subtract(7, "days"))) {
        //   item.created = moment(item.created).format("YYYY-MM-DD HH:mm:ss");
        // } else {
        //   item.created = moment(item.created).from(moment());
        // }
        return item;
      });
      this.lists = newRes;
    },
    close() {
      this.$emit("closeModal");
    },
    tabClick(i, sort) {
      this.curIndex = i;
      this.getSignListAsync(sort);
    },
    isAvatar(item) {
      if (item.pic) {
        return item.pic;
      }
      if (item.uid.pic) {
        return item.uid.pic;
      }
      return "/img/bear-200-200.jpg";
    },
  },
};
</script>

<style lang="less" scoped>
.layui-layer.layui-layer-page.info.active {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.layui-tab-content {
  padding: 0 10px;
  overflow-x: hidden;
}
.layui-tab-item {
  line-height: 45px;
  li {
    border-bottom: 1px dotted #dcdcdc;
    &:last-child {
      border-bottom: none;
    }
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 2px;
    margin-right: 10px;
  }
}
.ov {
  overflow-x: hidden !important;
  flex: 1 !important;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #03423c;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
