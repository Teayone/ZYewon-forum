import { getCaptchaAsync } from "@/api/login";
import { v4 as uuid } from "uuid";
export default {
  data() {
    return {
      svg: "",
    };
  },
  mounted() {
    let sid = "";
    if (localStorage.getItem("sid")) {
      sid = localStorage.getItem("sid");
    } else {
      sid = uuid();
      localStorage.setItem("sid", sid);
    }
    this.$store.commit("global/SET_SID", sid);
    this.getCaptcha();
  },
  methods: {
    async getCaptcha() {
      const sid = this.$store.state.global.sid;
      const res = await getCaptchaAsync(sid);
      if (res.code === 200) {
        this.svg = res.data;
      }
    },
  },
};
