/**
 * 右侧label列表
 */
import React, { useState } from "react"
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
    imgList,
    selected,
    labelType,
    labelArr,
    labelToColor,
    setImgList,
    changeLabelType,
    setIsModalOpen,
    setSyncLabel,
  } = props
  // 标签四种类型对应数组
  const labelObj = imgList[selected]?.labelObj || {
    rect: [],
    polygon: [],
    point: [],
    line: [],
  }

  console.log(`labelObj`, labelObj)

  const listData = labelObj[labelType].map((type) => {
    return {
      type,
    }
  })

  // 删除标注框
  const handleDelete = (item, index) => {
    const newLabelList = imgList[selected].labelObj[labelType].filter(
      (_, idx) => index !== idx
    )
    setImgList((imgList) => {
      imgList[selected].labelObj[labelType] = newLabelList
      return [...imgList]
    })
    // 删除标签后同步两个标注框数组
    setSyncLabel((pre) => pre + 1)
  }
  // 标注框列表
  const LabelList = () => (
    <List
      itemLayout="horizontal"
      dataSource={listData}
      renderItem={(item, index) => {
        const label = imgList[selected].labelObj[labelType][index].label
        // console.log(`RGB`, label, label ? COLORS[index] : "rgb(255, 255, 255)")
        return (
          <List.Item>
            <div className="label-box">
              <div
                className="color-select"
                style={{
                  backgroundColor: `${
                    label ? labelToColor[label] : "rgb(255, 255, 255)"
                  }`,
                }}
              ></div>
              {/* 标注框内的标签选择列表 */}
              <div className="label-select">
                <LabelSelect index={index} label={label} />
              </div>
              <div
                className="delete-icon"
                onClick={() => {
                  handleDelete(item, index)
                }}
              >
                <img src={DeleteIcon} alt="delete" />
              </div>
            </div>
          </List.Item>
        )
      }}
    />
  )

  const LabelSelect = ({ label, index }) => {
    const onClick = ({ key }) => {
      setImgList((imgList) => {
        imgList[selected].labelObj[labelType][index].label = labelArr[key]
        return [...imgList]
      })
      // 修改标签后同步两个标注框数组
      setSyncLabel((pre) => pre + 1)
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
          {!label ? "选择标签" : label}
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
        if (type !== "rect") {
          message.warning(`功能开发ing！`)
        }
        // changeLabelType()
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
          </Panel>
        )
      })}
    </Collapse>
  )
}
