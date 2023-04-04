import React, { useEffect, useState }  from 'react'
import ServicesHero from '../components/heroes/ServicesHero'  
import Tagline from '../components/utils/Tagline'
import Heading from '../components/utils/Heading'
import SubHeading from '../components/utils/SubHeading' 
import BtnGroups from '../components/utils/BtnGroups' 
import leftImage from '../assets/images/loggedIn/leftImage.jpg'
import rightImage from '../assets/images/loggedIn/rightImage.jpg'
import bgMob from '../assets/images/loggedIn/bgMob.jpg'
import Tab from '../components/utils/Tab'
import { connect } from 'react-redux';
import { changeWallet, updateAddress } from '../redux/wallet/actions';
import { CircularProgress, Dialog } from '@mui/material';
import {
    ButtonTypes,
    GlobalStateKeys,
    Color
} from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import {
    localOPTBalances,
    OptAppID,
    readAppGlobalState
} from '../utils/common';
import { convertDateToSeconds } from '../constants/date';

import LotteryTable from '../components/LotteryTable';
import { getRewardAmt } from '../utils/dispense_lottery';

const NewPage2 = (props) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [isAdminLogged, setAdminLog] = useState(props.is_admin_logged);
  const navigate = useNavigate();
  const [isDepositValid, setDepositValid] = useState(true);
  const [isLotteryModalActive, setLotterModal] = useState(false);
  const [lotteryAmt, setLotteryAmt] = useState(0);
  const [totalDistributedOPT, setTotalDistributedOPT] = useState(undefined);
  const [lotteryloader, setLotteryLoader] = useState(false);
  const [optLoader, setOPTLoader] = useState(false);

  useEffect(() => {
      setAdminLog(props.is_admin_logged);
      checkDepositValid();
  }, [props.address, props.is_admin_logged, props.selected_network]);

  useEffect(() => {
      if (props.selected_network) {
          fetchTotalDistributedOPT();
          getWeeklyLotteryAmt();
      }
  }, [props.success, props.selected_network]); // update if OPT/algo is withrawn/deposited

  const openForm = (type) => {
      
      if (props.address) {
          setShowFormModal(true);
          setFormType(type);
      } else props.setShowWalletModal(true);
  };

  // note: this doesn't track the "reward opt" distributed to users
  async function fetchTotalDistributedOPT() {
      setOPTLoader(true);
      const localOptBalances = await localOPTBalances(props.selected_network);
      let totalOPT = 0.0;
      for (const v of Object.values(localOptBalances)) {
          totalOPT += v;
      }
      setTotalDistributedOPT((totalOPT / 1e6).toFixed(3));
      setOPTLoader(false);
  }

  function checkDepositValid() {
      if (props.selected_network && props.admin_addr) {
          readAppGlobalState(
              props.admin_addr,
              OptAppID(props.selected_network),
              props.selected_network
          ).then((res) => {
              let appGlobalState = res;
              const registration_end = appGlobalState.get(
                  GlobalStateKeys.REGISTRATION_END
              );
              const reward_distribution = appGlobalState.get(
                  GlobalStateKeys.REWARD_DISTRIBUTION
              );
              if (registration_end && reward_distribution) {
                  const range =
                      reward_distribution <=
                          convertDateToSeconds(new Date()) &&
                      convertDateToSeconds(new Date()) <= registration_end;
                  setDepositValid(range);
              } else {
                  // timelines are not set yet
                  setDepositValid(false);
              }
          });
      }
  }

  const LotteryDataModal = () => {
      return (
          <Dialog
              onClose={() => setLotterModal(false)}
              open={isLotteryModalActive}
          >
              <LotteryTable screen="Home" />
          </Dialog>
      );
  };

  async function getWeeklyLotteryAmt() {
      setLotteryLoader(true);
      const rewardAmt = await getRewardAmt(
          props.selected_network,
          props.admin_addr
      );
      if (!rewardAmt) {
          setLotteryAmt(0);
      } else setLotteryAmt((parseFloat(rewardAmt * 0.9) / 1e6).toFixed(6));
      setLotteryLoader(false);
  }

  const Loader = () => {
      return (
          <span
              style={{
                  fontSize: '1.5rem'
              }}
          >
              Calculating...{'  '}
              <CircularProgress
                  size={20}
                  style={{ color: Color.DARK_YELLOW }}
              />
          </span>
      );
  };

  const [isMob,setIsMob] = useState(false)
  useEffect(()=>{
      setIsMob(window.innerWidth < 768)
      const handleResize =()=>{
      setIsMob(window.innerWidth < 768)

      }
      window.addEventListener('resize',handleResize)
      return ()=> window.removeEventListener('resize',handleResize)
  },[])
  return ( 
     
      

        <section className='w-full min-h-[100vh] relative overflow-hidden '>
        <img src={leftImage} alt="Left Image" className='hidden md:block absolute bottom-0 mix-blend-lighten w-[39.375vw]'/>
        <img src={rightImage} alt="Left Image" className='hidden md:block absolute right-0 mix-blend-lighten w-[40.9375vw]'/>

          <span className='heroOverlayLeft2 hidden md:block absolute top-0 left-0 h-full w-[32.8125vw] z-[2] '>

</span>
             <span className='heroOverlayRight hidden md:block absolute top-0 h-full  right-0 w-[9.375vw] z-[3] '>

            </span>
            <span className='heroOverlayBottom1 absolute bottom-0 left-0 w-full h-[280px] md:h-[21.89140625vw] z-[4]'>

            </span>
            <span className='heroOverlayBottom2 absolute bottom-[-9.53125vw]  w-full md:h-[28.3703125vw] h-[240px] z-[5]'>

            </span>
           
            <span className='heroOverlayTop absolute top-0 left-0 w-full md:h-[20.478125vw] z-[5] h-[260px]'>

            </span>
            <img src={bgMob} alt="Bg MOb"  className='block md:hidden absolute left-0 mix-blend-lighten top-[10vh]'/>
        <ServicesHero isMob={isMob} />
        
        <div className="content relative   flex flex-col  pb-[130px] md:pb-[200px]   w-full  md:w-[51.875vw] text-white h-full md:h-[unset]  left-[50%] transform translate-x-[-50%]   md:top-[19.625vh] text-center z-[10]">
            <Tagline title={"WELCOME TO"} classes={"pt-[30.7692307692vw] md:pt-0 "}/>
            <Heading title={"Optimum"}/>
            <SubHeading title="NEW ERA OF STAKING"/>
             <div className='flex justify-between mt-[43.65px] mb-[32px] md:my-[2.5vw] relative
             flex-col md:flex-row gap-y-[16px] items-center
              '>
                
                
                <Tab title={'Weekly prize'} value={"1.26000000"}/>
                <Tab title={'total distributed OPT'} value={"0"} rightTab/>
                
             </div>
             

          <BtnGroups isDepositValid={isDepositValid} ButtonTypes_DEPOSIT={ButtonTypes.DEPOSIT} ButtonTypes_WITHDRAW={ButtonTypes.WITHDRAW} openForm={openForm} classes={"mx-auto"}
        //   classes={"mt-auto mx-auto md:mt-[2.34375vw] mb-[115px] md:mb-0"}
          />
          <button className='w-[231.82px] h-[35.42px] text-[13.05px]
          mt-[32px]
           md:w-[18.246875vw] md:mt-[2.5vw]  clipPathButton  md:text-[1.015625vw] font-[700] mx-auto md:h-[2.7671875vw] border border-[#EDDB0F]'>
            Check Prize Game Results
          </button>
            
        </div>
        
     
    <div className="mobOverlay md:hidden"></div>
    

    </section> 
       
     
      

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



export default connect(mapStateToProps, mapDispatchToProps)(NewPage2);