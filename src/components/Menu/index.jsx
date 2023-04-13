/**
 * 顶部菜单
 */
import { useState, useRef } from "react"
import { MenuOutlined } from "@ant-design/icons"
import { Dropdown, Space, message } from "antd"
import EditLabel from "../EditLabel"

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
        label: "导入模型",
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "管理",
    children: [
      {
        key: "2-1",
        label: "标签管理",
      },
      // {
      //   key: "2-2",
      //   label: "其他格式",
      // },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "导出数据",
    children: [
      {
        key: "3-1",
        label: "json格式",
      },
      {
        key: "3-2",
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
    scaleArr,
    imgList,
    setIsModalOpen,
    setSelected,
    setImgList,
    setGlobalData,
    setLabelArr,
  } = props
  // 文件上传框
  const fileRef = useRef()

  // 加载图片
  const loadImages = async () => {
    fileRef.current.click()
    fileRef.current.onchange = () => {
      const files = Array.from(fileRef.current.files)
      // 转换图片格式，同时生成url
      const imgList = files.map((file, index) => {
        // console.log(`file`, file)
        const url = URL.createObjectURL(file)
        return {
          id: index,
          origin: file,
          url,
          name: file.name,
          // 每张图片的label信息
          labelObj: {
            rect: [],
            polygon: [],
            point: [],
            line: [],
          },
        }
      })
      console.log(`imgList`, imgList)

      setImgList(imgList)

      // 收集图像名称列表，用于导出json
      const img_id_list = files.map((file) => file.name)
      setGlobalData((prevValue) => ({ ...prevValue, img_id_list }))
      // 默认选中第一个图片
      setSelected(0)
    }
  }

  // 导出下载数据
  const download = () => {
    // console.log(`scaleArr`, scaleArr.current)
    const img_annotations = {}
    imgList.forEach((img, index) => {
      let temp = {}
      temp.filename = img.name
      temp.regions = img.labelObj["rect"].map((rect) => {
        return {
          shape_attributes: {
            name: "rect",
            x: Math.round(rect.startX * scaleArr.current[index].x),
            y: Math.round(rect.startY * scaleArr.current[index].y),
            width: Math.round(
              (rect.endX - rect.startX) * scaleArr.current[index].x
            ),
            height: Math.round(
              (rect.endY - rect.startY) * scaleArr.current[index].y
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
    link.setAttribute("download", `测试-${globalData.version}.json`)

    // 将链接元素添加到文档中，并模拟点击它以触发下载
    document.body.appendChild(link)
    link.click()

    // 清理对象 URL
    URL.revokeObjectURL(url)
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
      // 导出json格式
      case "3-1":
        download()
        break
      default:
        message.warning("功能开发中")
        break
    }
  }
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
      <input type="file" ref={fileRef} multiple hidden />
      <EditLabel
        isModalOpen={isModalOpen}
        labelArr={labelArr}
        setIsModalOpen={setIsModalOpen}
        setLabelArr={setLabelArr}
      />
    </>
  )
}

export default Menu
