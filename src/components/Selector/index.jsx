import { MenuOutlined } from "@ant-design/icons"
import { Dropdown, Space } from "antd"
const items = [
  {
    key: "1",
    type: "group",
    label: "导入",
    children: [
      {
        key: "1-1",
        label: "导入图片",
      },
      {
        key: "1-2",
        label: "导入标签",
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "导出数据",
    children: [
      {
        key: "2-1",
        label: "json格式",
      },
      {
        key: "2-2",
        label: "其他格式",
      },
    ],
  },
]
const Selector = () => (
  <Dropdown
    menu={{
      items,
    }}
  >
    <Space>
      <MenuOutlined />
      菜单
    </Space>
  </Dropdown>
)
export default Selector
