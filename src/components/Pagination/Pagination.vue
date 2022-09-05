<template>
  <div
    ref="pagination"
    class="flex"
    :class="{
      center: align === 'center',
      left: align === 'left',
      right: align === 'right',
    }"
    v-if="pageTotal !== 0"
  >
    <!-- 每页显示的条数列表 -->
    <div v-if="pageSizeList.length > 0" class="page-list">
      <div
        class="layui-unselect layui-form-select"
        @click="changeFav"
        :class="{ 'layui-form-selected': isSelect }"
      >
        <div class="layui-select-title">
          <input
            type="text"
            placeholder="请选择"
            readonly
            v-model="pageSizeList[optIndex]"
            class="layui-input layui-unselect"
          />
          <i class="layui-edge"></i>
        </div>
        <dl class="layui-anim layui-anim-upbit">
          <dd
            v-for="(item, index) in pageSizeList"
            :key="'catalog' + index"
            @click="chooseFav(item, index)"
            :class="{ 'layui-this': index === optIndex }"
          >
            {{ item }}
          </dd>
        </dl>
      </div>
    </div>
    <div
      class="layui-box layui-laypage layui-laypage-default"
      id="layui-laypage-1"
    >
      <a
        href="javascript:void(0)"
        class="layui-laypage-prev"
        :class="{ 'layui-disabled': current === 0 }"
        @click="prev"
      >
        <i class="layui-icon layui-icon-left" v-if="showType === 'icon'"></i>
        <template v-else>上一页</template>
      </a>
      <template v-if="current + 1 - 2 > 1">
        <span style="border: none"> ... </span>
      </template>
      <template v-for="(item, index) in pageTotal">
        <a
          v-if="item >= current + 1 - 2 && item <= current + 1 + 2"
          href="javascript:;"
          :class="{ active: current == index }"
          :key="index"
          @click="onClick(index)"
          >{{ item }}</a
        >
      </template>
      <template v-if="current + 1 + 2 < pageTotal">
        <span style="border: none"> ... </span>
      </template>
      <!-- <template>
        <a href="javascript:void(0)"> {{ Pagetotal }} </a>
      </template> -->
      <a
        href="javascript:void(0)"
        class="layui-laypage-next"
        :class="{ 'layui-disabled': current + 1 === pageTotal }"
        @click="next"
      >
        <i class="layui-icon layui-icon-right" v-if="showType === 'icon'"></i>
        <template v-else>上一页</template></a
      >
    </div>
    <div class="center ml15" v-if="showEnd">
      到
      <input class="input-div" v-model="input" @keyup="onKeyup" />
      页 共 {{ pageTotal }} 页
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 是否显示尾页
    showEnd: {
      type: Boolean,
      default: true,
    },
    // 是否显示 icon 而不是文字（翻页）
    showType: {
      type: String,
      default: "icon",
    },
    // 是否居中
    align: {
      type: String,
      default: "center",
    },
    // 数据条数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 条数列表
    pageSizeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      current: 0,
      input: "",
      size: 5,
      optIndex: "",
      isSelect: false,
    };
  },

  methods: {
    onClick(index) {
      if (this.current === index) return;
      this.current = index;
      this.$emit("currentPage", this.current + 1);
    },
    onKeyup(event) {
      if (event.key === "Enter") {
        if (+this.input - 1 >= this.pageTotal) {
          this.input = this.pageTotal;
        }
        if (isNaN(Number(this.input))) {
          this.input = 1;
        }
        this.current = +this.input - 1;
        this.$emit("currentPage", this.current + 1);
      }
    },
    prev() {
      if (this.current === 0) return;
      this.current--;
      this.$emit("currentPage", this.current + 1);
    },
    next() {
      if (this.current + 1 === this.Pagetotal) return;
      this.current++;
      this.$emit("currentPage", this.current + 1);
    },
    chooseFav(item) {
      if (item === this.pageSize) return;
      if (item > this.pageSize) {
        if (this.pageTotal < this.pageSize) {
          this.onClick(0);
        } else {
          const currentData = this.pageSize * (this.current + 1);
          this.onClick(Math.floor(currentData / item) - 1);
        }
      }
      this.$emit("changePageSize", item);
    },
    changeFav() {
      this.isSelect = !this.isSelect;
    },
  },
  computed: {
    pageTotal() {
      if (this.pageSizeList.length > 0) {
        this.optIndex = this.pageSizeList.indexOf(this.pageSize);
      }
      // 设置当前页数的下标位置
      return Math.ceil(this.total / this.pageSize);
    },
  },
  // watch: {
  //   pageSize(newVal, oldValue) {
  //     if (newVal > oldValue) {
  //       if (this.total < this.pageSize) {
  //         return this.onClick(0);
  //       }
  //       const currentData = oldValue * (this.current + 1);
  //       this.current = Math.ceil(currentData / newVal) - 1;
  //     }
  //   },
  // },
};
</script>

<style lang="less">
.flex {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  text-align: center;
  user-select: none;

  &.center {
    justify-content: center;
  }
  &.left {
    justify-content: flex-start;
  }
  &.right {
    justify-content: flex-end;
  }
  &.ml15 {
    margin-left: 15px;
  }
  a {
    &.active {
      background-color: skyblue;
      color: #fff;
      border-radius: 2px;
    }
  }
  .input-div {
    width: 40px;
    height: 26px;
    padding-top: 2px;
    padding-left: 3px;
    box-sizing: border-box;
    background-color: #fff;
    color: #333;
    font-size: 12px;
    border-radius: 3px;
    margin: 0 5px 3px 5px;
    border: 1px solid #ccc;
    overflow: hidden;
    vertical-align: middle;
    &:focus {
      outline: none;
      border: 1px solid skyblue;
    }
  }
}
.center.ml15 {
  font-size: 12px;
  margin-left: 15px;
}
.page-list {
  width: 80px;
  margin-right: 10px;
  max-height: 30px;
  margin-top: -5px;
  .layui-input.layui-unselect {
    height: 30px;
  }
}
</style>
