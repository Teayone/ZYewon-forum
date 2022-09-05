import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Alert from "./plugins/Alert";
import directives from "@/directives";
Vue.config.productionTip = false;
Vue.use(Alert);
Vue.use(directives);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
