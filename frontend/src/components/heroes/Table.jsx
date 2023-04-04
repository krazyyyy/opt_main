import React from 'react'
import HomeHeading from '../utils/HomeHeading'
import HomeLink from '../utils/HomeLink'
import HomePara from '../utils/HomePara'

const Table = () => {
  return (
    <div className="relative md:py-[9vw]">
    <div className='w-[79.93%] md:w-[35vw] mx-[auto] top-[14.078125vw] left-[8.75vw] md:absolute text-center flex flex-col items-center gap-y-[24px] md:gap-y-[1.875vw]'>
                <HomeHeading title={"How is a winner selected?"}/>
                <HomePara classes={"z-50 text-[#ADADAD]  "} title={"At the time of prize drawing, a snapshot is secured of all current OPT holders and prize-eligible wallets. Utilizing this data, a cumulative probability distribution is generated. In conjunction a random number is generated and this is matched to the closest value within the probability range. "}/>
                <HomePara classes={"z-50 text-[#ADADAD]  "} title={"The following table illustrates our mechanism with an example of five wallets participating with ascending OPT balances of 10, 20, 30, 40, and 50:"}/>
                

                <button className='text-[#EDDB0F] text-[18px] md:text-[1.40625vw] font-[700]'>Learn More</button>
    </div>
    <div className='mt-[60.78px] md:mt-[0px] md:left-[50.9375vw] relative'>
        <div className="tableEllpse"></div>
    <ul className='w-[335.53px] mx-[auto] 
    md:mx-[unset] pb-[96.16px] md:pb-[0px]
    md:w-[42.8125vw] relative z-[2]'>
    <li className='border-[#00F2F8]w-[326.29px] md:w-[unset] justify-between justify-[unset] pl-[0.625vw] items-center gap-x-[21.43px] md:gap-x-[2.734375vw] border-t border-b py-[14px] md:py-[1.7578125vw] flex text-[#00F2F8] colus text-[9.56px] leading-[11.47px] md:text-[1.219515625vw] md:leading-[1.484375vw]'>
        <span className='w-[unset] md:w-[3.28125vw]'>User</span> 
        <span className='w-[unset] md:w-[9.346875vw]'>holding (opt)</span>
        <span  className='w-[unset] md:w-[8.075vw]'>probability</span>
        <span className='w-[unset] md:w-[12.890625vw]'>cumulative prob-y</span>
    </li>
    <li className='border-[#718787] py-[12px] pl-[0.625vw] gap-x-[48.05px] md:gap-x-[2.734375vw] items-center  border-b md:py-[1.7578125vw] flex text-[#fff]  md:text-[1.40625vw] text-[19px] leading-[25.65px] md:leading-[1.875vw]'>
        <span className='w-[25.43px] h-[25.43px] md:w-[3.28125vw] flex justify-center items-center text-[9.53px] leading-[12.87px] md:text-[1.216640625vw] md:leading-[1.640625vw] text-[#00F2F8] rounded-full border-[0.865169px] border-[#718787] md:h-[3.28125vw]'>1</span> 
        <span className='w-[25px] md:w-[9.346875vw] text-center'>10</span>
        <span  className='w-[49px] md:w-[8.075vw] text-center'>6.7%</span>
        <span className='w-[55px] md:w-[12.890625vw] text-center'>0%</span>
    </li>
    <li className='border-[#718787] py-[12px] pl-[0.625vw] gap-x-[48.05px] md:gap-x-[2.734375vw] items-center  border-b md:py-[1.7578125vw] flex text-[#fff]  md:text-[1.40625vw] text-[19px] leading-[25.65px] md:leading-[1.875vw]'>
        <span className='w-[25.43px] h-[25.43px] md:w-[3.28125vw] flex justify-center items-center text-[9.53px] leading-[12.87px] md:text-[1.216640625vw] md:leading-[1.640625vw] text-[#00F2F8] rounded-full border-[0.865169px] border-[#718787] md:h-[3.28125vw]'>2</span> 
        <span className='w-[25px] md:w-[9.346875vw] text-center'>20</span>
        <span  className='w-[49px] md:w-[8.075vw] text-center'>13.3%</span>
        <span className='w-[55px] md:w-[12.890625vw] text-center'>6.7%</span>
    </li>
    <li className='border-[#718787] py-[12px] pl-[0.625vw] gap-x-[48.05px] md:gap-x-[2.734375vw] items-center  border-b md:py-[1.7578125vw] flex text-[#fff]  md:text-[1.40625vw] text-[19px] leading-[25.65px] md:leading-[1.875vw]'>
        <span className='w-[25.43px] h-[25.43px] md:w-[3.28125vw] flex justify-center items-center text-[9.53px] leading-[12.87px] md:text-[1.216640625vw] md:leading-[1.640625vw] text-[#00F2F8] rounded-full border-[0.865169px] border-[#718787] md:h-[3.28125vw]'>3</span> 
        <span className='w-[25px] md:w-[9.346875vw] text-center'>30</span>
        <span  className='w-[49px] md:w-[8.075vw] text-center'>20%</span>
        <span className='w-[55px] md:w-[12.890625vw] text-center'>20%</span>
    </li>
    <li className='border-[#718787] py-[12px] pl-[0.625vw] gap-x-[48.05px] md:gap-x-[2.734375vw] items-center  border-b md:py-[1.7578125vw] flex text-[#fff]  md:text-[1.40625vw] text-[19px] leading-[25.65px] md:leading-[1.875vw]'>
        <span className='w-[25.43px] h-[25.43px] md:w-[3.28125vw] flex justify-center items-center text-[9.53px] leading-[12.87px] md:text-[1.216640625vw] md:leading-[1.640625vw] text-[#00F2F8] rounded-full border-[0.865169px] border-[#718787] md:h-[3.28125vw]'>4</span> 
        <span className='w-[25px] md:w-[9.346875vw] text-center'>40</span>
        <span  className='w-[49px] md:w-[8.075vw] text-center'>26.7%</span>
        <span className='w-[55px] md:w-[12.890625vw] text-center'>40%</span>
    </li>
    <li className='  py-[12px] pl-[0.625vw] gap-x-[48.05px] md:gap-x-[2.734375vw] items-center    md:py-[1.7578125vw] flex text-[#fff]  md:text-[1.40625vw] text-[19px] leading-[25.65px] md:leading-[1.875vw]'>
        <span className='w-[25.43px] h-[25.43px] md:w-[3.28125vw] flex justify-center items-center text-[9.53px] leading-[12.87px] md:text-[1.216640625vw] md:leading-[1.640625vw] text-[#00F2F8] rounded-full border-[0.865169px] border-[#718787] md:h-[3.28125vw]'>5</span> 
        <span className='w-[25px] md:w-[9.346875vw] text-center'>50</span>
        <span  className='w-[49px] md:w-[8.075vw] text-center'>33.3%</span>
        <span className='w-[55px] md:w-[12.890625vw] text-center'>66.7%</span>
    </li>
    <li className='tableBtn flex justify-between items-center px-[3.3984375vw]'>
    <span className="tableBtnOverlay"></span>
    <div className='tableBtnGradients'>
    <div className="tableBtnGradient1"></div>
    <div className="tableBtnGradient2"></div>
    
    </div>
    <div className='flex gap-x-[8.57px] md:gap-x-[1.09375vw] items-center relative z-[5]'>
        <span className='colus text-white text-[9.56px] leading-[11.47px] md:text-[1.219515625vw] md:leading-[1.484375vw]'>Random Number</span>
        <span className='text-[#EDDB0F] font-[700] md:text-[1.40625vw] text-[11.02px] leading-[14.88px] md:leading-[1.875vw]'>0.6147556</span>
    </div>
    <div className='flex gap-x-[8.57px] md:gap-x-[1.09375vw] items-center relative z-[5]'>
        <span className='colus text-white text-[9.56px] leading-[11.47px] md:text-[1.219515625vw] md:leading-[1.484375vw]'>Winner</span>
        <span className='text-[#EDDB0F] font-[700] md:text-[1.40625vw] text-[11.02px] leading-[14.88px] md:leading-[1.875vw]'>User 4</span>
    </div>
    </li>
    </ul>
    </div>
</div>
  )
}

export default Table