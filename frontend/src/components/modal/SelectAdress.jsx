import React from 'react'
import PopUpCloser from '../utils/PopUpCloser'

const SelectAdress = () => {
  return (
    <div className='active popupclass w-[100%] h-[100vh] fixed top-0 left-0  justify-center items-center z-[20] flex opacity-[0] pointer-events-none'>
    <div className='w-[100%] h-[100%] absolute left-0 top-0  bg-[#11031A]  opacity-[0.8] '>
         
    </div>
   <div className='relative flex flex-col items-center 
     gap-y-[32px] md:gap-y-[2.5vw]'>
   <div className='select-adress flex flex-col w-[352px] md:w-[27.5vw] h-[199px] md:h-[15.546875vw] bg-[#2F193D] rounded-[24px] gap-y-[21.05px] md:gap-y-[1.64453125vw] relative overflow-hidden'>
   <div className= 'with-drawoverlays  absolute w-[775.41px] h-[712.56px] top-[-167.65px] left-[-237.56px] md:w-[60.57890625vw] md:h-[55.66875vw] md:top-[-13.09765625vw] md:left-[-18.559375vw]'>
     
     <span className='top-left'></span>
     <span className='bottom-e2 z-[1]'></span>
     
     <span className='bottom-e3 z-[2]'></span>
     </div>
    <div className='pt-[26.95px] md:pt-[2.10546875vw] text-center '>
        <h4 className='text-[20px] leading-[24px] md:leading-[1.875vw] md:text-[1.5625vw] text-[#FFFFFF] colus'>Select Address</h4>
    </div>
    <div className='flex justify-center  md:pb-[2.50390625vw] pb-[32px]   text-center'>
    <div>
    <span className='text-[12px] leading-[16px] md:text-[0.9375vw] md:leading-[1.25vw] text-[#FFFFFF] '>Address</span>
    <div className='mx-[auto] w-[191px] mt-[9px]  h-[70px] md:w-[14.921875vw]  md:h-[5.46875vw] bg-[#FF005C] rounded-[8px] flex items-center gap-x-[11px]     justify-center '>
    <span className='text-[16px] leading-[22px] md:leading-[1.71875vw] md:text-[1.25vw] text-[#FFFFFF] font-[400]'>412SdgfD2332...</span>

    </div>
    </div>
   <div>
   <span className='text-[12px] leading-[16px] md:text-[0.9375vw] md:leading-[1.25vw] text-[#FFFFFF] '>Amount</span>
   <div className='mx-[auto] w-[96px] mt-[9px] h-[70px] md:w-[7.5vw]  md:h-[5.46875vw] bg-[#EDDB0F] rounded-[8px] items-center justify-center
    flex
    '>
    <span className='text-[14px] leading-[19px] md:leading-[1.484375vw] md:text-[1.09375vw] text-[#15061E] font-[400]'>5.671</span>

    </div>
   </div>
   
    </div>
    
   </div>
    <PopUpCloser />
   </div>
      
    </div>
  )
}

export default SelectAdress
