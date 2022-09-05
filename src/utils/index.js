import SparkMD5 from "spark-md5";

// 生成 base64 虽然这个和下面这个都没用到
export const changeBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
    reader.onerror = (err) => reject(err);
  });
};

// 生成文件 HASH
export const changeBuffer = (file) => {
  return new Promise((resolve, reject) => {
    // 先转成 buffer
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      let buffer = e.target.result;
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]; // 取出后缀名
      // 使用插件生成 HASH
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const HASH = spark.end();
      resolve({
        filename: `${HASH}.${suffix}`,
      });
    };
    fileReader.onerror = (err) => {
      reject(err);
    };
  });
};

// 数据是否为空
export const isEmpty = (value) => {
  return typeof value === "undefined" || value === null || value === "";
};
