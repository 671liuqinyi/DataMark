import React from "react"
import { Collapse } from "antd"
const { Panel } = Collapse
import "./index.scss"
const LabelTypes = [
  { id: 1, type: "rect", label: "矩形" },
  { id: 2, type: "polygon", label: "多边形" },
  { id: 3, type: "point", label: "其他类型" },
  { id: 4, type: "line", label: "其他类型" },
]
export default function LabelTypeLIst(props) {
  const { labelObj, labelType, changeLabelType } = props
  const { rect, polygon, point, line } = labelObj
  return (
    // <div className="right-container">
    <Collapse
      accordion
      ghost
      expandIconPosition="end"
      onChange={() => {
        console.log(`collapse changed`)
      }}
      className="right-container"
    >
      {LabelTypes.map(({ id, type, label }) => {
        return (
          <Panel header={label} key={type}>
            {labelObj[type].length === 0
              ? "当前类型还没有标注框"
              : labelObj[type].map((frame) => {
                  return <>我是一个标注框</>
                })}
          </Panel>
        )
      })}
    </Collapse>
    // </div>
  )
}
