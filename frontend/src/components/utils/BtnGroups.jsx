import React from 'react'
import dottedBorder from '../../assets/images/sevices/dottedBorder.svg'
import CustomToolTip from '../../components/Tooltip';

const BtnGroups = ({props, classes,white, isDepositValid, ButtonTypes_DEPOSIT, ButtonTypes_WITHDRAW, openForm}) => {
  const openLoginModal =()=>{
     
    document.getElementById('loginModal').classList.add('active')
}
  console.log(`BTN Group:${props}`) 


  return (
    
  <div className={`w-full md:w-[27.8125vw]   relative h-[74px] md:h-[5.78125vw]  flex items-cetner justify-center gap-x-[60px] md:gap-x-[4.6875vw] ${classes}`}>

    <span className='w-[1px] h-[52px] md:h-[4.0625vw] absolute top-[12px] md:top-[0.9375vw] border-l-[1px] border-  dotted border-[#99939C]'></span>
    <img src={dottedBorder} alt="DottedBorder" className='w-full object-cover   absolute top-0 left-0'/>
    
    <img src={dottedBorder} alt="DottedBorder" className='w-full   object-cover absolute bottom-0 left-0'/>
    <div className='flex cursor-pointer items-center  gap-x-[20px] md:gap-x-[1.5625vw] '>
      <span className='md:w-[1.89375vw] md:h-[1.25vw] w-[24.24px] h-[16px] bg-[#FF005C] clipPath2 '></span>
      <span onClick={() =>
                                      openForm(ButtonTypes_DEPOSIT)
                                  } className={`font-[700] text-[18px] md:text-[1.40625vw] leading-[27px] md:leading-[2.109375vw] ${white &&" text-white"}`}>Desposit</span>
  
    </div>

    <div className='flex cursor-pointer items-center gap-x-[12px]  md:gap-x-[0.9375vw] '>
        <span className='md:w-[1.89375vw] md:h-[1.25vw] w-[24.24px] h-[16px] bg-[#EDDB0F] clipPath2 '></span>
        <span onClick={() => openForm(ButtonTypes_WITHDRAW)}
                         className={`font-[700] text-[18px] md:text-[1.40625vw] leading-[27px] md:leading-[2.109375vw] ${white &&" text-white"}`}>Withdraw</span>
    </div>
</div>
  )
}

export default BtnGroups