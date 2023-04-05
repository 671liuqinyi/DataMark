import { useCallback, useEffect, useState } from "react"
import { Layout, Space } from "antd"
import Selector from "../../components/Selector"
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
  // 标注图片列表
  const [imgList, setImgList] = useState([
    {
      id: 1,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162ab10d004d48d08cc678617a43f942~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?",
    },
    {
      id: 2,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 3,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 4,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162ab10d004d48d08cc678617a43f942~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?",
    },
    {
      id: 5,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 6,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 7,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162ab10d004d48d08cc678617a43f942~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?",
    },
    {
      id: 8,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 9,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 10,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 11,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 12,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162ab10d004d48d08cc678617a43f942~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?",
    },
    {
      id: 13,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
    {
      id: 14,
      url: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2805d6ba9c4e4ae09f397846093c1988~tplv-k3u1fbpfcp-no-mark:480:400:0:0.awebp?",
    },
  ])
  // 被选中的图片
  const [selected, setSelected] = useState(-1)
  // 选中标注类型,默认画矩形框
  const [labelType, setLabelType] = useState("rect")
  // 标注框数组
  const [labelObj, setLabelObj] = useState({
    rect: [],
    polygon: [],
    point: [],
    line: [],
  })
  // 修改被选中的图片
  const changeSelectedImg = useCallback((id) => {
    setSelected(id)
  }, [])
  // 修改标注类型
  const changeLabelType = useCallback((type) => {
    setLabelType(type)
  }, [])

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
            <div className="logo">logo</div>
            <div className="menu">
              <Selector />
            </div>
            <div className="proj-name">项目名称: {projName}</div>
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
            <Editor />
          </Content>
          {/* 右侧标注框列表 */}
          <Sider width={siderWidth}>
            <LabelTypeLIst
              labelObj={labelObj}
              labelType={labelType}
              changeLabelType={changeLabelType}
            />
          </Sider>
        </Layout>
        {/* <Footer style={footerStyle}>Footer</Footer> */}
      </Layout>
    </Space>
  )
}
export default Dashboard
