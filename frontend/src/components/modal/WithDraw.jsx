/* global BigInt */
import React, { useState, useEffect } from 'react'
import Withdrawimg  from "../../assets/images/withdrawpop.svg"
import depositFunc from '../../api/deposit'
import PopUpCloser from '../utils/PopUpCloser'
import { Button, Dialog, DialogTitle } from '@mui/material';
import { ButtonTypes, TEN_BILLION } from '../../constants/constants';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { deposit, expectedOPTAmount } from '../../utils/deposit';
import { computeAlgoWithdrawAmtFromOPT, withdraw } from '../../utils/withdraw';
import { FEE_ADDR, getAssetHolding, OptAppID, OptAsaID } from '../../utils/common';
import CustomTextField from '../CustomTextField';
import { connect } from 'react-redux';
import { addError, addSuccess } from '../../redux/feedback_reducer';
import Loader from '../Loader';
const { getApplicationAddress } = require('algosdk');


const WithDraw = (props) => {
  const [openModal, setOpenModal] = useState(true);
    const handleCloseModal = () => setOpenModal(false);
    const [algoAmt, setAlgoAmt] = useState(undefined);
    const [opt, setOpt] = useState(undefined);
    const [amtError, setAmtError] = useState('');
    const [optError, setOptError] = useState('');
    const [isOPTEdit, setIsOPTEdit] = useState(false);
    const [isAlgoEdit, setIsAlgoEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userASAHolding, setUserASAHolding] = useState(0);
    const [isBackdropActive, setBackdropActive] = useState(false);
    const [algoExchangeAmt, setAlgoExchangeAmt] = useState(1);
    const [OPTExchangeAmt, setOPTExchangeAmt] = useState(1);
    useEffect(() => {
        props.closeModal(openModal);
        getOPTBalanceOfUser();
        getAlgoExchangeAmt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModal]);
    useEffect(() => {
        async function computeOPT() {
            
            if (algoAmt) {
                setLoading(true);
                let opt = +(await expectedOPTAmount(
                    algoAmt * 1e6,
                    props.selected_network,
                    props.admin_addr
                ));
                if (opt === 0) {
                    // no prior deposit
                    const appAccAddr = getApplicationAddress(
                        OptAppID(props.selected_network)
                    );
                    const optHoldingOfApp = await getAssetHolding(
                        appAccAddr,
                        OptAsaID(props.selected_network),
                        props.selected_network
                    );
                    if (BigInt(optHoldingOfApp.amount) === TEN_BILLION) {
                        opt = algoAmt;
                    }
                }
                setLoading(false);
                return setOpt(opt);
            } else {
                setLoading(false);
                return setOpt('');
            }
        }
        if (isAlgoEdit) {
            computeOPT();
        }
    }, [algoAmt, isAlgoEdit]);
    useEffect(() => {
        async function computeAlgo() {
            if (opt) {
                if (userASAHolding < opt) {
                    setOptError(
                        'Insufficient balance, not enough OPT in your account '
                        );
                    }
                    setLoading(true);
                    const calculatedAmt =
                    parseInt(
                        await computeAlgoWithdrawAmtFromOPT(
                            props.admin_addr,
                            OptAppID(props.selected_network),
                            OptAsaID(props.selected_network),
                            opt,
                            props.selected_network
                        ).catch((error) => props.addError(error.message))
                    ) / 1e6;
                setLoading(false);
                return setAlgoAmt(calculatedAmt);
            } else {
                setLoading(false);
                return setAlgoAmt('');
            }
        }
        if (isOPTEdit) {
            computeAlgo();
        }
    }, [opt, isOPTEdit]);

    const SwapIcon = (
        <div
            className="swap_icon_container"
            style={{ marginTop: amtError || optError ? '1rem' : 0 }}
        >
            <SwapVertIcon className="swap_icon" />
        </div>
    );

    const handleClick = async () => {
        await getAlgoExchangeAmt();
        if (props.type === ButtonTypes.DEPOSIT) {
            if (!algoAmt) {
                setAmtError('Please provide the algos to be deposited.');
            } else {
                setBackdropActive(true);
                depositFunc(
                    props.web,
                    props.address,
                    algoAmt * 1e6,
                    props.selected_network,
                )
            //  {   deposit(
            //         props.web,
            //         props.address,
            //         algoAmt * 1e6,
            //         props.selected_network,
            //         props.admin_addr
            //     )
            //         .then(() => {
            //             setBackdropActive(false);
            //             props.addSuccess(
            //                 `Your ${algoAmt} Algos is deposited successfully.`
            //             );
            //             handleCloseModal();
            //         })
            //         .catch((error) => {
            //             setBackdropActive(false);
            //             props.addError(error.message);
            //         });}
            }
        } else {
            if (!opt) {
                setOptError('Please provide OPT to be withdrawn.');
            } else {
                setBackdropActive(true);
                withdraw(
                    props.web,
                    props.address,
                    FEE_ADDR,
                    opt,
                    props.selected_network,
                    props.admin_addr
                )
                    .then(() => {
                        setBackdropActive(false);
                        props.addSuccess(
                            `Your ${opt} OPT is exchanged successfully.`
                        );
                        handleCloseModal();
                    })
                    .catch((error) => {
                        setBackdropActive(false);
                        props.addError(error.message);
                    });
            }
        }
    };

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
    }

    async function getAlgoExchangeAmt() {
        await getOPTExchangeAmt();
        await expectedOPTAmount(1e6, props.selected_network, props.admin_addr)
        .then((amt) => {
            setAlgoExchangeAmt(amt);
        })
        .catch((error) => {
                setAlgoExchangeAmt(1);
            });
    }

    async function getOPTExchangeAmt() {
        await computeAlgoWithdrawAmtFromOPT(
            props.admin_addr,
            OptAppID(props.selected_network),
            OptAsaID(props.selected_network),
            1,
            props.selected_network
        )
            .then((amt) => {
                setOPTExchangeAmt((parseInt(amt) / 1e6).toFixed(5));
            })
            .catch((error) => {
                setOPTExchangeAmt(1);
            });
    }

  const [states,setStates]= useState({
    opt:'',
    algos:''
  })

  const handleChange =(e)=>{
    setStates((prev)=>{
      return {
        ...prev,
        [e.target.id] : e.target.value
      }
    })
  }
  return (
    <div className='popupclass active w-[100%] h-[100vh] fixed top-0 left-0  justify-center items-center z-[20] flex opacity-[0] pointer-events-none'>
    <div className='w-[100%] h-[100%] absolute left-0 top-0  bg-[#11031A]  opacity-[0.8] '>
         
    </div>
    <div className='flex flex-col gap-y-[32px] md:gap-y-[2.5vw] items-center relative font-[400]'>
    <div className='withdraw w-[288px]  h-[385px] md:w-[22.5vw]  
      md:h-[30.078125vw] rounded-[24px] bg-[#2F193D] z-10 
     relative  overflow-hidden
      '>
      <div className= 'with-drawoverlays  absolute w-[775.41px] h-[712.56px] top-[-167.65px] left-[-237.56px] md:w-[60.57890625vw] md:h-[55.66875vw] md:top-[-13.09765625vw] md:left-[-18.559375vw]'>
     
<span className='top-left'></span>
<span className='bottom-e2 z-[-4]'></span>

<span className='bottom-e3 z-[-1]'></span>
</div>
<div className='flex flex-col gap-y-[16px] md:gap-y-[1.25vw] relative z-[55]
w-[100%] h-[100%]
'>
<div className='flex flex-col gap-y-[17.05px] md:gap-y-[1.33203125vw]      pt-[26.95px]   md:pt-[2.10546875vw] items-center pb-[4px]'>
    <h4 className='text-[20px] leading-[24px] md:leading-[1.875vw] md:text-[1.5625vw] text-[#FFFFFF] colus font-[400]'>{props.type}</h4>
        <span className='text-[12px] leading-[16.2px] md:leading-[1.265625vw] md:text-[0.9375vw] text-[#FFFFFF] tracking-[0.2px]'> {props.type === ButtonTypes.DEPOSIT &&
                        '(prior to a .1% fee)' }
                        {props.type === ButtonTypes.WITHDRAW &&
                         `1 OPT is ${OPTExchangeAmt} ALGO`}</span>
</div>
<div className='flex flex-col gap-y-[16px] md:gap-y-[1.25vw] items-center'>
<div className='text-[#FFFFFF]'>
{props.type === ButtonTypes.WITHDRAW &&
                        '(prior to a .1% fee)' }
                        {props.type === ButtonTypes.DEPOSIT &&
                            `1 ALGO is ${algoExchangeAmt} OPT`}
                    </div>
    
    <CustomTextField
                            error={amtError}
                            key="algos"
                            label="Algos"
                            variant="filled"
                            className="textfield"
                            type="number"
                            value={algoAmt || ''}
                            disabled={props.type === ButtonTypes.WITHDRAW}
                            onChange={(event) => {
                                setIsAlgoEdit(true);
                                setIsOPTEdit(false);
                                setAmtError('');
                                setAlgoAmt(
                                    (event.target.value * 1.0).toFixed(6)
                                        ? +(event.target.value * 1.0).toFixed(6)
                                        : '' // else when it is empty it shows 0
                                );
                            }}
                            helperText={amtError}
                            showLoader={
                                props.type === ButtonTypes.WITHDRAW && loading
                            }
                        />
                        {SwapIcon}
                        <CustomTextField
                            error={optError}
                            disabled={props.type === ButtonTypes.DEPOSIT}
                            key="opt"
                            label="OPT"
                            variant="filled"
                            className="textfield"
                            type="number"
                            value={opt || ''}
                            onChange={(event) => {
                                setIsAlgoEdit(false);
                                setIsOPTEdit(true);
                                setOptError('');
                                setOpt(
                                    (event.target.value * 1.0).toFixed(6)
                                        ? +(event.target.value * 1.0).toFixed(6)
                                        : ''
                                );
                            }}
                            helperText={optError}
                            showLoader={
                                props.type !== ButtonTypes.WITHDRAW && loading
                            }
                        />
</div>
<div                 onClick={handleClick}
                            disabled={optError || amtError} className='bg-[#EDDB0F] hover:bg-[#99939C] transition-all duration-500 rounded-[8px] cursor-pointer
w-[224px] h-[69px] md:w-[17.5vw] md:h-[5.390625vw]
flex justify-center items-center mx-[auto]
'>
    <span className='text-[18px] leading-[27px] md:leading-[2.109375vw] md:text-[1.40625vw] text-[#13051A] font-[700]'>                  {props.type}
          </span>
</div>
</div>


      </div>
      <div onClick={handleCloseModal}>
     <PopUpCloser />

      </div>
    </div>
      
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
      address: state.wallet.address,
      error: state.feedback.error,
      success: state.feedback.success,
      selected_network: state.wallet.selected_network,
      admin_addr: state.wallet.admin_addr,
      web: state.wallet.webMode
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      addError: (payload) => dispatch(addError(payload)),
      addSuccess: (payload) => dispatch(addSuccess(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithDraw);

// export default WithDraw
