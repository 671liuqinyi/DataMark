/**
 * 图片列表
 */
import React from "react"
import OKIcon from "../../assets/ok.png"
import "./index.scss"

export default function ImgList(props) {
  const { imgList, selected, changeSelectedImg } = props
  // 判断当前图片是否存在标注框
  const isLabeled = (img) => {
    let labelArr = Object.values(img.labelObj)
    let sum = labelArr.reduce((pre, cur) => pre + cur.length, 0)
    return sum > 0
  }
  return (
    <div className="left-container">
      {imgList.length === 0 ? (
        <div className="tip">请先通过菜单栏导入图片</div>
      ) : (
        imgList.map((img, index) => {
          return (
            <div
              className={`pic-item`}
              key={img.id}
              onClick={() => {
                changeSelectedImg(img.id)
              }}
            >
              <img
                className={selected === img.id ? "selected-img" : "plain-img"}
                src={img.url}
                alt="图片加载失败"
              />
              {isLabeled(img) && (
                <img src={OKIcon} className={"labeled"} alt="labeled" />
              )}
              <div className="sequence-number">
                {index + 1}/{imgList.length}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
