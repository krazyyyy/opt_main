import React from 'react'
import { Link } from 'react-router-dom'
import footerPattern from '../../assets/images/footerPattern.svg'

const Footer = () => {
  return (
    <footer className=' absolute bottom-0 left-0 z-[15] w-full h-[97px] md:h-[4.0625vw]  flex md:items-center border-t  border-[#2B3D3E]'>
       <div className='md:w-[94vw] w-full mx-auto relative z-[5] flex flex-col-reverse md:flex-row justify-between md:justify-start md:items-center'>
         <span className='hidden md:block text-[#485E5F] font-[700] text-[1.09375vw] leading-[1.640625vw] tracking-[0.07109375vw]'>2023</span>
        <img src={footerPattern} alt="Footer Pattern" className='w-full h-[16px] object-cover  md:h-[unset] md:ml-[1.9203125vw] md:w-[53.6015625vw]' />
        <ul className='ml-auto mt-[14px] md:mt-0 flex justify-center items-center gap-y-[8px]  w-full md:w-[unset] gap-x-[27px] flex-wrap  md:gap-x-[2.109375vw] '>
       <li>
        <Link to={'/privacy'} className='text-[#718787] md:text-[1.09375vw] md:leading-[1.640625vw] text-[14px] leading-[21px]   md:tracking-[0.07109375vw]'>
        Privacy Policy
        </Link>
        </li>
       <li>
        <Link to={'/toc'} className='text-[#718787] md:text-[1.09375vw] md:leading-[1.640625vw] text-[14px] leading-[21px]   md:tracking-[0.07109375vw]'>
        Terms and Conditions
        </Link>
        </li>
       <li className='w-full md:w-auto text-center' >
        <Link onClick={() =>
                        window.open('https://www.certik.com/projects/optimum')
                    } className='text-[#718787]  font-[700] md:text-[1.09375vw] md:leading-[1.640625vw] text-[14px] leading-[21px]   md:tracking-[0.07109375vw]'>
        Certik Audit
        </Link>
        </li>
        </ul>
       </div>
    </footer>
  )
}

export default Footer