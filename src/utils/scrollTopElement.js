// 跳转动画
const getElementY = (element) => {
  // 获取该元素距离视口顶部的位置 + window 已滚动的像素值
  return (
    window.scrollY + document.querySelector(element).getBoundingClientRect().top
  );
};

const scrollTopElement = (elem, dt, offset) => {
  const startingY = window.scrollY;
  const elementY = getElementY(elem);
  // 需要滚动的距离
  const diff = elementY - startingY + offset;
  if (!diff) return;
  const easing = (x) => (x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2);
  let start; // 初始化滚动时间
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    // 计算时间的差值，根据差值计算偏移量
    const time = timestamp - start;
    let percent = Math.min(time / dt, 1);
    percent = easing(percent); // 使用动画效果
    window.scrollTo(0, startingY + diff * percent);
    if (time < dt) {
      window.requestAnimationFrame(step);
    }
  });
};

export default scrollTopElement;
