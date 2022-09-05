import request from "@/service";
// 上传头像
export const uploadAvatarAsync = (fm) => {
  return request.post({
    url: "/content/upload_avatar",
    data: fm,
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request.get({
    url: "/user/getUserInfo",
  });
};

// 签到
export const userSign = () => {
  return request.get({
    url: "/user/fav",
  });
};

// 修改用户基本信息
export const updateUser = (data) => {
  return request.post({
    url: "/user/basic",
    data,
  });
};

// 更新用户名
export const updateUserName = (data) => {
  return request.get({
    url: "/public/update-username",
    params: data,
  });
};

// 重置密码
export const updatePass = (data) => {
  return request.post({
    url: "/user/update-pass",
    data,
  });
};

// 获取我发表的帖子
export const getMyPost = (params) => {
  return request.get({
    url: "/user/mypost",
    params,
  });
};

// 收藏帖子
export const setCollect = (params) => {
  return request.get({
    url: "/user/set-collect",
    params,
  });
};

// 获取收藏列表
export const getCollectList = (params) => {
  return request.get({
    url: "/user/collect",
    params,
  });
};

// 删除我的文章
export const deletePostById = (params) => {
  return request.request({
    method: "DELETE",
    url: "/user/delete-post",
    params,
  });
};

// 获取用户最近评论
export const getCommentsList = (params) => {
  return request.get({
    url: "/user/last-comments",
    params,
  });
};

// 获取用户未读消息
export const getMsg = (params) => {
  return request.get({
    url: "/user/getmsg",
    params,
  });
};
// 删除消息（已读）
export const setMsg = (params) => {
  return request.get({
    url: "/user/setmsg",
    params,
  });
};
