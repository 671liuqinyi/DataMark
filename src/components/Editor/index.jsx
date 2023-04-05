import React from "react"
import LeftArrow from "../../assets/left.png"
import RightArrow from "../../assets/right.png"
import ZoomIn from "../../assets/zoom-in.png"
import ZoomOut from "../../assets/zoom-out.png"
import { Tooltip } from "antd"

import "./index.scss"
export default function Editor(props) {
  return (
    <div className="editor">
      {/* 菜单 */}
      <div className="banner">
        <div className="menu-button">
          <Tooltip title={"缩小"}>
            <img src={ZoomOut} alt="zoom out" />
          </Tooltip>
        </div>
        <div className="menu-button">
          <Tooltip title={"放大"}>
            <img src={ZoomIn} alt="zoom in" />
          </Tooltip>
        </div>
      </div>
      {/* 画布 */}
      <div className="content">
        {/* todo:嵌入canvas */}
        <canvas>todo</canvas>
      </div>
      {/* 底部 */}
      <div className="footer">
        <div className="left-arrow">
          <Tooltip title={"上一张"}>
            <img src={LeftArrow} alt="previous" />
          </Tooltip>
        </div>
        <div className="cur-img-name ellipsis">
          <Tooltip title={"picnameaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}>
            picnameaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </Tooltip>
        </div>
        <div className="right-arrow">
          <Tooltip title={"下一张"}>
            <img src={RightArrow} alt="next" />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
