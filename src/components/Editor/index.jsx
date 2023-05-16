/**
 * 标注主体界面
 */
import React, { useRef, useState, useEffect } from "react"
import LeftArrow from "../../assets/left.png"
import RightArrow from "../../assets/right.png"
import ZoomIn from "../../assets/zoom-in.png"
import ZoomOut from "../../assets/zoom-out.png"
import DeleteIcon from "../../assets/trash.png"
import { Tooltip, message } from "antd"
import { Rect } from "../../utils"
import "./index.scss"
export default function Editor(props) {
  const {
    imgList,
    selected,
    labelType,
    syncLabel,
    labelToColor,
    scaleObj,
    setSelected,
    setImgList,
    setSyncLabel,
  } = props
  const imageObj = imgList.filter((img) => img.id === selected)[0]
  // canvas元素
  const canvasRef = useRef()
  // 背景图片(清除框后再填充回来，防止画框时背景消失)
  const backgroundRef = useRef()
  const [ctx, setCtx] = useState()
  // canvas鼠标样式
  const [cursor, setCursor] = useState("default")
  // 缩放矩形框的类型
  // [↖,↑,↗,←,→,↙,↓,↘,move,default]
  // [left-top,top,right-top,left,right,left-bottom,bottom,right-bottom,move,default]
  const resizeTag = useRef("default")

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
  }, [ctx, selected, imgList, cursor])

  useEffect(() => {
    // 初始化图片缩放比例
    initImageScale()
  }, [imgList])

  // ******************* 画图相关start ********************/
  // function Rect(startX, startY, endX, endY, color) {
  //   this.startX = startX
  //   this.startY = startY
  //   this.endX = endX
  //   this.endY = endY
  //   this.color = color
  //   this.isSelected = false
  //   this.label = ""
  // }

  const rectList = useRef([])
  // syncLabel修改时同步两个标注框数组
  useEffect(() => {
    // console.log(`sync`)
    const imageObj = imgList.filter((img) => img.id === selected)[0]
    // console.log(`imageObj`, imageObj)
    rectList.current = imageObj?.labelObj?.[labelType] ?? []
  }, [syncLabel, selected])

  // console.log(`rectList.current`, rectList.current)
  let undoArray = []
  let redoArray = []

  let startX = 0
  let startY = 0
  let endX = 0
  let endY = 0

  let widthBias = 0
  let heightBias = 0

  let isDrawing = false
  let isDragging = false
  let isResizing = false

  let currentRect = useRef()
  let rectIndex = useRef()

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
  // 调整标注框大小
  const resizeLabelFrame = (type) => {
    switch (type) {
      case "left-top": {
        console.log(`currentRect`, currentRect.current)
        let x1, y1, x2, y2
        x1 = endX
        y1 = endY
        x2 = currentRect.current.endX
        y2 = currentRect.current.endY
        drawRects()
        // 绘制新矩形框
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x1, y2)
        ctx.lineTo(x1, y1)
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.stroke()
        break
      }

      case "top":
        console.log(`2`)
        break
      case "right-top":
        console.log(`3`)
        break
      case "left":
        console.log(`4`)
        break
      case "right":
        console.log(`5`)
        break
      case "left-bottom":
        console.log(`6`)
        break
      case "bottom":
        console.log(`7`)
        break
      case "right-bottom":
        console.log(`8`)
        break
      default:
        break
    }
  }

  function handleMousedown(e) {
    // 未导入图片时不能标注
    if (selected === -1) return

    startX = e.offsetX
    startY = e.offsetY
    // 正常情况
    if (["default", "move"].includes(cursor)) {
      rectIndex.current = rectList.current.findIndex((item) =>
        isFrameExist(item)
      )
      currentRect.current = rectList.current[rectIndex.current]
      if (currentRect.current && currentRect.current.isSelected === true) {
        isDragging = true
        isDrawing = false
      } else {
        isDragging = false
        isDrawing = true
      }
    } else {
      // 矩形框缩放情况
      isResizing = true
    }
  }

  function handleMousemove(e) {
    endX = e.offsetX
    endY = e.offsetY
    if (isResizing) {
      console.log(`isResizing move`)
      // 临时加一个rect，等到鼠标松开时替换掉原来的rect
      resizeLabelFrame(resizeTag.current)
    } else {
      // 改变canvas的cursor样式
      if (currentRect.current && currentRect.current.isSelected) {
        changeCursor()
      }
    }

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
      // 累计拖动距离
      widthBias += w
      heightBias += h

      if (endX < startX) {
        startX -= w
        endX -= w
        currentRect.current.startX -= w
        currentRect.current.endX -= w
      }
      if (endX >= startX) {
        startX += w
        endX += w
        currentRect.current.startX += w
        currentRect.current.endX += w
      }
      if (endY < startY) {
        startY -= h
        endY -= h
        currentRect.current.startY -= h
        currentRect.current.endY -= h
      }
      if (endY >= startY) {
        startY += h
        endY += h
        currentRect.current.startY += h
        currentRect.current.endY += h
      }
      drawRects()
    }
  }

  function handleMouseup(e) {
    endX = e.offsetX
    endY = e.offsetY
    if (isDrawing) {
      // 鼠标误点击
      if (
        rectIndex.current === -1 &&
        (Math.abs(startX - endX) < 5 || Math.abs(startY - endY) < 5)
      ) {
        isDrawing = false
        isDragging = false
        return
      }
      const newRect = new Rect(startX, startY, endX, endY, color)
      // rectList.current.push(newRect)
      console.log(`rectList.current`, rectList.current)

      setImgList((imgList) => {
        const newImageList = imgList.map((imgObj) => {
          if (selected === imgObj.id) {
            // 取消之前选中状态
            imgObj.labelObj[labelType].forEach(
              (item) => (item.isSelected = false)
            )
            // 鼠标移动距离太小时，如果鼠标在框内，选中当前矩形框
            if (Math.abs(startX - endX) < 5 || Math.abs(startY - endY) < 5) {
              imgObj.labelObj[labelType][rectIndex.current].isSelected = true
            } else {
              // 在state中更新矩形
              imgObj.labelObj[labelType].push(newRect)
              // 新建时确定当前选中矩形
              currentRect.current = newRect
              rectIndex.current = imgObj.labelObj[labelType].length - 1
            }
          }
          return imgObj
        })
        console.log(`newImageList`, newImageList)
        return newImageList
      })
      // 同步页面数据,展示矩形
      setSyncLabel((pre) => pre + 1)
    }
    if (isDragging) {
      if (widthBias < 5 || heightBias < 5) {
        setImgList((imgList) => {
          const newImageList = imgList.map((imgObj) => {
            if (selected === imgObj.id) {
              // 鼠标移动距离太小时，如果鼠标在框内，取消当前矩形框选中状态
              imgObj.labelObj[labelType][rectIndex.current].isSelected = false
              setCursor("default")
            }
            return imgObj
          })
          return newImageList
        })
        // 同步页面数据,展示矩形
        setSyncLabel((pre) => pre + 1)
      }
    }
    if (isResizing) {
      console.log(`isResizing end`)
      setImgList((imgList) => {
        const newImageList = imgList.map((imgObj) => {
          if (selected === imgObj.id) {
            // 修改rect状态
            imgObj.labelObj[labelType].forEach((item) => {
              if (item.isSelected === true) {
                // 重新排列矩形框起始点和终点坐标
                if (endX < item.endX && endY < item.endY) {
                  item.startX = endX
                  item.startY = endY
                } else {
                  item.startX = item.endX
                  item.startY = item.endY
                  item.endX = endX
                  item.endY = endY
                }
              }
            })
          }
          return imgObj
        })
        console.log(`newImageList`, newImageList)
        return newImageList
      })
      // 同步页面数据,展示矩形
      setSyncLabel((pre) => pre + 1)
    }
    undoArray.push(rectList.current.slice())
    redoArray = []
    isDrawing = false
    isDragging = false
    isResizing = false
    widthBias = 0
    heightBias = 0
  }

  // 改变canvas的cursor样式
  function changeCursor() {
    const rect = currentRect.current
    let width = rect.endX - rect.startX
    let height = rect.endY - rect.startY

    if (
      // ↖
      Math.abs(rect.startX - endX) <= 5 &&
      Math.abs(rect.startY - endY) <= 5
    ) {
      setCursor("nwse-resize")
      resizeTag.current = "left-top"
    } else if (
      // ↘
      Math.abs(rect.endX - endX) <= 5 &&
      Math.abs(rect.endY - endY) <= 5
    ) {
      setCursor("nwse-resize")
      resizeTag.current = "right-bottom"
    } else if (
      // ↗
      Math.abs(rect.endX - endX) <= 5 &&
      Math.abs(rect.startY - endY) <= 5
    ) {
      setCursor("nesw-resize")
      resizeTag.current = "right-top"
    } else if (
      // ↙
      Math.abs(rect.startX - endX) <= 5 &&
      Math.abs(rect.endY - endY) <= 5
    ) {
      setCursor("nesw-resize")
      resizeTag.current = "left-bottom"
    } else if (
      // ←
      Math.abs(rect.startX - endX) <= 5 &&
      Math.abs(rect.startY + height / 2 - endY) <= 5
    ) {
      setCursor("ew-resize")
      resizeTag.current = "left"
    } else if (
      // →
      Math.abs(rect.endX - endX) <= 5 &&
      Math.abs(rect.startY + height / 2 - endY) <= 5
    ) {
      setCursor("ew-resize")
      resizeTag.current = "right"
    } else if (
      // ↑
      Math.abs(rect.startX + width / 2 - endX) <= 5 &&
      Math.abs(rect.startY - endY) <= 5
    ) {
      setCursor("ns-resize")
      resizeTag.current = "top"
    } else if (
      // ↓
      Math.abs(rect.startX + width / 2 - endX) <= 5 &&
      Math.abs(rect.endY - endY) <= 5
    ) {
      setCursor("ns-resize")
      resizeTag.current = "bottom"
    } else if (
      endX > rect.startX + 5 &&
      endX < rect.endX - 5 &&
      endY > rect.startY + 5 &&
      endY < rect.endY - 5
    ) {
      // move样式
      setCursor("move")
      resizeTag.current = 9
    } else {
      // 默认
      setCursor("default")
      resizeTag.current = 10
    }
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
      ctx.strokeStyle = rect.label ? labelToColor[rect.label] : color
      ctx.lineWidth = 2
      ctx.stroke()
      // 高亮选中矩形
      if (rect.isSelected) {
        ctx.globalAlpha = 0.3
        ctx.fillStyle = rect.label ? labelToColor[rect.label] : color
        ctx.fill()
        // 为选中的矩形框绘制红色圆点
        drawResizeDot(rect)
      }
    }
  }
  // 为选中的矩形框绘制红色圆点
  function drawResizeDot(rect) {
    const dotRadius = 3
    const dotColor = "#ff0000"
    ctx.strokeStyle = dotColor
    ctx.fillStyle = dotColor
    ctx.globalAlpha = 1

    // 绘制圆点(左上)
    ctx.beginPath()
    ctx.arc(rect.startX, rect.startY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
    // 绘制圆点(中上)
    ctx.beginPath()
    ctx.arc(
      (rect.startX + rect.endX) / 2,
      rect.startY,
      dotRadius,
      0,
      Math.PI * 2
    )
    ctx.fill()
    // 绘制圆点(右上)
    ctx.beginPath()
    ctx.arc(rect.endX, rect.startY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
    // 绘制圆点(左中)
    ctx.beginPath()
    ctx.arc(
      rect.startX,
      (rect.startY + rect.endY) / 2,
      dotRadius,
      0,
      Math.PI * 2
    )
    ctx.fill()
    // 绘制圆点(右中)
    ctx.beginPath()
    ctx.arc(rect.endX, (rect.startY + rect.endY) / 2, dotRadius, 0, Math.PI * 2)
    ctx.fill()
    // 绘制圆点(左下)
    ctx.beginPath()
    ctx.arc(rect.startX, rect.endY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
    // 绘制圆点(中下)
    ctx.beginPath()
    ctx.arc((rect.startX + rect.endX) / 2, rect.endY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
    // 绘制圆点(右下)
    ctx.beginPath()
    ctx.arc(rect.endX, rect.endY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
  }
  // 删除所有矩形框，清空画布
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // console.log(`!canvas`, canvas)

    // 清除完之后把背景图片放回去
    ctx.putImageData(backgroundRef.current, 0, 0)
  }

  // **************** 画图相关end ********************/

  // 初始化图片缩放比例
  const initImageScale = () => {
    imgList.forEach((img) => {
      const image = new Image()
      image.src = img.url
      image.onload = () => {
        const scale = {
          x: image.width / canvasRef.current.width,
          y: image.height / canvasRef.current.height,
          width: image.width,
          height: image.height,
        }
        // 更新数组
        scaleObj.current[img.id] = scale
      }
    })
  }

  // 根据当前选中的url展示不同的图片
  const showImage = (url) => {
    // 初始化时不生成图片
    if (!url) {
      // 图片被删除完时清理canvas
      ctx &&
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      return
    }
    // 生成图片
    const image = new Image()
    image.src = url
    image.onload = () => {
      // console.log(`img-width-height`, image.width, image.height)
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
        canvasRef.current.width,
        canvasRef.current.height
      )
      // 每次刷新时都要画框
      drawRects()
    }
  }
  // 每次刷新时都要显示图片
  showImage(imageObj?.url)

  // 切换图片
  const go = (type) => () => {
    if (imgList.length === 0) {
      message.warning("您还没有导入图片！")
      return
    }

    let prevIndex
    let nextIndex
    imgList.forEach((img, index) => {
      if (img.id === selected) {
        if (index === 0) {
          prevIndex = imgList[imgList.length - 1].id
        } else {
          prevIndex = imgList[index - 1].id
        }
        if (index === imgList.length - 1) {
          nextIndex = imgList[0].id
        } else {
          nextIndex = imgList[index + 1].id
        }
      }
    })
    if (type === "prev") {
      setSelected(prevIndex)
    } else if (type === "next") {
      setSelected(nextIndex)
    }
  }

  // 删除选中图片
  const handleDelete = () => {
    if (imgList.length === 0) return
    setImgList((prev) => {
      const newImgList = prev.filter((img) => img.id !== selected)
      // 删除后更新选中图片
      setSelected(newImgList.length === 0 ? -1 : newImgList[0].id)
      return [...newImgList]
    })
  }
  return (
    <div className="editor">
      {/* 菜单 */}
      <div className="banner">
        {imgList.length !== 0 && (
          <div className="menu-button no-select" onClick={handleDelete}>
            <Tooltip title={"删除选中图片"}>
              <img src={DeleteIcon} alt="delete" />
            </Tooltip>
          </div>
        )}
        {/* <div className="menu-button">
          <Tooltip title={"缩小"}>
            <img src={ZoomOut} alt="zoom out" />
          </Tooltip>
        </div>
        <div className="menu-button">
          <Tooltip title={"放大"}>
            <img src={ZoomIn} alt="zoom in" />
          </Tooltip>
        </div> */}
      </div>
      {/* 画布 */}
      <div className="content">
        <canvas
          // id="canvas"
          className="canvas"
          width={Math.floor(document.documentElement.clientWidth - 308 - 308)}
          height={Math.floor(
            document.documentElement.clientHeight - 33 - 40 - 40
          )}
          ref={canvasRef}
          style={{ cursor: cursor }}
        >
          Sorry, your browser does not support HTML5 Canvas functionality which
          is required for this application.
        </canvas>
      </div>
      {/* 底部 */}
      <div className="footer">
        <div
          className={`no-select left-arrow ${
            selected === -1 ? "grey-arrow" : ""
          }`}
          onClick={go("prev")}
        >
          <Tooltip title={"上一张"}>
            <img src={LeftArrow} alt="previous" />
          </Tooltip>
        </div>
        <div className="no-select cur-img-name ellipsis">
          <Tooltip title={imageObj?.name ?? "-"}>
            {imageObj?.name ?? "-"}
          </Tooltip>
        </div>
        <div
          className={`no-select right-arrow ${
            selected === -1 ? "grey-arrow" : ""
          }`}
          onClick={go("next")}
        >
          <Tooltip title={"下一张"}>
            <img src={RightArrow} alt="next" />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
