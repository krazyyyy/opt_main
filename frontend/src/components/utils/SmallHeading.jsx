import React from 'react'

const SmallHeading = ({classes,title}) => {
  return (
    <h5 className={`text-white  text-[22px] leading-[29.7px]   md:text-[1.71875vw] md:leading-[2.3203125vw] font-[700] ${classes}`}> 
    {title}
    </h5>
  )
}

export default SmallHeading
