import React from 'react'

const Paragraph = ({classes,children}) => {
  return (
    <p className={`${classes} text-[16px] md:text-[1.25vw] tracking-[0.2px] leading-[21px] md:leading-[1.625vw]`}>
        {children}
    </p>
  )
}

export default Paragraph