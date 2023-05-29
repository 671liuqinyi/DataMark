import { useState } from "react"
import PlusIcon from "../../assets/plus.png"

const CheckTag = (props) => {
  const { labelArr, imgList, setImgList, selected, selectedImg } = props
  const handleChange = (label) => {
    // console.log(`label`, label)
    // console.log(`imgList`, imgList)
    // console.log(`selected`, selected)
    setImgList((imgList) => {
      imgList.forEach((item) => {
        if (item.id === selected) {
          const selectedLabelsList = item.labelObj.classification
          if (selectedLabelsList.includes(label)) {
            item.labelObj.classification = selectedLabelsList.filter(
              (item) => item !== label
            )
          } else {
            item.labelObj.classification.push(label)
          }
        }
      })
      return [...imgList]
    })
  }

  return (
    <div className="tagLabelsListContent">
      {labelArr.map((label) => {
        return (
          <div
            className={`tagItem ${
              selectedImg.labelObj.classification.includes(label)
                ? "active"
                : ""
            }`}
            key={label}
            onClick={() => {
              handleChange(label)
            }}
          >
            {label}
          </div>
        )
      })}
      {/* <div className="ImageButton" onClick={addTags}>
        <img src={PlusIcon} alt="plus" />
      </div> */}
    </div>
  )
}
export default CheckTag
