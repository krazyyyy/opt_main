import React from 'react'

const Tab = ({title,value,rightTab,myTab}) => {
  return (
    <div className={`w-[320px] h-[124px] rounded-[24px] md:w-[25vw] md:h-[9.6875vw]   ${ myTab?" myTab2 ":" myTab "} md:rounded-[2.12vw] flex flex-col justify-center items-center ${rightTab && "rightTab"}`}>
    {myTab?
    <>
    <div className="myOverlay2">
        
        </div>
   <div className='myTabOverlays'>
    <div className="overlay2"></div>
    <div className="overlay1"></div>
    </div>
    </>
    :
      <>
      <span className='tabOverlay1'></span>
    <span className='tabOverlay2'></span>
      </>
    }
        <span className='colus text-[20px] leading-[24px] md:text-[1.5625vw] md:leading-[1.875vw] text-[#EDDB0F] z-[2]'>
            {title}
        </span>
        <span className='colus text-[30.93px] leading-[37.11px]  md:text-[2.41640625vw] md:leading-[2.89921875vw] mt-[0.41953125vw] z-[2]'>
        {value}
        </span>
    </div>
  )
}

export default Tab