import React from 'react'
import HomeHeading from '../utils/HomeHeading'
import HomeLink from '../utils/HomeLink'
import HomePara from '../utils/HomePara'

const PrizeMoney = () => {
  return (
    <section className='bg-[#11031A] relative pt-[53.6px] pb-[32px] md:py-[5.3125vw]'>
    <div className='w-[79.93%] gap-y-[16px] md:w-[87.5vw] flex-col items-center md:items-start md:flex-row mx-auto flex justify-between' >
  
    <HomeHeading title={"Where does the prize money come from?"} classes={" text-white md:w-[32.65625vw] w-[unset] "}/>
    <div> 
         <HomePara classes={'text-[#ADADAD] mb-[16px] md:mb-[1.25vw] md:w-[50vw] w-[unset] '} title={"The Optimum app generates prizes from interest accrued on deposited funds by utilizing non-custodial Governance accounts, with automated voting and registration in line with Algorand Foundation recommendations. The majority of rewards goes to the prize pool, with a smaller portion distributed evenly among all Optimum participants."}/> 
            <button className='text-[#EDDB0F] text-[18px] md:text-[1.40625vw] font-[700]'>Learn More</button>
        </div> 
    </div>
</section>
  )
}

export default PrizeMoney