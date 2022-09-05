import ZRequest from "./request";
import { baseURL } from "../config";

export default new ZRequest({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  interceptors: {
    requestInterceptors(req) {
      const unless = [/^\/public/, /^\/login/];
      let isPublic = false; // 判断是否需要添加请求头
      for (let i = 0; i < unless.length; i++) {
        const path = unless[i];
        // 如果匹配到了，代表该次请求是不需要添加请求头的，修改 isPublic 的值
        if (path.test(req.url)) {
          isPublic = true;
          break;
        }
      }
      // 如果上面匹配完了，还是 false 代表该次请求需要添加请求头
      if (!isPublic) {
        req.headers["Authorization"] =
          "Bearer " + localStorage.getItem("token");
      }
      const setHeaderType = [/^\/upload.*/];
      if (setHeaderType[0].test(req.url)) {
        req.headers["Content-Type"] = "multipart/form-data";
      }
      if (req.mock) {
        req.baseURL =
          "https://www.fastmock.site/mock/4613cda021d0f1c0ed01ab636d5bc311/api";
      }
      return req;
    },
  },
});
