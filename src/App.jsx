import { useState } from "react"
import { Modal, Button } from "antd"
import Demo from "./components/Demo"
import Dashboard from "./views/Dashboard"
import "antd/dist/reset.css"
import "./App.scss"

function App() {
  // 公告是否展示
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleOk = () => {
    setIsModalOpen(false)
  }
  return (
    <div className="App">
      {/* 公告 */}
      <Modal
        title="版本公告: v1.1"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        footer={
          <Button type="primary" onClick={handleOk}>
            我知道了
          </Button>
        }
        keyboard
        centered
      >
        <div>
          <strong>当前功能：</strong>
        </div>
        <p>1. 支持上传图片、标注、导出</p>
        <div>
          <strong>系统使用方法：</strong>
        </div>
        <p>
          1. 左上角 [ <strong>菜单</strong> ] 中选择 <strong>导入图片</strong>
          <br />
          2. 左上角 [ <strong>菜单</strong> ] 点击 <strong>标签管理</strong>
          选择添加标注种类
          <br />
          3. 左上角 [ <strong>菜单</strong> ] 点击导出 <strong>json格式</strong>
        </p>
        {/* <div>
          <strong>更新预告：</strong>
        </div>
        <p>1. 解决已有bug</p>
        <p>2. 标注框自由缩放</p>
        <p>3. 导入已有配置文件</p> */}
      </Modal>
      <Dashboard />
    </div>
  )
}

export default App
