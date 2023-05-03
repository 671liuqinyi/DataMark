/**
 * 顶部菜单
 */
import { useState, useRef } from "react"
import { MenuOutlined } from "@ant-design/icons"
import { Dropdown, Space, message } from "antd"
import TaskModal from "./taskModal"
import EditLabel from "../EditLabel"
import { formatDate } from "../../utils"

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
        label: "导入已有数据",
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "管理",
    children: [
      {
        key: "2-2",
        label: "选择任务类型",
      },
      {
        key: "2-1",
        label: "标签管理",
      },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "智能化",
    children: [
      {
        key: "3-1",
        label: "AI辅助标注",
      },
    ],
  },
  {
    key: "4",
    type: "group",
    label: "导出数据",
    children: [
      {
        key: "4-1",
        label: "json格式",
      },
      {
        key: "4-2",
        label: "标注数据保存",
      },
    ],
  },
]
const Menu = (props) => {
  const {
    isModalOpen,
    globalData,
    labelArr,
    scaleObj,
    imgList,
    projName,
    setIsModalOpen,
    setSelected,
    setImgList,
    labelType,
    setGlobalData,
    setLabelArr,
    setLabelType,
  } = props
  // 文件上传框
  const fileRef = useRef()
  // ai标注modal是否显示
  const [isAIAssist, setIsAIAssist] = useState(false)
  // 任务类型选择框是否显示
  const [isTaskSelectModalOpen, setIsTaskSelectModalOpen] = useState(false)
  // 加载图片
  const loadImages = async () => {
    fileRef.current.click()
    fileRef.current.onchange = () => {
      let files = Array.from(fileRef.current.files)
      // 过滤数组中已经存在的图片
      const img_id_list = imgList.map((img) => img.name)
      console.log(`img_id_list`, img_id_list, files)
      files = files.filter((file) => !img_id_list.includes(file.name))
      // 转换图片格式，同时生成url
      const newImgList = files.map((file) => {
        const url = URL.createObjectURL(file)
        return {
          id: file.name,
          origin: file,
          url,
          name: file.name,
          // 每张图片的label信息
          labelObj: {
            rect: [],
            polygon: [],
            classification: [],
            // line: [],
          },
        }
      })
      console.log(`newImgList`, newImgList)
      if (newImgList.length === 0) return
      const concatImgList = [...imgList, ...newImgList]
      setImgList(concatImgList)
      // 收集图像名称列表，用于导出json
      // const new_img_id_list = files.map((file) => file.name)
      // setGlobalData((prevValue) => ({
      //   ...prevValue,
      //   img_id_list: [...prevValue.img_id_list, ...new_img_id_list],
      // }))
      // 默认选中第一个图片
      setSelected(concatImgList[0].id)
    }
  }

  // 导出下载数据
  const download = () => {
    console.log(`scaleObj`, scaleObj.current)
    const img_annotations = {}
    imgList.forEach((img) => {
      let temp = {}
      temp.filename = img.name
      temp.regions = img.labelObj["rect"].map((rect) => {
        return {
          shape_attributes: {
            name: "rect",
            x: Math.round(rect.startX * scaleObj.current[img.id].x),
            y: Math.round(rect.startY * scaleObj.current[img.id].y),
            width: Math.round(
              (rect.endX - rect.startX) * scaleObj.current[img.id].x
            ),
            height: Math.round(
              (rect.endY - rect.startY) * scaleObj.current[img.id].y
            ),
          },
          region_attributes: {
            type: rect.label,
          },
        }
      })
      img_annotations[img.name] = temp
    })
    console.log(`img_annotations`, img_annotations)
    // return
    // 生成要下载的 JSON 数据
    const jsonData = JSON.stringify(img_annotations)

    // 创建 Blob 对象，并指定 MIME 类型为 application/json
    const blob = new Blob([jsonData], { type: "application/json" })

    // 创建 URL 对象，并将 Blob 对象引用赋值给它
    const url = URL.createObjectURL(blob)

    // 创建一个链接元素并设置其属性
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${projName}-v${globalData.version}-${formatDate(Date.now())}.json`
    )

    // 将链接元素添加到文档中，并模拟点击它以触发下载
    document.body.appendChild(link)
    link.click()

    // 清理对象 URL
    URL.revokeObjectURL(url)
  }

  // AI辅助标注
  const startAIAssist = () => {
    console.log(`imgList`, imgList)
    if (imgList.length === 0) {
      message.warning("请先导入图片！")
      return
    }
    setIsAIAssist(true)
    setIsModalOpen(true)
  }

  // 保存数据
  const save = () => {}
  // 处理菜单点击事件
  const onClick = ({ key }) => {
    // key的含义见items配置
    switch (key) {
      //导入图片
      case "1-1":
        loadImages()
        break
      // 编辑标签
      case "2-1":
        setIsModalOpen(true)
        break
      // 打开任务选择弹窗，选择任务类别
      case "2-2":
        setIsTaskSelectModalOpen(true)
        break
      // AI辅助标注
      case "3-1":
        startAIAssist()
        break
      // 导出json格式
      case "4-1":
        download()
        break
      default:
        message.warning("功能开发中")
        break
    }
  }
  const handleOk = () => {}
  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <Space>
          <MenuOutlined />
          菜单
        </Space>
      </Dropdown>
      {/* 隐藏的上传标签 */}
      <input
        type="file"
        ref={fileRef}
        multiple
        hidden
        // webkitdirectory="true"
        // directory="true"
        // accept=".jpg,.jpeg,.png,.gif"
      />
      {/* 添加标签 */}
      <EditLabel
        isModalOpen={isModalOpen}
        labelArr={labelArr}
        setIsModalOpen={setIsModalOpen}
        setLabelArr={setLabelArr}
        isAIAssist={isAIAssist}
        imgList={imgList}
      />
      {/* 选择标注任务类别 */}
      <TaskModal
        visible={isTaskSelectModalOpen}
        setVisible={setIsTaskSelectModalOpen}
        labelType={labelType}
        setLabelType={setLabelType}
      />
    </>
  )
}

export default Menu
