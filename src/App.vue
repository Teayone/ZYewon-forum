<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default {
  components: { Header, Footer },
};
</script>
<style lang="less">
// @import "./assets/layui/css/layui.css";
@import "./assets/css/global.css";
@import "./assets/css/layui-layer/layer.css";
// @import "./assets/layui/css/modules/layer/default/layer.css";
.gray {
  color: #999;
}
.main {
  margin: 0 0 10px 225px;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.ml10 {
  margin-left: 10px;
}
.pl0 {
  padding-left: 0 !important;
}
.pd0 {
  padding: 0 !important;
}
.pull-right {
  float: right !important;
}
.orange {
  color: #ff5722;
}
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes bounceOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  30% {
    opacity: 0.5;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

html {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #0fb1a1;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
