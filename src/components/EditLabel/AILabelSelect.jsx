/**
 * AI标注选择界面
 * 在页面中可以选择物体种类进行ai标注
 */
import { Checkbox, Divider } from "antd"
import { useState } from "react"
import { labelList } from "../../utils/constant"

const CheckboxGroup = Checkbox.Group
const plainOptions = labelList.map((item) => {
  return item.translation
})

const AILabelSelect = (props) => {
  const { checkedList, setCheckedList } = props
  // 未全选时的样式
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const onChange = (list) => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < plainOptions.length)
    setCheckAll(list.length === plainOptions.length)
    // console.log(`list`, list)
  }
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }
  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        全选
      </Checkbox>
      <Divider style={{ margin: "10px 0" }}></Divider>
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </>
  )
}
export default AILabelSelect
