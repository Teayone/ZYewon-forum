import store from "@/store";
export const hasRole = {
  inserted(el, binding) {
    const roles = store.state.login.userinfo.roles || ["user"];
    const values = binding.value.split(",");
    // 只要用户权限有一个满足就ok
    let flag = false;
    for (const role of roles) {
      if (values.includes(role)) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      el.parentNode.removeChild(el);
    }
  },
};
