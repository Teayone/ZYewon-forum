import request from "@/service";

export const deletePost = (id) => {
  return request.delete({
    url: "/admin/content-delete",
    params: {
      id,
    },
  });
};

export const postPrime = (data) => {
  return request.post({
    url: "/admin/content-update",
    data,
  });
};
