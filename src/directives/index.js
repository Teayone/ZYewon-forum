import richtext from "./richtext";

export default {
  install(Vue) {
    Object.keys(richtext).forEach((key) => {
      Vue.directive(key, richtext[key]);
    });
  },
};
