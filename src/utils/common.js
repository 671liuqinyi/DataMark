/**
 * 公共库函数
 */
import { labelList } from "./constant"
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

// 时间格式转化
function formatDate(timestamp) {
  const date = new Date(timestamp) // 将Unix时间戳转换为毫秒数
  const year = date.getFullYear()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  const hours = ("0" + date.getHours()).slice(-2)
  const minutes = ("0" + date.getMinutes()).slice(-2)
  const seconds = ("0" + date.getSeconds()).slice(-2)
  return `${year}/${month}/${day} ${hours}/${minutes}/${seconds}`
}

// 矩形类
function Rect(startX, startY, endX, endY, color = "yellow", label = "") {
  this.startX = startX
  this.startY = startY
  this.endX = endX
  this.endY = endY
  this.color = color
  this.isSelected = false
  this.label = label
}

// 将coco数字类别转换为label对象
const classToType = (number) => {
  return labelList.find((item) => item.index === number) || {}
}
export { debounce, throttle, formatDate, Rect, classToType }
