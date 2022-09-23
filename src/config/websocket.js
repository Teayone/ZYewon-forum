import store from "@/store";
import { wsUrl } from "./index";
class WebSocketClient {
  constructor(config = {}) {
    const defaultConfig = {
      url: wsUrl,
      port: "3001",
      protocol: "ws",
    };
    const finalConfig = { ...defaultConfig, ...config };
    this.ws = {};
    this.port = finalConfig.port;
    this.url = finalConfig.url;
    this.protocol = finalConfig.protocol;
    this.timeInterval = 31 * 1000;
    this.interval = null;
  }
  init() {
    this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }
  send(msg) {
    this.ws.send(msg);
  }
  // ws 连接成功
  onOpen() {
    // 发起鉴权消息，
    this.send(
      JSON.stringify({
        event: "auth",
        message: "Bearer " + store.state.login.token,
      })
    );
    this.checkServer();
  }
  onMessage(msg) {
    const msgData = JSON.parse(msg.data);
    switch (msgData.event) {
      case "noauth":
        this.ws.close();
        break;
      case "heartbeat":
        this.checkServer();

        this.send(
          JSON.stringify({
            event: "heartbeat",
            message: "pong",
          })
        );

        break;
      default:
        store.dispatch(`ws/onMessage`, msgData);
    }
  }
  // 连接关闭的时候
  onClose() {
    this.ws.close();
  }
  onError() {
    setTimeout(() => {
      this.init();
    }, 2000);
  }
  checkServer() {
    clearTimeout(this.interval);
    // 开启延迟定时器，根据下一次心跳检测时间来定，如果定时器触发，却没有检测，则认定连接出现问题，短线重连
    this.interval = setTimeout(() => {
      this.ws.close();
      this.onError();
    }, this.timeInterval);
  }
}

export default WebSocketClient;
