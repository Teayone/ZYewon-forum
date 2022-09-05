export default {
  username: [
    { required: true, message: "用户名不能为空" },
    {
      pattern: /^[a-zA-Z0-9_-]{4,16}$/,
      message: "用户名不合法，用户名长度位 4-16 位",
    },
  ],
  password: [{ required: true, message: "请输入密码" }],
  code: [{ required: true, message: "验证码不能为空" }],
  nickname: [{ required: true, message: "请输入昵称" }],
  email: [
    { required: true, message: "请输入邮箱" },
    {
      pattern:
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
      message: "邮箱格式不正确",
    },
  ],
};
