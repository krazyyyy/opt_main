import React from 'react'

const Tagline = ({title,classes}) => {
  return (
    <span className={`colus inline-block tracking-[10.5px] mb-[2px] text-[10px] leading-[12px] md:text-[1.1480859375vw]  md:leading-[1.40625vw] md:tracking-[1.20703125vw] ${classes}`}>
            {title}
    </span>
  )
}

export default Tagline