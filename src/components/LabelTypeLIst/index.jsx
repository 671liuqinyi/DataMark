import React from "react"
import { Collapse, List, Dropdown, message, Space } from "antd"
const { Panel } = Collapse
import DeleteIcon from "../../assets/trash.png"

import "./index.scss"

const LabelTypes = [
  { id: 1, type: "rect", label: "矩形" },
  { id: 2, type: "polygon", label: "多边形" },
  { id: 3, type: "point", label: "其他类型" },
  { id: 4, type: "line", label: "其他类型" },
]
export default function LabelTypeLIst(props) {
  const {
    labelObj,
    labelType,
    labelArr,
    rectArray,
    changeLabelType,
    setIsModalOpen,
  } = props
  console.log(`rectArray`, rectArray)

  const { rect, polygon, point, line } = labelObj
  const listData = rectArray.map((rect) => {
    return {
      rect,
    }
  })
  // 标注框列表
  const LabelList = () => (
    <List
      itemLayout="horizontal"
      dataSource={listData}
      renderItem={(item, index) => (
        <List.Item>
          <div className="label-box">
            <div
              className="color-select"
              style={{ backgroundColor: "skyblue" }}
            ></div>
            {/* 标注框内的标签选择列表 */}
            <div className="label-select">
              <LabelSelect />
            </div>
            <div className="delete-icon">
              <img src={DeleteIcon} alt="delete" />
            </div>
          </div>
        </List.Item>
      )}
    />
  )

  const LabelSelect = () => {
    const onClick = ({ key }) => {
      message.info(`Click on item ${key}`)
    }
    const items = labelArr.map((label, index) => {
      return {
        label,
        key: index,
      }
    })
    return (
      <Dropdown
        menu={{
          items,
          onClick,
        }}
        trigger={["click"]}
      >
        <Space
          onClick={() => {
            if (labelArr.length !== 0) return
            setIsModalOpen(true)
          }}
        >
          选择标签
        </Space>
      </Dropdown>
    )
  }

  return (
    <Collapse
      accordion
      ghost
      expandIconPosition="end"
      onChange={([type]) => {
        console.log(`collapse changed`, type)
      }}
      className="right-container"
      defaultActiveKey={"rect"}
    >
      {LabelTypes.map(({ id, type, label }) => {
        return (
          <Panel header={label} key={type}>
            {labelObj[type].length === 0 ? (
              "当前类型还没有标注框"
            ) : (
              <LabelList />
            )}
            {/* {rectArray.length === 0 ? (
              // "当前类型还没有标注框"
              rectArray.length
            ) : (
              <LabelList key={rectArray.length} />
            )} */}
          </Panel>
        )
      })}
    </Collapse>
  )
}
