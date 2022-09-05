import request from "@/service";
import store from "@/store";
import qs from "qs";
// 获取文章列表
export const getListAsync = (options) => {
  return request.get({
    url: `/public/list?${qs.stringify(options)}`,
  });
};
// 温馨提醒
export const getTipsAsync = () => {
  return request.get({
    url: "/public/tips",
  });
};
// 友情链接
export const getLinksAsync = () => {
  return request.get({
    url: "/public/links",
  });
};
// 本周热议
export const getTopAsync = () => {
  return request.get({
    url: "/public/topWeek",
  });
};

// 上传图片
export const uploadImg = (data) => {
  return request.post({
    url: "/content/upload",
    data,
  });
};

// 发表帖子
export const addPost = (data) => {
  return request.post({
    url: "/content/add",
    data,
  });
};

// 获取文章详情
export const getDetail = (tid) => {
  const token = store.state.login.token;
  return request.get({
    url: "/public/content/detail",
    params: {
      tid,
    },
    headers: token
      ? {
          Authorization: "Bearer " + token,
        }
      : {},
  });
};

// 编辑文章
export const editPost = (data) => {
  return request.post({
    url: "/content/edit",
    data,
  });
};
