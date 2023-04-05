import React from "react"
import "./index.scss"

export default function ImgList(props) {
  const { imgList, selected, changeSelectedImg } = props
  return (
    <div className="left-container">
      {imgList.length === 0
        ? "请先通过菜单栏导入图片"
        : imgList.map((img) => {
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
                <div className="sequence-number">
                  {1}/{100}
                </div>
              </div>
            )
          })}
    </div>
  )
}
