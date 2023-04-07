import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import ConnectWallet from '../components/ConnectWallet';
import Form from '../components/Form';
import {
    ButtonTypes,
    GlobalStateKeys,
    ImageSrc,
    Routes,
    Color
} from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import {
    localOPTBalances,
    OptAppID,
    readAppGlobalState
} from '../utils/common';
import WithDraw from '../components/modal/WithDraw'
import { convertDateToSeconds } from '../constants/date';

import LotteryTable from '../components/LotteryTable';
import { getRewardAmt } from '../utils/dispense_lottery';
import { getApplicationAddress } from 'algosdk';
import ServicesHero from '../components/heroes/ServicesHero' 
import { Link } from 'react-router-dom'
import Tagline from '../components/utils/Tagline'
import Heading from '../components/utils/Heading'
import SubHeading from '../components/utils/SubHeading'
import Paragraph from '../components/utils/Paragraph'
import BtnGroups from '../components/utils/BtnGroups'
import bannerImg from '../assets/images/sevices/banner.jpg'  
import mobBannerImg from '../assets/images/sevices/mobBanner.jpg' 
import coin from '../assets/images/sevices/coin.png'
import mobCoinLeft from '../assets/images/sevices/mobCoinLeft.png'
import auditSvg from '../assets/images/sevices/audit.svg'
import mobCoinRight from '../assets/images/sevices/mobCoinRight.png'
import { connect } from 'react-redux';
import { changeWallet, updateAddress } from '../redux/wallet/actions';

const Home = (props) => {
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
        } else{
            props.setShowWalletModal(true);
            props.showFunc()
            
        } 
    };

    const handleWalletModal = (event) => {
        event.preventDefault();
        props.setShowWalletModal(true);
        props.showFunc()
        
    }

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
     
      

        <section className='w-full h-[100vh] relative'>
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
        <ServicesHero isMob={isMob} bannerImg={isMob ? mobBannerImg: bannerImg}/>
        <div className="content absolute  flex flex-col    w-full  md:w-[unset] text-white h-full md:h-[unset]  md:left-[13.046875vw] md:top-[22.25vh] text-center z-[10]">
            <Tagline title={"WELCOME TO"} classes={"pt-[30.7692307692vw] md:pt-0 "}/>
            <Heading title={"Optimum"}/>
            <SubHeading title="NEW ERA OF STAKING"/>
            <Paragraph classes={"w-[300px] md:w-[23.31015625vw] mx-auto mt-[18.65px] md:mt-[1.68515625vw]"}>
            Join our prize-linked staking program on the <span className='font-[700]'>Algorand blockchain</span> for a chance to win big! 

            </Paragraph>
           
            <Link className='text-[#EDDB0F] md:leading-[1.6875vw] font-[700] text-[18px] leading-[22px] mt-[10px] inline-block md:text-[0.9375vw]'>
            Learn More
            </Link>
            
          <BtnGroups props={props} isDepositValid={isDepositValid} ButtonTypes_DEPOSIT={ButtonTypes.DEPOSIT} ButtonTypes_WITHDRAW={ButtonTypes.WITHDRAW} openForm={openForm} classes={"mt-auto mx-auto md:mt-[2.34375vw] mb-[115px] md:mb-0"}/>
            
        </div>
        {isMob || <div className='absolute top-[13.59375vw] right-0'>
        <img src={coin} alt="Coin" />
    </div>}
    {isMob ||<div className='w-[5.9375vw] h-[5.9375vw] absolute bottom-[7.265625vw] z-[10] right-[4.21875vw] '>
        <img src={auditSvg} alt="Audit Svg" className='w-full h-full object-cover'/>
    </div>}
    <div className="mobOverlay md:hidden"></div>
    <div className='absolute md:hidden bottom-[255px]'>
        <img src={mobCoinLeft} alt="" />
    </div>
    <div className='absolute md:hidden bottom-[295px] right-0'>
        <img src={mobCoinRight} alt="" />
    </div>

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



export default connect(mapStateToProps, mapDispatchToProps)(Home);

// export default NewPage1