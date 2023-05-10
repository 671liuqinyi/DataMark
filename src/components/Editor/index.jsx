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
  }, [ctx, selected, imgList])

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

  function handleMousedown(e) {
    // 未导入图片时不能标注
    if (selected === -1) return
    startX = e.offsetX
    startY = e.offsetY
    const rectIndex = rectList.current.findIndex((item) => {
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
      currentRect = rectList.current[rectIndex]
      isDragging = true
      currentRect.isSelected = true
      undoArray.pop()
      const tempRectList = rectList.current.slice()
      const tempCurrentRect = Object.assign({}, currentRect)
      tempRectList.splice(rectIndex, 1, tempCurrentRect)
      undoArray.push(tempRectList)
    } else {
      // 绘制状态
      isDrawing = true
    }
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
      // 鼠标误点击时不画框
      if (Math.abs(startX - endX) < 5 || Math.abs(startY - endY) < 5) return
      const newRect = new Rect(startX, startY, endX, endY, color)
      // rectList.current.push(newRect)
      console.log(`rectList.current`, rectList.current)

      setImgList((imgList) => {
        const newImageList = imgList.map((imgObj, index) => {
          if (selected === imgObj.id) {
            // 在state中更新矩形
            imgObj.labelObj[labelType].push(newRect)
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
      rectList.current.forEach((item) => {
        item.isSelected = false
      })
    }
    undoArray.push(rectList.current.slice())
    redoArray = []
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
      ctx.strokeStyle = rect.label ? labelToColor[rect.label] : color
      ctx.lineWidth = 3
      // 高亮选中矩形
      if (rect.isSelected) {
        ctx.globalAlpha = 0.3
        ctx.fillStyle = rect.label ? labelToColor[rect.label] : color
        ctx.fill()
      }
      ctx.globalAlpha = 1

      ctx.stroke()
    }
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
          <div className="menu-button" onClick={handleDelete}>
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
        >
          Sorry, your browser does not support HTML5 Canvas functionality which
          is required for this application.
        </canvas>
      </div>
      {/* 底部 */}
      <div className="footer">
        <div
          className={`left-arrow ${selected === -1 ? "grey-arrow" : ""}`}
          onClick={go("prev")}
        >
          <Tooltip title={"上一张"}>
            <img src={LeftArrow} alt="previous" />
          </Tooltip>
        </div>
        <div className="cur-img-name ellipsis">
          <Tooltip title={imageObj?.name ?? "-"}>
            {imageObj?.name ?? "-"}
          </Tooltip>
        </div>
        <div
          className={`right-arrow ${selected === -1 ? "grey-arrow" : ""}`}
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
