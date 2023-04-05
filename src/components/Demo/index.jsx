import { useEffect, useRef, useState } from "react"
import { initDrawer, clearAll, throttle } from "../../utils"
import "./index.scss"

export default function Demo() {
  // canvas元素
  const canvasRef = useRef()
  // 文件上传框
  const fileRef = useRef()
  // 背景图片
  const backgroundRef = useRef()
  const [ctx, setCtx] = useState()
  const [cursor, setCursor] = useState("default")
  // 当前标注图片
  const [selectedImg, setSelectedImg] = useState()
  // 所有图片数据集
  const [files, setFiles] = useState([])
  // 导出全局json配置
  const [globalData, setGlobalData] = useState({
    settings: {},
    img_annotations: {},
    img_attributes: {
      region: {
        type: {
          type: "radio",
          description: "",
          options: {
            head_overwater: "",
            head_underwater: "",
            body_overwater: "",
            body_underwater: "",
          },
          default_options: {},
        },
      },
    },
    img_id_list: [],
    version: "1.0",
  })

  function Rect(startX, startY, endX, endY, color) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.color = color
    this.isSelected = false
  }
  // 标记框数组
  const [rectArray, setRectArray] = useState([])

  let rectList = []
  let undoArray = []
  let redoArray = []

  let startX
  let startY
  let endX
  let endY

  let width = 0
  let height = 0

  let isDrawing = false
  let isDragging = false

  let currentRect

  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "magenta",
    "orange",
    "brown",
    "purple",
    "pink",
  ]
  let color

  function handleMousedown(e) {
    startX = e.offsetX
    startY = e.offsetY
    const rectIndex = rectList.findIndex((item) => {
      if (item.startX < item.endX) {
        if (item.startY < item.endY) {
          return (
            startX > item.startX &&
            startX < item.endX &&
            startY > item.startY &&
            startY < item.endY
          )
        } else {
          return (
            startX > item.startX &&
            startX < item.endX &&
            startY > item.endY &&
            startY < item.startY
          )
        }
      } else {
        if (item.startY < item.endY) {
          return (
            startX > item.endY &&
            startX < item.startY &&
            startY > item.startY &&
            startY < item.endY
          )
        } else {
          return (
            startX > item.startX &&
            startX < item.endX &&
            startY > item.endY &&
            startY < item.startY
          )
        }
      }
    })
    // rectIndex不为-1，代表当前是拖拽状态
    if (rectIndex !== -1) {
      currentRect = rectList[rectIndex]
      isDragging = true
      currentRect.isSelected = true
      undoArray.pop()
      const tempRectList = rectList.slice()
      const tempCurrentRect = Object.assign({}, currentRect)
      tempRectList.splice(rectIndex, 1, tempCurrentRect)
      undoArray.push(tempRectList)
    } else {
      // 绘制状态
      isDrawing = true
    }
    color = colors[randomFromTo(0, 8)]
  }

  function handleMousemove(e) {
    endX = e.offsetX
    endY = e.offsetY
    if (isDrawing) {
      drawRects()
      // 绘制新矩形框
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, startY)
      ctx.lineTo(endX, endY)
      ctx.lineTo(startX, endY)
      ctx.lineTo(startX, startY)
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.stroke()
    } else if (isDragging) {
      const w = Math.abs(startX - endX)
      const h = Math.abs(startY - endY)
      if (endX < startX) {
        startX -= w
        endX -= w
        currentRect.startX -= w
        currentRect.endX -= w
      }
      if (endX >= startX) {
        startX += w
        endX += w
        currentRect.startX += w
        currentRect.endX += w
      }
      if (endY < startY) {
        startY -= h
        endY -= h
        currentRect.startY -= h
        currentRect.endY -= h
      }
      if (endY >= startY) {
        startY += h
        endY += h
        currentRect.startY += h
        currentRect.endY += h
      }
      drawRects()
    }
  }

  function handleMouseup(e) {
    if (isDrawing) {
      rectList.unshift(new Rect(startX, startY, endX, endY, color))
    }
    if (isDragging) {
      rectList.forEach((item) => {
        item.isSelected = false
      })
    }
    undoArray.push(rectList.slice())
    redoArray = []
    isDrawing = false
    isDragging = false
  }
  // 绘制所有已有矩形框
  function drawRects() {
    // 清除所有矩形
    clearCanvas()
    // 将列表保存的矩形画上去
    for (let i = 0; i < rectList.length; i++) {
      let rect = rectList[i]
      ctx.beginPath()
      ctx.moveTo(rect.startX, rect.startY)
      ctx.lineTo(rect.endX, rect.startY)
      ctx.lineTo(rect.endX, rect.endY)
      ctx.lineTo(rect.startX, rect.endY)
      ctx.lineTo(rect.startX, rect.startY)
      ctx.strokeStyle = rect.color
      ctx.lineWidth = 3
      // 高亮选中矩形
      if (rect.isSelected) {
        ctx.globalAlpha = 0.3
        ctx.fillStyle = rect.color
        ctx.fill()
      }
      ctx.stroke()
    }
  }

  //在某个范围内生成随机数
  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
  }

  // 删除所有矩形框，清空画布
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 清除完之后把背景图片放回去
    ctx.putImageData(backgroundRef.current, 0, 0)
  }

  function undo() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    redoArray.push(undoArray.pop())
    if (undoArray.length > 0) {
      rectList = undoArray[undoArray.length - 1].slice()
    } else {
      rectList = []
    }
    console.log("撤销")
    console.log("undoArray", undoArray)
    console.log("redoArray", redoArray)
    drawRects()
  }

  function redo() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (redoArray.length > 0) {
      rectList = redoArray[redoArray.length - 1].slice()
      undoArray.push(redoArray.pop())
    }
    console.log("前进")
    console.log("undoArray", undoArray)
    console.log("redoArray", redoArray)
    drawRects()
  }

  useEffect(() => {
    // 初始化canvas上下文
    const context = canvasRef.current.getContext("2d")
    setCtx(context)
    // 注册键盘事件
    document.addEventListener("keydown", handleKeyEvent)
    return () => {
      document.removeEventListener("keydown", handleKeyEvent)
    }
  }, [])
  // 处理键盘快捷键事件
  function handleKeyEvent(event) {
    // 处理 Ctrl + Z 事件
    if (event.ctrlKey && ["z", "Z"].includes(event.key)) {
      undo()
    }
    // 处理 Ctrl + Y 事件
    if (event.ctrlKey && ["y", "Y"].includes(event.key)) {
      redo()
    }
  }

  useEffect(() => {
    canvasRef.current.onmousedown = handleMousedown
    canvasRef.current.onmousemove = handleMousemove
    canvasRef.current.onmouseup = handleMouseup
    return () => {
      canvasRef.current.onmousedown = null
      canvasRef.current.onmousemove = null
      canvasRef.current.onmouseup = null
    }
  }, [ctx, rectArray])

  // 加载图片
  const load = async () => {
    fileRef.current.click()
    fileRef.current.onchange = () => {
      const files = Array.from(fileRef.current.files)
      setFiles(files)
      // console.log(`files`, files)
      // 收集图像名称列表，用于导出json
      const img_id_list = files.map((file) => file.name)
      setGlobalData({ ...globalData, img_id_list })
      // 默认选中第一个图片
      setSelectedImg(0)
    }
  }
  // 根据当前选中的index展示不同的图片
  const showImage = (index) => {
    if (files.length === 0) return
    const url = URL.createObjectURL(files[index])
    // 生成图片
    const image = new Image()
    image.src = url
    image.onload = () => {
      ctx.drawImage(
        image,
        0,
        0,
        Math.floor(canvasRef.current.width),
        Math.floor(canvasRef.current.height)
      )
      backgroundRef.current = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
    }
  }

  showImage(selectedImg)

  // 保存参数
  const download = () => {
    // 生成要下载的 JSON 数据
    const jsonData = JSON.stringify(globalData)

    // 创建 Blob 对象，并指定 MIME 类型为 application/json
    const blob = new Blob([jsonData], { type: "application/json" })

    // 创建 URL 对象，并将 Blob 对象引用赋值给它
    const url = URL.createObjectURL(blob)

    // 创建一个链接元素并设置其属性
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `测试-${globalData.version}.json`)

    // 将链接元素添加到文档中，并模拟点击它以触发下载
    document.body.appendChild(link)
    link.click()

    // 清理对象 URL
    URL.revokeObjectURL(url)
  }

  const go = (type) => () => {
    if (type === "prev") {
      const prevIndex = selectedImg === 0 ? files.length - 1 : selectedImg - 1
      setSelectedImg(prevIndex)
    } else if (type === "next") {
      const nextIndex = selectedImg === files.length - 1 ? 0 : selectedImg + 1
      setSelectedImg(nextIndex)
    }
  }

  return (
    <div>
      <div className="container">
        <canvas
          id="canvas"
          className="canvas"
          width={Math.floor(document.documentElement.clientWidth * 0.6)}
          height={Math.floor(document.documentElement.clientHeight * 0.55)}
          style={{ cursor }}
          ref={canvasRef}
        >
          Sorry, your browser does not support HTML5 Canvas functionality which
          is required for this application.
        </canvas>
        <div className="button">
          <button
            className="left"
            onClick={() => {
              go("prev")
            }}
          >
            prev
          </button>

          <button className="left" onClick={load}>
            <input type="file" ref={fileRef} multiple hidden />
            load
          </button>
          <button className="right" onClick={download}>
            download
          </button>
          <button
            className="left"
            onClick={() => {
              go("next")
            }}
          >
            next
          </button>
        </div>
      </div>
    </div>
  )
}
