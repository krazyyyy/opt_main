import React from 'react'
import PopCloser  from "../../assets/images/popupclose.svg"

const PopUpCloser = () => {
  return (
    <div className='p-[11px] bg-[#000000] rounded-[50%] cursor-pointer'>
        <img src={PopCloser} alt="PopCloser" />
      </div>
  )
}

export default PopUpCloser
