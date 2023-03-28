import React from 'react' 
import smokeVideoMob from '../../assets/videos/smoke.mp4'
import particlesVideo from '../../assets/videos/particles.mp4'
import smokeDesktopVideo from '../../assets/videos/smokeDesktop.mp4'


const ServicesHero = ({isMob,bannerImg}) => {
    
    

  return (
    <div className='banner absolute top-0 left-0 w-full h-full '>
          {bannerImg && <img src={bannerImg} alt="Banner background"  className='w-full h-full object-cover'/>
     }
        <video autoPlay muted loop src={isMob ? smokeVideoMob : smokeDesktopVideo} className={`w-full h-full transform ${isMob ?"  " : " scale-[-1] "} object-cover absolute top-0 mix-blend-lighten`} ></video> 
        <video autoPlay muted loop src={particlesVideo} className='w-full h-full object-cover absolute top-0 mix-blend-lighten'></video>
         
   
   </div>
  
  )
}

export default ServicesHero