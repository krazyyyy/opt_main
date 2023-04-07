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
import { connect } from 'react-redux';
import { changeWallet, updateAddress } from '../redux/wallet/actions';


const About = (props) => {
  
  return (
    <>
    <div className='bg-[#11031A] overflow-hidden'>
 
   <Hero props={props} />
    
   <PrizeMoney />
 
    <section className='bg-[#11031A]  md:py-[4vw] relative z-[16] mb-[136px]'>
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
const mapStateToProps = (state) => {
  return {
      selected: state.wallet.selected,
      address: state.wallet.address,
      is_admin_logged: state.wallet.is_admin_logged,
      selected_network: state.wallet.selected_network,
      admin_addr: state.wallet.admin_addr,
      success: state.feedback.success
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      changeWallet: (payload) => dispatch(changeWallet(payload)),
      updateAddress: (payload) => dispatch(updateAddress(payload))
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(About);