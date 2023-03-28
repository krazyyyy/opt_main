import React from 'react'
import HomeHeading from '../utils/HomeHeading'
import HomeLink from '../utils/HomeLink'
import HomePara from '../utils/HomePara'
import weeklyPrize from '../../assets/images/home/weeklyPrize.svg'
import weeklyoverlay from '../../assets/images/home/weeklyoverlay.svg'
import weeklyarow from '../../assets/images/home/weeklyarrow.svg'
import weeklyleftcoin from '../../assets/images/home/weeklyleftcoin.svg'
import weeklyrightcoin from '../../assets/images/home/weeklyrightcoin.svg'




const Ring = () => {
  return (
    <div className="md:relative mt-[-470px] mb-[255.71px] md:mb-[0px]  md:mt-[0px] top-[-35vw]">
    <div className='w-[79.93%]  mx-[auto] md:w-[40.9375vw] z-[5] left-[7.1875vw] md:absolute text-center flex flex-col items-center gap-y-[16px] md:gap-y-[1.25vw]'>
        <HomeHeading  classes={"md:w-[35vw]"} title={"Do I have to enter for each weekly prize?"}/>
        <HomePara classes={" text-[#ADADAD] "} title={"Deposits are automatically eligible for weekly prizes until withdrawn. As described in Terms and Conditions, mail in submissions can also be made within the first two weeks of a Governance period. Individuals submitting a mail-in entry will be treated as if depositing 10 ALGO."}/>
    </div>
    <div className=" md:absolute mb-[560px] md:mb-[0px] right-0 top-[-29vw]">
        <img src={weeklyPrize} alt="Weekly Prize" className='w-[69.375vw]   md:block hidden'/>
        <div className='block md:hidden relative h-[184.77px]'>
       <img src={weeklyoverlay} alt=""  className='absolute w-[100%] object-cover top-[-100%]  left-0'/>
       <img src={weeklyarow} alt="" className='absolute top-[80%]
       left-[50%] transform translate-x-[-50%] translate-y-[-20%] z-[2]
        '/>
       <img src={weeklyleftcoin} alt="" className='absolute left-0 top-[40%]
transform
translate-y-[22%] z-[3]'/>
       <img src={weeklyrightcoin} alt="" className='absolute right-0 top-[35%]'/>

        </div>
    </div>
</div>
  )
}

export default Ring