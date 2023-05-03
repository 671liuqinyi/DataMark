/**
 * 标签管理界面
 * 在页面中可以对标签类型进行管理
 */
import React, { useState } from "react"
import { Modal, Divider, Button, Progress } from "antd"
import MyTag from "./MyTag"
import AILabelSelect from "./AILabelSelect"

import "./index.scss"

const EditLabel = (props) => {
  const {
    isModalOpen,
    labelArr,
    setIsModalOpen,
    setLabelArr,
    isAIAssist,
    imgList,
  } = props
  // 是否正在处理ai标注
  const [isProgress, setIsProgress] = useState(false)
  // ai处理进度
  const [percent, setPercent] = useState(0)
  // 接口错误进度条样式
  const [status, setStatus] = useState("")
  // 父modal普通处理函数
  const handleOk = () => {
    // 关闭弹窗
    setIsModalOpen(false)
  }
  // 父modal的ai标注处理函数
  const handleAIOk = async () => {
    // 第一次点击只修改样式，不关闭弹窗
    if (!isProgress) {
      setIsProgress(true)
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
        console.log(`ai-progress-data`, data)
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
                <AILabelSelect />
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
