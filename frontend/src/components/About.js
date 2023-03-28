/* global BigInt */

import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import { connect } from 'react-redux';
import { changeWallet, updateAddress } from '../redux/wallet/actions';
import ConnectWallet from './ConnectWallet';
import Form from './Form';
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
import { convertDateToSeconds } from '../constants/date';
import CustomToolTip from './Tooltip';
import LotteryTable from './LotteryTable';
import { getRewardAmt } from '../utils/dispense_lottery';
import { getApplicationAddress } from 'algosdk';

function About(props) {
    const [showWalletModal, setShowWalletModal] = useState(false);
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
        } else setShowWalletModal(true);
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

    return (
        <div>
            {props.selected_network && (
                <div
                    className="text_center"
                    style={{ color: Color.YELLOW, fontSize: '3rem' }}
                >
                    <div>Weekly Prize</div>
                    <div>{lotteryloader ? <Loader /> : lotteryAmt}</div>
                </div>
            )}
            <LotteryDataModal />
            {showWalletModal && (
                <ConnectWallet
                    closeModal={(state) => setShowWalletModal(state)}
                />
            )}
            {showFormModal && (
                <Form
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
            {isAdminLogged && (
                <div className="about_admin_container">
                    <h1 className="admin_heading">Welcome Back Admin </h1>
                    <h2
                        onClick={() => navigate(Routes.ADMIN)}
                        className="admin_link"
                    >
                        View page{' '}
                    </h2>
                </div>
            )}
            <div className="about">
                <img
                    alt="main"
                    className="about_img_left"
                    src={ImageSrc.IMAGE3}
                />

                <img
                    alt="left"
                    className=" about_img_right"
                    src={ImageSrc.IMAGE1}
                />

                <div className="center">
                    <img
                        alt="center"
                        className="about_img_center"
                        src={ImageSrc.LOGO_WITH_TITLE}
                    />
                    <div className="flexBox_space marginTop_large">
                        <CustomToolTip
                            title={
                                !isDepositValid &&
                                'Deposits are not accepted at this time.'
                            }
                        >
                            <span>
                                <Button
                                    disabled={!isDepositValid}
                                    size="large"
                                    variant="contained"
                                    className="about_btn_left"
                                    onClick={() =>
                                        openForm(ButtonTypes.DEPOSIT)
                                    }
                                >
                                    Deposit
                                </Button>
                            </span>
                        </CustomToolTip>
                        <Button
                            size="large"
                            variant="contained"
                            className="about_btn_right"
                            onClick={() => openForm(ButtonTypes.WITHDRAW)}
                        >
                            Withdraw
                        </Button>
                    </div>
                    <h2
                        className="pointer text_center marginTop_large"
                        onClick={() => {
                            setLotterModal(true);
                        }}
                        style={{ display: props.address ? '' : 'none' }}
                    >
                        Check Prize Game Results
                    </h2>
                    <div
                        className="pointer text_center marginTop_large"
                        style={{
                            fontSize: '1.3rem',
                            display: props.selected_network ? '' : 'none'
                        }}
                    >
                        Total Distributed OPT :&nbsp;
                        {optLoader ? <Loader /> : totalDistributedOPT}
                    </div>
                </div>
            </div>
        </div>
    );
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
