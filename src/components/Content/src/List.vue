<template>
  <div class="fly-panel" style="margin-bottom: 0">
    <div class="fly-panel-title fly-filter">
      <a
        href="javascript:;"
        :class="{ 'layui-this': isEnd === '' && tag === '' }"
        @click.prevent="search(-1)"
        >综合
      </a>
      <span class="fly-mid"></span>
      <a
        href="javascript:;"
        :class="{ 'layui-this': isEnd === 0 }"
        @click.prevent="search(0)"
      >
        未结
      </a>
      <span class="fly-mid"></span>
      <a
        href="javascript:;"
        :class="{ 'layui-this': isEnd === 1 }"
        @click.prevent="search(1)"
      >
        已结
      </a>
      <span class="fly-mid"></span>
      <a
        href="javascript:;"
        :class="{ 'layui-this': tag === '精华' }"
        @click.prevent="search(2)"
      >
        精华
      </a>
      <span class="fly-filter-right layui-hide-xs">
        <a
          href="javascript:;"
          :class="{ 'layui-this': sort === 'created' }"
          @click.prevent="search(3)"
        >
          按最新
        </a>
        <span class="fly-mid"></span>
        <a
          href="javascript:;"
          :class="{ 'layui-this': sort === 'answer' }"
          @click.prevent="search(4)"
        >
          按热议
        </a>
      </span>
    </div>
    <list-item @nextPage="nextPage" :lists="lists" :isEnd="end"></list-item>
  </div>
</template>

<script>
import ListItem from "./ListItem.vue";
import { getListAsync } from "@/api/content";
export default {
  components: { ListItem },
  data() {
    return {
      isRequest: false, // 请求锁
      isEnd: "", // 是否结帖
      tag: "",
      sort: "created", // 按时间排序
      page: 1,
      limit: 20,
      catalog: "",
      lists: [],
      end: false, // 是否还有帖子（是否已经没有数据）
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      if (this.end) return;
      if (this.isRequest) return;
      this.isRequest = true;
      const options = {
        catalog: this.catalog,
        isTop: 0,
        page: this.page,
        limit: this.limit,
        sort: this.sort,
        tag: this.tag,
        isEnd: this.isEnd,
      };
      try {
        const res = await getListAsync(options);
        this.isRequest = false;
        if (res.code !== 200)
          return this.$alert.show({ msg: "数据请求失败，请稍后再试" });

        if (res.data.length < this.limit) {
          this.end = true;
        }
        if (this.lists.length === 0) {
          this.lists = res.data;
        } else {
          this.lists = this.lists.concat(res.data);
        }
      } catch (error) {
        this.isRequest = false;
        this.$alert.show({ msg: error.message });
        console.log(error);
      }
    },
    nextPage() {
      this.page++;
      this.getList();
    },
    search(val) {
      if (typeof val === "undefined" && this.current === "") {
        return;
      }

      switch (val) {
        case -1:
          this.isEnd = "";
          this.tag = "";
          break;
        // 未结贴
        case 0:
          this.tag = "";
          this.isEnd = 0;
          break;
        // 已结贴
        case 1:
          this.tag = "";
          this.isEnd = 1;
          break;
        // 查询"精华"标签
        case 2:
          this.isEnd = "";
          this.tag = "精华";
          break;
        // 按照时间去查询
        case 3:
          this.sort = "created";
          break;
        // 按照评论数去查询
        case 4:
          this.sort = "answer";
          break;
        // 综合查询
        default:
          this.isEnd = "";
          this.tag = "";
          this.current = "";
      }
      this.end = false;
      this.lists = [];
      this.getList();
    },
  },
  watch: {
    "$route.params": {
      handler(newVal) {
        if (newVal.catalog) {
          this.catalog = newVal.catalog;
          this.resetRequest();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
a {
  cursor: pointer;
}
</style>
