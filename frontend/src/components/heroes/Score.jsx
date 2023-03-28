import React from 'react'
import HomeHeading from '../utils/HomeHeading'
import HomeLink from '../utils/HomeLink'
import HomePara from '../utils/HomePara'
import historicalGovernanceFrame from '../../assets/images/home/historicalGovernanceFrame.svg'
import mobhistoricalGovernanceFrame from '../../assets/images/home/mobhistoricalGovernanceFrame.svg'
import coinLeft from '../../assets/images/home/coinLeft.png'
import mobleftcoin from '../../assets/images/home/mobleftcoin.svg'
import mobrightcoin from '../../assets/images/home/mobrightcoin.svg'
import ring from '../../assets/images/home/ring.png'
import coinRight from '../../assets/images/home/coinRight.png'

const Score = () => {
  return (
    <div className='relative pb-[190px] md:pb-[0px] top-[-10vw]'>
    <div className=' w-[79.93%] mx-[auto] md:w-[35vw] top-[29.6875vw] pt-[40px] md:pt-[unset]  md:right-[10.390625vw] md:absolute gap-y-[16px] text-center flex flex-col items-center md:gap-y-[1.25vw]'>
        <HomeHeading title={"What is the prize amount?"} />
        <HomePara classes={" text-[#ADADAD]  "} title={"The prize pool will be determined at the beginning of every week of a Governance quarter (13 weeks total). This will be determined by evaluating the current Governance period APR, which will be obtained from data posted on the Algorand Foundation Governance website."}/>
        <button className='text-[#EDDB0F] text-[18px] md:text-[1.40625vw] font-[700]'>Learn More</button>
    </div>
    <div className='mt-[68.7px] md:mt-[unset]'>
        <img src={historicalGovernanceFrame} alt="historicalGovernanceFrame" className='w-[59.84375vw] md:block hidden' />
        <div className='md:absolute md:w-[24.296875vw] left-[15.859375vw] top-[25.859375vw]  '>
            <span className="yellowEllipse2 hidden md:block">  </span>
            <span className="yellowEllipse hidden md:block">  </span>
            <img src={ring} alt="Ring" className='absolute min-w-[41.796875vw] mix-blend-lighten object-contain w-[41.796875vw] bottom-[-18.359375vw] left-[-10.15625vw] md:block hidden' />
            <img src={coinLeft} alt="Coin Left " className='absolute top-[-4.6875vw] left-[-11.015625vw] w-[17.3578125vw] object-contain h-[19.4703125vw] md:block hidden' />
            <img src={coinRight} alt="Coin Right" className='absolute right-[-10.9375vw] bottom-[-17.890625vw] w-[24.296875vw] object-contain h-[27.421875vw] md:block hidden' />
                <h5 className='colus w-[311.7px] mx-[auto]  md:w-[unset] text-[24.63px] leading-[29.56px] text-center  md:text-[1.9241953125vw] md:leading-[2.34375vw] text-[#EDDB0F]'>Historical Governance querterly yields</h5>
                <ul className='colus gap-y-[19.14px] mt-[42.5px]  md:mt-[3.515625vw] flex flex-col md:gap-y-[1.796875vw]
                relative
                '>
                           
                           <span className="yellowEllipse2 md:hidden block">  </span>
            <span className="yellowEllipse md:hidden block">  </span>

                <img src={mobhistoricalGovernanceFrame} alt="mobhistoricalGovernanceFrame" className='w-[314.32px]
                absolute bottom-[-45.24px] left-[50%]  transform translate-x-[-50%] block md:hidden
                h-[468.28px] object-cover' />
                 <img src={ring} alt="mobRing" className='absolute  mix-blend-lighten object-contain h-[335.5px] w-[100%]
                 bottom-[-232.72px]
                  ' />


<img src={mobleftcoin} alt="Coin Leftmob " className='absolute top-[-178px] left-[-72.66px] 
w-[249.18px] h-[220.22px] object-contain  block md:hidden' />
            <img src={mobrightcoin} alt="Coin Rightmob" className='absolute right-[-23.18px] bottom-[-200px] w-[230.99px] h-[300px] object-contain  block md:hidden' />

                   <li className='flex items-center gap-x-[79.51px] md:gap-x-[6.25vw] justify-center'><span className='md:leading-[2.109375vw] text-[#FF005C] text-[22.43px] leading-[26.92px] md:text-[1.752328125vw]'>Q1</span> <span className='text-[41.25px] leading-[49.5px] md:text-[3.22265625vw] text-[#fff] md:leading-[3.90625vw]'>3.51%</span></li> 
                   <li className='flex items-center gap-x-[79.51px] md:gap-x-[6.25vw] justify-center'><span className='md:leading-[2.109375vw] text-[#FF005C] text-[22.43px] leading-[26.92px] md:text-[1.752328125vw]'>Q2</span> <span className='text-[41.25px] leading-[49.5px] md:text-[3.22265625vw] text-[#fff] md:leading-[3.90625vw]'>2.51%</span></li> 
                   <li className='flex items-center gap-x-[79.51px] md:gap-x-[6.25vw] justify-center'><span className='md:leading-[2.109375vw] text-[#FF005C] text-[22.43px] leading-[26.92px] md:text-[1.752328125vw]'>Q3</span> <span className='text-[41.25px] leading-[49.5px] md:text-[3.22265625vw] text-[#fff] md:leading-[3.90625vw]'>1.91%</span></li> 
                   <li className='flex items-center gap-x-[79.51px] md:gap-x-[6.25vw] justify-center'><span className='md:leading-[2.109375vw] text-[#FF005C] text-[22.43px] leading-[26.92px] md:text-[1.752328125vw]'>Q4</span> <span className='text-[41.25px] leading-[49.5px] md:text-[3.22265625vw] text-[#fff] md:leading-[3.90625vw]'>1.93%</span></li> 
                </ul>
        </div>
    </div>
</div>
  )
}

export default Score