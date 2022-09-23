export const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://192.168.137.128:3000"
    : "http://localhost:3000";

export const wsUrl =
  process.env.NODE_ENV === "production" ? "192.168.137.128" : "127.0.0.1";
