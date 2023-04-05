import { useState } from "react"
import { Modal, Button } from "antd"
import Demo from "./components/Demo"
import Dashboard from "./views/Dashboard"
import "antd/dist/reset.css"
import "./App.scss"

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleOk = () => {
    setIsModalOpen(false)
  }
  return (
    <div className="App">
      {/* 公告 */}
      <Modal
        title="版本公告: v1.0"
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
        <p>1.Some contents...</p>
        <p>2.Some contents...</p>
        <p>3.Some contents...</p>
        <p>3.Some contents...</p>
        <p>3.Some contents...</p>
        <p>3.Some contents...</p>
      </Modal>
      <Dashboard />
    </div>
  )
}

export default App
