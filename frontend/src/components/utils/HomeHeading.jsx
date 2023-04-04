import React from 'react'

const HomeHeading = ({classes,title}) => {
  return (
    <h2 className={`z-50 text-white colus text-[32px] leading-[38.5px]   md:text-[2.5vw] md:leading-[2.96875vw] ${classes}`}> 
    {title}
    </h2>
    )
}

export default HomeHeading