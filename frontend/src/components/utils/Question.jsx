import React from 'react'
import chevron from '../../assets/images/icons/chevron.svg'

const Question = ({handleClick,question}) => {
  return (
    <a onClick={handleClick} className="up flex items-center justify-between md:pt-[2.734375vw] py-[32px] pr-[33.5px] pl-[32px] md:pb-[2.5vw] md:px-[2.5vw] cursor-pointer">
    <span className="text-[24px] leading-[29px] w-[222px] md:w-[unset] md:text-[1.875vw] text-[#F5F5F5] font-[700] font-[poppins] md:leading-[2.25vw]">
      {question}
    </span>
    <img src={chevron} alt="chevron" className="chevron w-[29px] h-[17px] md:w-[2.265625vw] md:h-[1.328125vw] transform rotate-[0deg] transition-all duration-500" />
  </a>
  )
}

export default Question
