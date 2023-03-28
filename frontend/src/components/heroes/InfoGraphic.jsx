import React from 'react'
import scheme from '../../assets/images/home/scheme.svg'
import schemeBg from '../../assets/images/home/schemeBg.svg'
import mobscheme from '../../assets/images/home/mobscheme.svg'
import mobschemeBg from '../../assets/images/home/mobschemabg.svg'

const InfoGraphic = () => {
  return (
    <div className='pb-[40px] md:pb-[0px]'>
        <span className='blurryEllipse md:block hidden'></span>

        <div className=' md:w-[80vw] mx-auto md:h-[34.453125vw] z-[5] relative' >
                 <img src={schemeBg} alt="" className="absolute w-full h-full  md:block hidden" />
                <img src={scheme} alt=""  className=' w-full md:block hidden'/>
                 <img src={mobschemeBg} alt="" className=" w-full h-full  block md:hidden object-cover" />
                <img src={mobscheme} alt=""  className=' w-[328.67px] block md:hidden absolute top-[55.99px] left-[50%] 
                transform translate-x-[-50%]
                '/>
        </div>
    

</div>
  )
}

export default InfoGraphic