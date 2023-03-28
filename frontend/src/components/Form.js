/* global BigInt */

import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle } from '@mui/material';
import { ButtonTypes, TEN_BILLION } from '../constants/constants';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { deposit, expectedOPTAmount } from '../utils/deposit';
import { computeAlgoWithdrawAmtFromOPT, withdraw } from '../utils/withdraw';
import { FEE_ADDR, getAssetHolding, OptAppID, OptAsaID } from '../utils/common';
import CustomTextField from './CustomTextField';
import { connect } from 'react-redux';
import { addError, addSuccess } from '../redux/feedback_reducer';
import Loader from './Loader';
const { getApplicationAddress } = require('algosdk');

function Form(props) {
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
                deposit(
                    props.web,
                    props.address,
                    algoAmt * 1e6,
                    props.selected_network,
                    props.admin_addr
                )
                    .then(() => {
                        setBackdropActive(false);
                        props.addSuccess(
                            `Your ${algoAmt} Algos is deposited successfully.`
                        );
                        handleCloseModal();
                    })
                    .catch((error) => {
                        setBackdropActive(false);
                        props.addError(error.message);
                    });
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
                console.log(error);
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
                console.log(error);
                setOPTExchangeAmt(1);
            });
    }

    return (
        <Dialog onClose={handleCloseModal} open={openModal}>
            <Loader loading={isBackdropActive} />
            <div
                className="modal"
                style={{ minHeight: '20rem', minWidth: '30rem' }}
            >
                <DialogTitle className="modal_heading">
                    {props.type}
                </DialogTitle>
                <div className="form_container">
                    <div>
                        Exchange rate{' '}
                        {props.type === ButtonTypes.WITHDRAW &&
                            '(prior to a .1% fee)'}
                    </div>
                    <div className="padding_top_sm marginBottom_small">
                        {props.type === ButtonTypes.WITHDRAW
                            ? `1 OPT ~ ${OPTExchangeAmt} ALGO`
                            : `1 ALGO ~ ${algoExchangeAmt} OPT`}
                    </div>
                    <div
                        className="flexBox_column"
                        style={{ flexDirection: props.displayFlexDirection }}
                    >
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

                        <Button
                            className="link_btn marginTop_small"
                            style={{ order: props.order }}
                            onClick={handleClick}
                            disabled={optError || amtError}
                        >
                            {props.type}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Form);
