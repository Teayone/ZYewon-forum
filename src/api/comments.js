import request from "@/service";
import store from "@/store";
// 获取文章评论
export const getComments = (params) => {
  const token = store.state.login.token;
  return request.get({
    url: "/public/comments",
    params,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
// 发表评论 or 更新评论
export const addComment = (data) => {
  return request.post({
    url: "/comments/reply",
    data,
  });
};
// 采纳评论
export const setBestAsync = (params) => {
  return request.get({
    url: "/comments/accept",
    params,
  });
};

export const setHadns = (params) => {
  return request.get({
    url: "/comments/hands",
    params,
  });
};
