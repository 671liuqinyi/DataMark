/**
 * 标签管理界面
 * 在页面中可以对标签类型进行管理
 */
import React from "react"
import { Modal, Divider, Button } from "antd"
import MyTag from "./MyTag"

import "./index.scss"

const EditLabel = (props) => {
  const { isModalOpen, labelArr, setIsModalOpen, setLabelArr } = props

  // 父modal处理函数
  const handleOk = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Modal
        width={500}
        title="标签管理"
        open={isModalOpen}
        footer={[<Button onClick={handleOk}>关闭</Button>]}
        maskClosable={false}
        onCancel={handleOk}
        centered
      >
        <div className="label-container">
          <div>
            点击 <strong>+新增</strong> 按钮可以添加一个新的字段作为标签。
            <br />
            点击标签中的 <strong>X</strong> 号可以去除某个标签。
            <br />
            <strong>双击</strong> 标签可以修改标签内容
          </div>
          <Divider style={{ margin: "10px 0" }}></Divider>
          <div className="label-list">
            <MyTag labelArr={labelArr} setLabelArr={setLabelArr} />
          </div>
        </div>
      </Modal>
    </>
  )
}
export default EditLabel
