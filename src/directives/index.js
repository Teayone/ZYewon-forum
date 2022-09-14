import { hasRole } from "./hasRole";
export default {
  install(Vue) {
    Vue.directive("hasRole", hasRole);
  },
};
