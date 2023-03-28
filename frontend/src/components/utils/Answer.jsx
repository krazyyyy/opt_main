import React from 'react'

const Answer = ({answer}) => {
  return (
    <div className="down main max-h-[0] md:px-[2.65625vw]  
    rounded-[24px]  py-[0]  transition-all duration-500 overflow-hidden
    ">
            <p className="text-[18px] leading-[24.3px] md:text-[1.40625vw] text-[#ADADAD] font-[400] md:leading-[1.8984375vw] font-[poppins]   tracking-[0.3px]  md:tracking-[0.028125vw]" dangerouslySetInnerHTML={{__html : answer}}></p>
          </div>
  )
}

export default Answer
