import Alert from "@/components/Alert";
import Pop from "@/components/Pop";
import Loading from "@/components/Loading/Loading.vue";
const components = [
  { name: "Alert", component: Alert },
  { name: "Pop", component: Pop },
  { name: "Loading", component: Loading },
];
export default {
  install(Vue) {
    components.map((com) => {
      Vue.component(com.name, com.component);
      const name = "$" + com.name.toLowerCase();
      Vue.prototype[name] = {
        show: bindShow(com.name),
        hide: bindHide(com.name),
      };
    });
    function bindShow(component) {
      return function (props, cb) {
        const Ctor = Vue.extend({
          render(h) {
            return h(component, { props });
          },
        });
        let isCtor = new Ctor();
        this[component] = isCtor.$mount();
        document.body.appendChild(this[component].$el);
        cb && cb.call(this);
      };
    }
    function bindHide(component) {
      return function (cb) {
        document.body.removeChild(this[component].$el);
        delete this[component];
        cb && cb.call(this);
      };
    }
  },
};
