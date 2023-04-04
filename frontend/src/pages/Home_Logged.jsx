import React, { useEffect, useState } from 'react'
import ServicesHero from '../components/heroes/ServicesHero'
import depositFunc from '../api/deposit'
import chairImg from '../assets/images/indivual/chair.jpg'
import mobBg from '../assets/images/indivual/mobBg.jpg'
import dottedBorder from '../assets/images/sevices/dottedBorder.svg'
import { connect } from 'react-redux';
import { changeWallet, updateAddress, updateAccountStore } from '../redux/wallet/actions';
import { Button, CircularProgress, Dialog } from '@mui/material';

import WithDraw from '../components/modal/WithDraw'
import {
    ButtonTypes,
    GlobalStateKeys,
    ImageSrc,
    Routes,
    Color
} from '../constants/constants';
import { useNavigate } from 'react-router-dom';

import { convertDateToSeconds } from '../constants/date';

import LotteryTable from '../components/LotteryTable';
import { getRewardAmt } from '../utils/dispense_lottery';
import { readAppGlobalState, localOPTBalances, getAssetHolding, OptAppID, OptAsaID } from '../utils/common';
    
 

const Home_Logged = (props) => {
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
    const [opLoader, setOPLoader] = useState(false);
    const [optAmount, setOPTAmount] = useState(0);
    const [OdssOfWinning, setOddsOfWinning] = useState(0);
    const [userASAHolding, setUserASAHolding] = useState(0);

    useEffect(() => {

        setAdminLog(props.is_admin_logged);
        checkDepositValid();
        if (props.account_store.length !== 0) {
            AccountOPT()
        }
    }, [props.address, props.is_admin_logged, props.selected_network]);
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          const currentDate = new Date();
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + (7 - targetDate.getDay()));
          targetDate.setHours(22, 0, 0, 0);
    
          if (currentDate > targetDate) {
            targetDate.setDate(targetDate.getDate() + 7);
          }
    
          const diff = targetDate - currentDate;
          const d = Math.floor(diff / 1000 / 60 / 60 / 24);
          const h = Math.floor(diff / 1000 / 60 / 60) % 24;
          const m = Math.floor(diff / 1000 / 60) % 60;
          const s = Math.floor(diff / 1000) % 60;
    
          setTimeRemaining({
            days: d,
            hours: h,
            minutes: m,
            seconds: s,
          });
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);
    useEffect(() => {
        getOPTBalanceOfUser()
    }, [])
        useEffect(() => {
        if (props.selected_network) {
            getOPTBalanceOfUser()

            getWeeklyLotteryAmt();
        }
       
    }, [props.success, props.selected_network]); // update if OPT/algo is withrawn/deposited

    const openForm = (type) => {
        
        if (props.address) {
            props.showFunc()
            setShowFormModal(true);
            setFormType(type);
        } else {
            props.showFunc()
            props.setShowWalletModal(true);
        }
    };
    // note: this doesn't track the "reward opt" distributed to users
    async function AccountOPT () {
        // setOPLoader(true);

        setOPTAmount(props.account_store[0].amount)
        setOPLoader(true);
    }

    async function getOPTBalanceOfUser() {
        
        const balance = await getAssetHolding(
            props.address,
            OptAsaID(props.selected_network),
            props.selected_network
            );
        
        const amt = balance?.amount / 1e6;
        if (isNaN(amt)) {
            setUserASAHolding(0);
        } else setUserASAHolding(amt ?? 0);
        fetchTotalDistributedOPT()
    }

    async function fetchTotalDistributedOPT() {
        setOPTLoader(true);
        const localOptBalances = await localOPTBalances(props.selected_network);
        let totalOPT = 0.0;
        for (const v of Object.values(localOptBalances)) {
            totalOPT += v;
        }
        setTotalDistributedOPT((totalOPT / 1e6).toFixed(3));
        setOddsOfWinning((userASAHolding / totalDistributedOPT).toFixed(5))
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
   

<section className='relative min-h-[100vh] overflow-hidden'>
{showFormModal && (
        <WithDraw
            closeModal={(state) => setShowFormModal(state)}
            type={formType}
            displayFlexDirection={
                formType === ButtonTypes.WITHDRAW
                    ? 'column-reverse'
                    : 'column'
            }
            order={formType === ButtonTypes.WITHDRAW ? -1 : 1}
        />
)}
           <span className='heroOverlayLeft absolute top-0 h-full  left-0 w-[120px] z-[3] '>

</span>
           <span className='heroOverlayRight absolute top-0 h-full  right-0 w-[120px] z-[3] '>

</span>


<span className='heroOverlayBottom1 absolute bottom-0 left-0 w-full h-[280.21px] z-[4]'>

</span>
<span className='heroOverlayBottom2 absolute bottom-[-122px]  w-full h-[363.14px] z-[5]'>

</span>

<span className='heroOverlayTop absolute top-0 left-0 w-full h-[262.12px] z-[5]'>

</span>
<img src={isMob?mobBg:chairImg} alt="Chair Image" className='absolute md:w-[72.109375vw]  top-[110px] md:top-0 left-0 mix-blend-lighten' />
        <ServicesHero/>
        <div className='content md:w-[27.8125vw] top-[116.12px] h-[840px] md:h-[61vw]  left-[50%] transform translate-x-[-50%] md:translate-x-[0]   md:left-[65.703125vw] relative md:top-[10.56875vw] z-[7]'>
        <div className='flex flex-col   items-center'>
        <span class="colus inline-block tracking-[17.43px] text-[10px] leading-[12px] md:text-[0.73828125vw]  md:leading-[0.8859375vw] text-[#F5F5F5] md:tracking-[1.41796875vw]   font-[400]">WELCOME TO</span>
        <h1 class="md:text-[4.830296875vw] colus text-[#EDDB0F] md:leading-[5.79609375vw] text-[65.39px] leading-[78px] mt-[-2px] md:mt-[-4px]">Optimum</h1>
        <h4 class="md:text-[1.5546875vw] md:leading-[1.865625vw] colus leading-[31px] text-[26.2381px] font-[400] text-[#FFFFFF] mt-[-2px] md:mt-[-4px]">NEW ERA OF STAKING</h4>
       </div>

        

        <div className='flex justify-between mt-[43.65px] md:mb-[1.875vw] md:mt-[2.58515625vw] relative mb-[32px]
             flex-col gap-y-[13px]  md:gap-y-[1.015625vw] items-center
              '>



<div className={`w-[320px] h-[101px] rounded-[24px] md:w-[25vw] md:h-[7.890625vw]   myTab2 md:rounded-[2.12vw] flex flex-col justify-center items-center text-[#FFFFFF]`}>
<div className="myOverlay2">
        
        </div>
   <div className='myTabOverlays'>
    <div className="overlay2"></div>
    <div className="overlay1"></div>
    </div>
   
        <span className='colus z-[5] text-[20px] leading-[24px] md:text-[1.5625vw] md:leading-[1.875vw]  z-[2]'>
        OPT BALANCE
        </span>
        <span className='colus z-[5] text-[30.93px] leading-[37.11px]  md:text-[2.41640625vw] md:leading-[2.89921875vw]  z-[2]'>
        {opLoader ? userASAHolding : <Loader />}
        </span>
    </div>
        <div className={`w-[320px] h-[101px] rounded-[24px] md:w-[25vw] md:h-[7.890625vw]   myTab md:rounded-[2.12vw] flex flex-col justify-center items-center rightTab text-[#FFFFFF]`}>
    <span className='tabOverlay1'></span>
    <span className='tabOverlay2'></span>
        <span className='colus text-[20px] leading-[24px] md:text-[1.5625vw] md:leading-[1.875vw]  z-[2]'>
        ODDS OF WINNINGS
        </span>
        <span className='colus text-[30.93px] leading-[37.11px]  md:text-[2.41640625vw] md:leading-[2.89921875vw]  z-[2]'>
       {OdssOfWinning}
        </span>
    </div>

 </div>


 <div className={`w-full md:w-[27.8125vw]   relative h-[74px] md:h-[5.78125vw]  flex items-cetner justify-center gap-x-[60px] md:gap-x-[4.6875vw] `}>
    <span className='w-[1px] h-[52px] md:h-[4.0625vw] absolute top-[12px] md:top-[0.9375vw] border-l-[1px] border-  dotted border-[#99939C]'></span>
    <img src={dottedBorder} alt="DottedBorder" className='w-full object-cover   absolute top-0 left-0'/>
    <img src={dottedBorder} alt="DottedBorder" className='w-full   object-cover absolute bottom-0 left-0'/>
    <div className='flex items-center  gap-x-[20px] md:gap-x-[1.5625vw] text-[#FFFFFF]'>
        <span className='md:w-[1.89375vw] md:h-[1.25vw] w-[24.24px] h-[16px] bg-[#FF005C] clipPath2 '></span>
        <span onClick={() =>
                                      openForm(ButtonTypes.DEPOSIT)} className='font-[700] cursor-pointer text-[18px] md:text-[1.40625vw] leading-[27px] md:leading-[2.109375vw]'>Deposit</span>
    </div>
    <div className='flex items-center gap-x-[12px]  md:gap-x-[0.9375vw] text-[#FFFFFF]'>
        <span className='md:w-[1.89375vw] md:h-[1.25vw] w-[24.24px] h-[16px] bg-[#EDDB0F] clipPath2 '></span>
        <span className='font-[700] text-[18px] md:text-[1.40625vw] leading-[27px] md:leading-[2.109375vw] cursor-pointer' onClick={() => openForm(ButtonTypes.WITHDRAW)}>Withdraw</span>
    </div>
</div>
       

    <div className='flex flex-col items-center gap-y-[4px] mt-[32px] md:mt-[1.875vw] z-[5] relative'>
      <span className='colus text-[20px] leading-[24px] md:text-[1.5625vw] md:leading-[1.875vw] text-[#EDDB0F]'>Next drawing</span>
      <span className='colus text-[20px] leading-[24px] md:text-[2.34375vw] md:leading-[2.890625vw] text-[#FFFFFF]'>{timeRemaining.days} Days : {timeRemaining.hours} hours</span>
      <span className='colus text-[20px] leading-[24px] md:text-[1.328125vw] md:leading-[1.5625vw] text-[#FFFFFF] mt-[3px]'>{timeRemaining.minutes} min : {timeRemaining.seconds} sec</span>
    </div>


        </div>


    </section>
 

  )
}



const mapStateToProps = (state) => {
    return {
        selected: state.wallet.selected,
        address: state.wallet.address,
        account_store: state.wallet.account_store,
        is_admin_logged: state.wallet.is_admin_logged,
        selected_network: state.wallet.selected_network,
        admin_addr: state.wallet.admin_addr,
        success: state.feedback.success
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateAccountStore: (payload) => dispatch(updateAccountStore(payload)),
        changeWallet: (payload) => dispatch(changeWallet(payload)),
        updateAddress: (payload) => dispatch(updateAddress(payload))
    };
};



export default connect(mapStateToProps, mapDispatchToProps)(Home_Logged);