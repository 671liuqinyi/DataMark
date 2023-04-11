import { useState } from "react"
import { Modal, Divider, Input, message, Table } from "antd"
import AddIcon from "../../assets/plus.png"

import "./index.scss"

const columns = [
  {
    title: "标签名称",
    dataIndex: "name",
  },
]

const EditLabel = (props) => {
  const { isModalOpen, labelArr, setIsModalOpen, setLabelArr } = props
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [value, setValue] = useState("")

  // 表格数据
  const tableData = labelArr.map((label, index) => {
    return {
      id: index,
      name: label,
      key: index,
    }
  })

  // 父modal处理函数
  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  // 新增label
  const addLabel = () => {
    setIsSubModalOpen(true)
  }

  // 子modal处理函数
  const handleSubModalOk = () => {
    if (labelArr.includes(value)) {
      message.info("该标签已存在！")
      return
    }
    setLabelArr([...labelArr, value])
    setIsSubModalOpen(false)
    setValue("")
  }
  const handleSubModalCancel = () => {
    setIsSubModalOpen(false)
    setValue("")
  }
  return (
    <>
      <Modal
        width={500}
        title="标签管理"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        centered
      >
        <div className="label-container">
          <div>使用 + 按钮可以添加一个新的空文本字段作为标签。</div>
          <Divider style={{ margin: "10px 0" }}></Divider>
          <div className="icon" onClick={addLabel}>
            <img src={AddIcon} alt="add" />
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <div className="label-list">
            {/* {labelArr.map((label, index) => {
              return (
                <div className="label-list-item" key={index}>
                  {label}
                </div>
              )
            })} */}
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              scroll={{ y: 200 }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="新增标签"
        width={400}
        open={isSubModalOpen}
        onOk={handleSubModalOk}
        onCancel={handleSubModalCancel}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        centered
      >
        <Input
          placeholder="请输入标签名称"
          // autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
      </Modal>
    </>
  )
}
export default EditLabel
