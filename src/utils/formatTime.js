import moment from "moment";
import "moment/locale/zh-cn";
export default (time) => {
  if (moment(time).isBefore(moment().subtract(7, "days"))) {
    return moment(time).format("YYYY-MM-DD");
  } else {
    return moment(time).from(moment());
  }
};
