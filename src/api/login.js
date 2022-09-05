import request from "@/service";

// 获取验证码
export const getCaptchaAsync = (sid) => {
  return request.get({
    url: "/public/getCaptcha",
    params: {
      sid,
    },
  });
};
// 忘记密码
export const forgetAsync = (data) => {
  return request.post({
    url: "/login/forget",
    data,
  });
};
// 登录
export const loginAsync = (data) => {
  return request.post({
    url: "/login/login",
    data,
  });
};
// 注册
export const regAsync = (data) => {
  return request.post({
    url: "/login/reg",
    data,
  });
};

// 重置密码
export const resetAsync = (data) => {
  return request.post({
    url: "/login/reset-pass",
    data,
  });
};
