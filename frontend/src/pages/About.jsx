import React from 'react'

// import HomeHeading from '../components/utils/HomeHeading'
// import HomePara from '../components/utils/HomePara'
// import HomeLink from '../components/utils/HomeLink'
import Hero from '../components/home/Hero'
import PrizeMoney from '../components/heroes/PrizeMoney'
import InfoGraphic from '../components/heroes/InfoGraphic'
import Score from '../components/heroes/Score'
import Table from '../components/heroes/Table'
import Wallet from '../components/heroes/Wallet'
import Ring from '../components/heroes/Ring'
import Faqs from '../components/heroes/Faqs'



const About = () => {
  
  return (
    <>
    <div className='bg-[#11031A] overflow-hidden'>
 
   <Hero />
    
   <PrizeMoney />
 
    <section className='bg-[#11031A]  md:py-[4vw] relative z-[16]'>
<InfoGraphic />
  
<Score />

<Table />
<Wallet />
<Ring/>

<Faqs />
 


    </section> 
      

    </div>
 
</>

  )
}

export default About