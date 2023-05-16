/**
 * 标注主体界面
 */
import { useRef, useState, useEffect } from "react"

export default function Editor() {
  // canvas元素
  const canvasRef = useRef()
  // 背景图片(清除框后再填充回来，防止画框时背景消失)
  const backgroundRef = useRef()
  const [ctx, setCtx] = useState()

  useEffect(() => {
    // 初始化canvas上下文
    const context = canvasRef.current.getContext("2d", {
      // 在设置 willReadFrequently 的情况下读取像素数据(优化getImageData函数)
      willReadFrequently: true,
    })
    setCtx(context)
    // 注册键盘事件
    // document.addEventListener("keydown", handleKeyEvent)
    return () => {
      // document.removeEventListener("keydown", handleKeyEvent)
    }
  }, [])

  useEffect(() => {
    canvasRef.current.onmousedown = handleMousedown
    canvasRef.current.onmousemove = handleMousemove
    canvasRef.current.onmouseup = handleMouseup
    return () => {
      canvasRef.current.onmousedown = null
      canvasRef.current.onmousemove = null
      canvasRef.current.onmouseup = null
    }
  }, [ctx])

  // ******************* 画图相关start ********************/
  function Rect(startX, startY, endX, endY, color, isSelected = true) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.color = color
    this.isSelected = isSelected
    this.label = ""
  }

  const rectList = useRef([])

  // console.log(`rectList.current`, rectList.current)
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

  let color = "yellow"

  // 判断鼠标点击点是否落在已有标注框内
  const isFrameExist = (item) => {
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
  }

  function handleMousedown(e) {
    // 未导入图片时不能标注
    // if (selected === -1) return
    startX = e.offsetX
    startY = e.offsetY

    const rectIndex = rectList.current.findIndex((item) => isFrameExist(item))
    currentRect = rectList.current[rectIndex]
    console.log(`!rect`, currentRect?.isSelected)

    if (currentRect && currentRect.isSelected === true) {
      isDragging = true
    } else {
      isDrawing = true
    }

    // rectIndex不为-1，代表当前是拖拽状态
    // if (rectIndex !== -1) {
    //   // currentRect = rectList.current[rectIndex]
    //   // isDragging = true
    //   currentRect.isSelected = true
    //   // undoArray.pop()
    //   // const tempRectList = rectList.current.slice()
    //   // const tempCurrentRect = Object.assign({}, currentRect)
    //   // tempRectList.splice(rectIndex, 1, tempCurrentRect)
    //   // undoArray.push(tempRectList)
    // } else {
    //   // 绘制状态
    //   isDrawing = true
    // }
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
      // ctx.globalAlpha = 0.5
      // ctx.fillStyle = "yellow"
      // ctx.fill()
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
    // if (currentRect.isSelected) {
    //   drawRects()
    // }
    if (isDrawing) {
      // 鼠标误点击时不画框
      if (Math.abs(startX - endX) < 5 || Math.abs(startY - endY) < 5) return
      const newRect = new Rect(startX, startY, endX, endY, color, true)
      rectList.current.push(newRect)
      console.log(`rectList.current`, rectList.current)
    }
    if (isDragging) {
      rectList.current.forEach((item) => {
        item.isSelected = false
      })
    }
    // undoArray.push(rectList.current.slice())
    // redoArray = []
    isDrawing = false
    isDragging = false
  }
  // 绘制所有已有矩形框
  function drawRects() {
    // ctx未初始化时不画框
    if (!ctx) return
    // 清除所有矩形
    clearCanvas()
    // console.log(`rectList.current`, rectList.current)
    // 将列表保存的矩形画上去
    for (let i = 0; i < rectList.current.length; i++) {
      let rect = rectList.current[i]
      ctx.beginPath()
      ctx.moveTo(rect.startX, rect.startY)
      ctx.lineTo(rect.endX, rect.startY)
      ctx.lineTo(rect.endX, rect.endY)
      ctx.lineTo(rect.startX, rect.endY)
      ctx.lineTo(rect.startX, rect.startY)
      ctx.strokeStyle = "yellow"
      ctx.lineWidth = 3
      // 高亮选中矩形
      if (rect.isSelected) {
        ctx.globalAlpha = 0.3
        ctx.fillStyle = "yellow"
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.stroke()
    }
  }

  // 删除所有矩形框，清空画布
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // 清除完之后把背景图片放回去
    // ctx.putImageData(backgroundRef.current, 0, 0)
  }

  // **************** 画图相关end ********************/

  return (
    <div className="editor">
      {/* 画布 */}
      <div className="content">
        <canvas
          id="canvas"
          width={Math.floor(document.documentElement.clientWidth - 308 - 308)}
          height={Math.floor(
            document.documentElement.clientHeight - 33 - 40 - 40
          )}
          style={{
            border: "3px solid #ccc",
            backgroundColor: "#4c4c4c",
            marginLeft: "325px",
          }}
          ref={canvasRef}
        >
          Sorry, your browser does not support HTML5 Canvas functionality which
          is required for this application.
        </canvas>
      </div>
    </div>
  )
}
