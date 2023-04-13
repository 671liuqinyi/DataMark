import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Layout, Space, Input } from "antd"
import { COLORS } from "../../utils/constant"
import Menu from "../../components/Menu"
import ImgList from "../../components/ImgLIst"
import Editor from "../../components/Editor"
import LabelTypeLIst from "../../components/LabelTypeLIst"

import "./index.scss"

const { Header, Footer, Sider, Content } = Layout
const headerStyle = {
  // textAlign: "center",
  color: "#fff",
  height: 33,
  padding: "0",
  lineHeight: "33px",
  backgroundColor: "#171717",
}
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "calc(100vh - 33px)",
  color: "#fff",
  backgroundColor: "#4c4c4c",
}

const siderWidth = 308

const Dashboard = () => {
  // 项目名称
  const [projName, setProjName] = useState("xxx")
  // 项目名称输入框
  const [inputValue, setInputValue] = useState("")
  // 控制项目名称输入框是否可见
  const [inputVisible, setInputVisible] = useState(false)
  // 项目名称input框ref
  const inputRef = useRef()

  // 标注图片列表
  const [imgList, setImgList] = useState([])
  // 被选中的图片
  const [selected, setSelected] = useState(-1)
  // 选中标注类型,默认画矩形框
  const [labelType, setLabelType] = useState("rect")
  // 标注框label数组
  const [labelArr, setLabelArr] = useState([])
  // 标签和颜色对应关系
  const labelToColor = useMemo(() => {
    let obj = {}
    labelArr.forEach((label, index) => {
      obj[label] = COLORS[index]
    })
    return obj
  }, [labelArr])

  // 编辑标签框是否显示
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 导出全局json配置
  const [globalData, setGlobalData] = useState({
    settings: {
      projName,
    },
    // 标注框具体信息
    img_annotations: {},
    // 标注框类型信息
    img_attributes: {},
    img_id_list: [],
    version: "1.0",
  })

  // 同步两个标注框
  const [syncLabel, setSyncLabel] = useState(0)
  // 图片缩放比例数组
  const scaleArr = useRef([])

  // 修改被选中的图片
  const changeSelectedImg = useCallback((id) => {
    setSelected(id)
  }, [])
  // 修改标注类型
  const changeLabelType = useCallback((type) => {
    setLabelType(type)
  }, [])

  // 修改项目名称失去焦点
  const handleInputConfirm = () => {
    const value = inputValue.trim()
    if (value !== "") {
      setProjName(value)
    }
    setInputValue("")
    setInputVisible(false)
  }

  // 保证第一时间选中input框
  useEffect(() => {
    inputRef.current?.focus()
  }, [inputVisible])

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
      size={[0, 48]}
    >
      <Layout>
        <Header style={headerStyle}>
          <div className="header-container">
            <div className="logo">DataMark</div>
            <div className="menu">
              <Menu
                globalData={globalData}
                labelArr={labelArr}
                isModalOpen={isModalOpen}
                scaleArr={scaleArr}
                imgList={imgList}
                projName={projName}
                setIsModalOpen={setIsModalOpen}
                setSelected={setSelected}
                setImgList={setImgList}
                setGlobalData={setGlobalData}
                setLabelArr={setLabelArr}
              />
            </div>
            <div className="proj-name">
              <div
                onClick={() => {
                  setInputVisible(true)
                }}
              >
                项目名称:{" "}
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78, verticalAlign: "center" }}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                    }}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  // <div
                  //   onClick={() => {
                  //     setInputVisible(true)
                  //   }}
                  // >
                  projName
                  // {/* </div> */}
                )}
              </div>
            </div>
            <div className="user">user</div>
          </div>
        </Header>
        <Layout>
          {/* 左侧图片展示区 */}
          <Sider width={siderWidth}>
            <ImgList
              imgList={imgList}
              selected={selected}
              changeSelectedImg={changeSelectedImg}
            />
          </Sider>
          {/* 标注区 */}
          <Content style={contentStyle}>
            <Editor
              imgList={imgList}
              selected={selected}
              labelType={labelType}
              syncLabel={syncLabel}
              labelToColor={labelToColor}
              scaleArr={scaleArr}
              setSelected={setSelected}
              setImgList={setImgList}
              setSyncLabel={setSyncLabel}
            />
          </Content>
          {/* 右侧标注框列表 */}
          <Sider width={siderWidth}>
            <LabelTypeLIst
              imgList={imgList}
              selected={selected}
              labelType={labelType}
              labelArr={labelArr}
              labelToColor={labelToColor}
              setImgList={setImgList}
              changeLabelType={changeLabelType}
              setIsModalOpen={setIsModalOpen}
              setSyncLabel={setSyncLabel}
            />
          </Sider>
        </Layout>
        {/* <Footer style={footerStyle}>Footer</Footer> */}
      </Layout>
    </Space>
  )
}
export default Dashboard
