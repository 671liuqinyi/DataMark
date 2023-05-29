/**
 * 任务选择界面
 * 选择当前要做的是那种数据标注任务（ 图像/实例分割 | 目标检测 | 图像分类 ）
 */
import { Modal, Button, Card, message } from "antd"
import Classification from "../../assets/classification.png"
import Detection from "../../assets/detection.png"
import Segmentation from "../../assets/segmentation.png"
import "./index.scss"

const DetectionCard = ({ title, imageSrc, onClick, isSelected }) => {
  return (
    <Card
      cover={<img alt={title} src={imageSrc} />}
      hoverable
      onClick={onClick}
      className={`modal-card ${isSelected ? "card-selected" : ""}`}
    >
      <Card.Meta title={title} />
    </Card>
  )
}
const TaskModal = ({ visible, setVisible, labelType, setLabelType }) => {
  // console.log(`labelType`, labelType)
  const onCancel = () => {
    setVisible(false)
  }
  const onDetect = () => {
    if (labelType === "rect") return
    setLabelType("rect")
    message.success("您当前选中的是目标检测任务！")
  }
  const onSegment = () => {
    if (labelType === "polygon") return
    setLabelType("polygon")
    message.success("您当前选中的是图像/实例分割任务！")
  }
  const onClassify = () => {
    if (labelType === "classification") return
    setLabelType("classification")
    message.success("您当前选中的是图像分类任务！")
  }
  return (
    <Modal
      centered
      open={visible}
      title="请选择任务类型"
      onCancel={onCancel}
      footer={[
        <Button key="ok" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <div className="modal-container">
        <DetectionCard
          title="图像分类"
          imageSrc={Classification}
          onClick={onClassify}
          isSelected={labelType === "classification"}
        />
        <DetectionCard
          title="目标检测"
          imageSrc={Detection}
          onClick={onDetect}
          isSelected={labelType === "rect"}
        />
        {/* <DetectionCard
          title="图像/实例分割"
          imageSrc={Segmentation}
          onClick={onSegment}
          isSelected={labelType === "polygon"}
        /> */}
      </div>
    </Modal>
  )
}
export default TaskModal
