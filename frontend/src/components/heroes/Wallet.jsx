import React from 'react'
import HomeHeading from '../utils/HomeHeading'
import HomeLink from '../utils/HomeLink'
import HomePara from '../utils/HomePara'
import wallet from '../../assets/images/home/wallet.svg'
import mobwallet from '../../assets/images/home/mobwallet.svg'


const Wallet = () => {
  return (
    <div className="relative">
    <div className='w-[79.93%] mx-[auto] md:mx-[unset] md:w-[35vw] top-[16vw] right-[8.28125vw] md:absolute text-center flex flex-col items-center gap-y-[16px] md:gap-y-[1.25vw]'>
                <HomeHeading title={"How are prizes distributed?"}/>
                <HomePara classes={"z-50 text-[#ADADAD] md:w-[29.13515625vw] "} title={"Prizes are awarded in OPT and distributed automatically to the winning wallet address. These winners are posted to a public list, accessible through the web-based application."}/>
    </div>
    <div className=' relative top-[-35vw] h-[1108px] md:h-[unset]'>
        <img src={wallet} alt="Wallet"  className='w-[85vw] hidden md:block'/>
        <img src={mobwallet} alt="Wallet"  className='block md:hidden
        w-[100%]  object-cover h-[1108px] absolute top-[-13%]
        '/>
    </div>
</div>
  )
}

export default Wallet