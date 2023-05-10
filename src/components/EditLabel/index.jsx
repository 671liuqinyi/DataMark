/**
 * 标签管理界面
 * 在页面中可以对标签类型进行管理
 */
import React, { useState } from "react"
import { Modal, Divider, Button, Progress } from "antd"
import MyTag from "./MyTag"
import AILabelSelect from "./AILabelSelect"
import { Rect, classToType } from "../../utils"
import "./index.scss"

const EditLabel = (props) => {
  const {
    isModalOpen,
    labelArr,
    setIsModalOpen,
    setLabelArr,
    isAIAssist,
    imgList,
    labelType,
    setImgList,
    setSyncLabel,
    scaleObj,
  } = props
  // 是否正在处理ai标注
  const [isProgress, setIsProgress] = useState(false)
  // ai处理进度
  const [percent, setPercent] = useState(0)
  // 接口错误进度条样式
  const [status, setStatus] = useState("")
  // ai标注类型选择框
  const [checkedList, setCheckedList] = useState([])

  // 父modal普通处理函数
  const handleOk = () => {
    // 关闭弹窗
    setIsModalOpen(false)
  }
  // 将ai返回数据填充到原来的数据结构
  const writeBack = (data) => {
    console.log(`!ai-progress-data`, data)
    // console.log(`!imgList`, imgList)
    // console.log(`!checkedList`, checkedList)

    // 修改labelArr，生成label->color映射
    setLabelArr([...checkedList])

    // 设置imglist
    setImgList((imgList) => {
      const newImageList = imgList.map((imgObj, index) => {
        // 在state中更新标注框
        const processedList = data[index]
        processedList.forEach((frame) => {
          if (labelType === "rect") {
            const [boxClass, x_center, y_center, width, height] = frame
              .split(" ")
              .map((str) => Number(str))
            // console.log(`!frame.split`, frame.split(" "))

            // 数据格式转换（yolo -> 前端 ）
            const {
              x: scaleX,
              y: scaleY,
              width: imgWidth,
              height: imgHeight,
            } = scaleObj.current[imgObj.id]
            const startX = Math.round(
              (imgWidth * (x_center - 0.5 * width)) / scaleX
            )
            const startY = Math.round(
              (imgHeight * (y_center - 0.5 * height)) / scaleY
            )
            const endX = Math.round(startX + (imgWidth * width) / scaleX)
            const endY = Math.round(startY + (imgHeight * height) / scaleY)
            const color = "yellow"
            // 将coco数字类别转换为英文label,只有找到了对应的类型才会新建标注框
            const typeObj = classToType(boxClass)
            if (checkedList.includes(typeObj.translation)) {
              const newRect = new Rect(
                startX,
                startY,
                endX,
                endY,
                color,
                typeObj.label
              )
              console.log(`newRect`, newRect)
              imgObj.labelObj["rect"].push(newRect)
            }
          }
        })
        return imgObj
      })
      console.log(`newImageList`, newImageList)
      return newImageList
    })
    // 同步页面数据,展示矩形
    setSyncLabel((pre) => pre + 1)
  }
  // 父modal的ai标注处理函数
  const handleAIOk = async () => {
    // 第一次点击只修改样式，不关闭弹窗
    if (!isProgress) {
      setIsProgress(true)
      // 清空ai选择标签列表
      setCheckedList([])
      // 执行ai标注
      let timer = null
      try {
        const formData = new FormData()
        for (let i = 0; i < imgList.length; i++) {
          formData.append("file", imgList[i].origin)
        }
        // 开启进度展示
        timer = setInterval(() => {
          setPercent((percent) => {
            const step = Math.round(Math.random() + 1) * 8
            if (step + percent <= 98) {
              return step + percent
            } else {
              clearInterval(timer)
              return 98
            }
          })
        }, 500)
        let response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        })
        let data = await response.json()
        // 将数据填充到原来的数据结构
        writeBack(data.processed_data)
        setPercent(100)
        // 清除进度展示
        clearInterval(timer)
      } catch (error) {
        clearInterval(timer)
        setStatus("exception")
        console.log(`error:执行ai标注`, error)
      }
    } else {
      // 第二次点击关闭弹窗
      setPercent(0)
      setIsModalOpen(false)
      setIsProgress(false)
    }
  }
  return (
    <>
      <Modal
        width={500}
        title="标签管理"
        open={isModalOpen}
        // footer作为渲染列表,每个元素需要添加唯一key
        footer={[
          <Button key="confirm" onClick={isAIAssist ? handleAIOk : handleOk}>
            确认
          </Button>,
        ]}
        maskClosable={false}
        onCancel={handleOk}
        centered
      >
        <div className="label-container">
          {isAIAssist ? (
            <div>请选择需要智能标注的标签种类</div>
          ) : (
            <div>
              点击 <strong>+新增</strong> 按钮可以添加一个新的字段作为标签。
              <br />
              点击标签中的 <strong>X</strong> 号可以去除某个标签。
              <br />
              <strong>双击</strong> 标签可以修改标签内容
            </div>
          )}
          <Divider style={{ margin: "10px 0" }}></Divider>
          {isProgress ? (
            <div className="progressing">
              <Progress
                type="circle"
                percent={percent}
                size={120}
                status={status}
              />
              <p className="progress-tip">
                {status === "exception"
                  ? "图片标注失败，请稍后再试！"
                  : percent === 100
                  ? "图片自动标注完成！"
                  : "图片处理中，请耐心等待!"}
              </p>
            </div>
          ) : (
            <div className="label-list">
              {isAIAssist ? (
                <AILabelSelect
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                />
              ) : (
                <MyTag labelArr={labelArr} setLabelArr={setLabelArr} />
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
export default EditLabel
