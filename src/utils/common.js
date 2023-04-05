// 防抖
function debounce(func, delay = 100) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// 节流
function throttle(fn, delay = 100) {
  let timer = null
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      // 执行事件的回调函数
      fn.apply(this, arguments)
      // 执行后清空定时器
      timer = null
    }, delay)
  }
}

export { debounce, throttle }
