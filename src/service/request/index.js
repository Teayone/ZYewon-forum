import axios from "axios";
const CancelToken = axios.CancelToken;
class ZRequest {
  constructor(config) {
    this.instance = axios.create(config);
    this.loading = config.loading || false;
    this.pending = {};
    this.instance.interceptors.request.use(
      (req) => {
        let key = req.url + "&" + req.method;
        // 每次发起请求。都要先查看是否满足取消请求的条件
        this.removePending(key, true);
        req.cancelToken = new CancelToken((c) => {
          this.pending[key] = c;
        });
        return req;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        // 请求结束将 pending 中的 key 删除
        let key = res.config.url + "&" + res.config.method;
        this.removePending(key);
        this.loading = false;
        return res.data;
      },
      (err) => {
        console.log(err);
        // if (err.response.data.code === 401) {
        //   return Promise.resolve({
        //     code: 401,
        //     msg: "用户未登录，或登录时效已过",
        //   });
        // }
        this.loading = false;
        return Promise.reject(err);
      }
    );
    // 设置实例化时的拦截器
    if (config.interceptors?.requestInterceptors) {
      this.instance.interceptors.request.use(
        config.interceptors.requestInterceptors
      );
    }
    if (config.interceptors?.responseInterceptors) {
      this.instance.interceptors.response.use(
        config.interceptors.responseInterceptors
      );
    }
  }
  removePending(key, isRequest = false) {
    // 如果 pending 中存在key，并且正在请求，则取消请求
    if (this.pending[key] && isRequest) {
      this.pending[key]("取消重复请求");
    }
    delete this.pending[key];
  }
  request(config) {
    return new Promise((resolve, reject) => {
      // 判断单独的请求有没有设置 loading
      if (config.loading) {
        this.loading = config.loading;
      }
      if (config.requestInterceptors) {
        this.instance.interceptors.request.use(config.requestInterceptors);
      }

      this.instance
        .request(config)
        .then((v) => {
          if (config.responseInterceptors) {
            this.instance.interceptors.response.use(
              config.responseInterceptors
            );
          }
          resolve(v);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  get(config) {
    if (typeof config === "string") {
      return this.request({ method: "GET", url: config });
    }
    return this.request({ method: "GET", ...config });
  }
  post(config) {
    return this.request({ method: "POST", ...config });
  }
  delete(config) {
    return this.request({ method: "DELETE", ...config });
  }
}

export default ZRequest;
