/* global BigInt */
import { Button, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    GovernanceForm,
    StatisticsCard,
    TextFieldCard,
    VRFCard
} from '../components/AdminCards';
import CustodialWalletTable from '../components/CustodialWalletTable';
import CustomTextField from '../components/CustomTextField';
import Loader from '../components/Loader';
import {
    AppActions,
    GlobalStateKeys,
    GovernanceAddr,
    ImageSrc,
    Routes,
    TIMEOUT
} from '../constants/constants';
import { addError, addSuccess, removeError } from '../redux/feedback_reducer';
import { updateGovernanceAddr } from '../redux/wallet/actions';
import { closeCustodialWallets } from '../utils/close_custodial_wallets';
import {
    FEE_ADDR,
    getAssetHolding,
    getContractAlgoHolding,
    OptAppID,
    OptAsaID,
    optInApp,
    optInASA,
    readAppGlobalState,
} from '../utils/common';
import { fundCustodialWallets } from '../utils/deposit';
import { genAccounts } from '../utils/gen_accts_and_whitelist';
import { registerByCustodialWallets } from '../utils/register';
import { voteByCustodialWallets } from '../utils/vote';
import { withdrawRewards } from '../utils/withdraw_rewards';
import { useNavigate } from 'react-router-dom';
import vrf_randomizer from '../api/vrf_randomizer'
import reveal_vrf_number from '../api/reveal_vrf'
import send_vrf from '../api/send_vrf'

const { types } = require('@algo-builder/web');
const { getApplicationAddress } = require('algosdk');

function Admin(props) {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Live');
    const [algoInContract, setAlgoInContract] = useState(undefined);
    const [algoInCustodialWallet, setAlgoInCustodialWallet] =
        useState(undefined);
    const [optHoldingOfApp, setOptHoldingOfApp] = useState(undefined);

    const [custodialWalletNumber, setCustodialWalletNumber] =
        useState(undefined);
    const [custodialWalletNumberError, setCustodialWalletNumberError] =
        useState('');

    const [register, setRegister] = useState('');
    const [registerError, setRegisterError] = useState('');

    const [vrfRespose, setVrfResponse] = useState({});

    const [vote, setVote] = useState('');
    const [voteError, setVoteError] = useState('');

    const storedAddress = localStorage.getItem(GovernanceAddr);
    const [governanceAddr, setGovernanceAddr] = useState(
        storedAddress ? storedAddress : ''
    );
    const [governanceAddrError, setGovernanceAddrError] = useState('');

    const [globalState, setGlobalState] = useState(undefined);

    const [loading, setLoading] = useState(false);
    const [sendVrf, setSendVrf] = useState(true);

    const [governance, setGovernance] = useState(0);
    const [updateCustodialWalletsData, setCustodialWalletData] =
        useState(false); // update state in admin component to call fetch fn in custodial wallet component

    useEffect(async () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        await getGlobalState();
        await getContractStatus();
        await updateStats();
        await getGovernanceNonce();
    }, []);

    async function getGlobalState() {
        let appGlobalState = undefined;
        await readAppGlobalState(
            props.admin_addr,
            OptAppID(props.selected_network),
            props.selected_network
        )
            .then((res) => {
                appGlobalState = res;
                setGlobalState(res);
            })
            .catch((error) => {
                props.addError(error.message);
            });
        return appGlobalState;
    }

    async function getGovernanceNonce() {
        const appGlobalState = await getGlobalState();
        if (appGlobalState) {
            setGovernance(
                appGlobalState.get(GlobalStateKeys.GOVERNANCE_NONCE) ?? 0
            );
        }
    }

    async function updateStats() {
        setAlgoInContract(await getContractAlgoHolding(props.selected_network));
        const appAccAddr = getApplicationAddress(
            OptAppID(props.selected_network)
        );
        const holdingInfo = await getAssetHolding(
            appAccAddr,
            OptAsaID(props.selected_network),
            props.selected_network
        );

        setOptHoldingOfApp(BigInt(holdingInfo.amount) / 1000000n);
        const appGlobalState = await getGlobalState();
        if (appGlobalState) {
            let custodialWalletsAmount = appGlobalState.get(
                GlobalStateKeys.CUSTODIAL_DEPOSIT
            );
            if (custodialWalletsAmount) {
                setAlgoInCustodialWallet(custodialWalletsAmount / 1e6);
            } else setAlgoInCustodialWallet(0);
        } else setAlgoInCustodialWallet(0);
    }

    async function getContractStatus() {
        const appGlobalState = await getGlobalState();
        let status = 0;
        if (appGlobalState) {
            status = appGlobalState.get(GlobalStateKeys.PAUSED) ?? 0;
        }
        status = status === 0 ? 'Live' : 'Paused';
        setStatus(status);
    }

    async function sendVRFFunc () {
        let response = await send_vrf(props.address)

    }
        async function getVRF () {
        let response = await vrf_randomizer("726KLAKOQEQLWTQCJFBSP4JWJWASQ7T5OX6ABRKAY6GMBAA4GFSYBO6QGM")
        let resp = reveal_vrf_number(response)
        // if (resp) {
        //     setSendVrf(false)
        // }
    }

    async function handlePauseContract(status) {
        const handlePause = status
            ? AppActions.PAUSE_APP
            : AppActions.UNPAUSE_APP;
        const txParams = {
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: props.admin_addr,
            appID: OptAppID(props.selected_network),
            payFlags: { totalFee: 1000 },
            appArgs: [handlePause]
        };
        setLoading(true);
        await props.web
            .executeTx([txParams])
            .then(() => {
                props.addSuccess(
                    `Contract is ${
                        status ? 'paused' : 'unpaused'
                    } successfully.`
                );
            })
            .catch((error) => props.addError(error.message));
        await getContractStatus();
        setLoading(false);
    }

    return (
        <div className="marginTop_medium">
            <Loader loading={loading} />
            {/* contract status */}
            <div className="contract_container marginBottom_medium">
                <Paper elevation={24} className="stats_card">
                    <div className="padding_sm flexBox_between">
                        <h1>Contract Status : {status}</h1>
                        <div>
                            <Button
                                size="large"
                                variant="contained"
                                className="admin_btn_left"
                                onClick={() => handlePauseContract(true)}
                                disabled={status !== 'Live'}
                            >
                                Pause
                            </Button>
                            <Button
                                size="large"
                                variant="contained"
                                className="admin_btn_right"
                                onClick={() => handlePauseContract(false)}
                                disabled={status === 'Live'}
                            >
                                Unpause
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>

            {/* governance nouce */}
            <div className="gov_container marginBottom_medium">
                <Paper elevation={24} className="stats_card">
                    <div className="padding_sm flexBox_between">
                        <h1>Current Governance period: {governance}</h1>
                    </div>
                    <div className="text_center marginBottom_small">
                        <Button
                            size="large"
                            variant="contained"
                            className="dispense_btn"
                            onClick={() => navigate(Routes.LOTTERY)}
                            disabled={status !== 'Live'}
                        >
                            View Prize Game Page
                        </Button>
                    </div>
                </Paper>
            </div>
            {/* stats card */}
            <div className="flexBox_evenly">
                <StatisticsCard
                    stats={algoInContract}
                    heading="Algos in Contract"
                    imageSrc={ImageSrc.ALGOS}
                >
                    {/* fund wallets */}
                    <div className="text_center">
                        <Button
                            size="large"
                            variant="contained"
                            className="card_btn"
                            onClick={() => {
                                setLoading(true);
                                fundCustodialWallets(
                                    props.web,
                                    props.admin_addr,
                                    OptAppID(props.selected_network),
                                    algoInContract * 1e6,
                                    props.selected_network
                                )
                                    .then(() => {
                                        setTimeout(async () => {
                                            await updateStats();
                                            setCustodialWalletData(
                                                (existing) => !existing
                                            );
                                            props.addSuccess(
                                                `Custodial wallets funded successfully.`
                                            );
                                            setLoading(false);
                                        }, TIMEOUT);
                                    })
                                    .catch((error) => {
                                        props.addError(error.message);
                                        setLoading(false);
                                    });
                            }}
                        >
                            Fund Custodial Wallets
                        </Button>
                    </div>
                </StatisticsCard>
                <StatisticsCard
                    stats={algoInCustodialWallet}
                    heading="Algos in Custodial Wallets"
                    imageSrc={ImageSrc.ALGOS}
                />
                <StatisticsCard
                    stats={optHoldingOfApp}
                    heading="OPT in Application Account"
                    imageSrc={ImageSrc.LOGO}
                />
            </div>

            <div className="marginTop_large admin_grid">
                {/* custodial wallet info */}
                <div className="row_span_5">
                    <CustodialWalletTable
                        updateCustodialWalletsData={updateCustodialWalletsData}
                    />
                </div>

                {/* generate custodial wallets */}
                <div>
                    <TextFieldCard
                        heading="Generate Custodial Wallets"
                        textfield={
                            <CustomTextField
                                error={custodialWalletNumberError}
                                key="walletAmt"
                                label="Number of Wallets"
                                variant="filled"
                                className="textfield"
                                type="number"
                                value={custodialWalletNumber || ''}
                                onChange={(event) => {
                                    setCustodialWalletNumberError('');
                                    setCustodialWalletNumber(
                                        +event.target.value
                                    );
                                }}
                                helperText={custodialWalletNumberError}
                            />
                        }
                        buttonText="Generate"
                        action={() => {
                            if (custodialWalletNumber) {
                                setLoading(true);
                                genAccounts(
                                    custodialWalletNumber,
                                    props.web,
                                    props.admin_addr,
                                    props.selected_network
                                )
                                    .then(() => {
                                        setTimeout(async () => {
                                            await updateStats();
                                            setCustodialWalletData(
                                                (existing) => !existing
                                            );
                                            props.addSuccess(
                                                `${custodialWalletNumber} Custodial wallets generated successfully.`
                                            );
                                            setLoading(false);
                                        }, TIMEOUT);
                                    })
                                    .catch((error) => {
                                        props.addError(error.message);
                                        setLoading(false);
                                    });
                            } else
                                setCustodialWalletNumberError(
                                    'Please provide number of wallet to be generated.'
                                );
                        }}
                    />
                </div>

                {/* governance address */}
                <div>
                    <TextFieldCard
                        heading="Set Governance Address"
                        textfield={
                            <CustomTextField
                                error={governanceAddrError}
                                key="governance"
                                label="Address"
                                variant="filled"
                                className="textfield"
                                value={governanceAddr}
                                onChange={(event) => {
                                    setGovernanceAddrError('');
                                    setGovernanceAddr(event.target.value);
                                }}
                                helperText={governanceAddrError}
                            />
                        }
                        buttonText={governanceAddr ? 'Update' : 'Add'}
                        action={() => {
                            if (!governanceAddr) {
                                setGovernanceAddrError('Please add an address');
                            } else {
                                localStorage.setItem(
                                    GovernanceAddr,
                                    governanceAddr
                                );
                                props.updateGovernanceAddr(governanceAddr);
                                props.addSuccess(
                                    `Governance Address Added successfully.`
                                );
                            }
                        }}
                    />
                </div>

                {/* governance timelines */}
                <div className=" row_span_5">
                    <Paper elevation={24} className="stats_card">
                        <div className="padding_sm">
                            <h1>
                                Governance Timelines
                                {globalState && (
                                    <GovernanceForm
                                        web={props.web}
                                        props={props}
                                        appGlobalState={globalState}
                                        adminAddr={props.admin_addr}
                                        network={props.selected_network}
                                        updateGovernance={() =>
                                            getGovernanceNonce()
                                        }
                                    />
                                )}
                            </h1>
                        </div>
                    </Paper>
                    <div className="grid_margin_top ">
                        <TextFieldCard
                            heading="Opt-in Optimum App and OPT ASA"
                            action={async () => {
                                setLoading(true);
                                try {
                                    await optInASA(
                                        FEE_ADDR,
                                        OptAsaID(props.selected_network),
                                        props.web
                                    ).catch((error) => {
                                        throw error;
                                    });
                                    await optInApp(
                                        FEE_ADDR,
                                        OptAppID(props.selected_network),
                                        props.web
                                    ).catch((error) => {
                                        throw error;
                                    });

                                    setTimeout(async () => {
                                        props.addSuccess(
                                            `Optimum App and OPT ASA Opted in successfully.`
                                        );
                                        setLoading(false);
                                    }, TIMEOUT);
                                } catch (error) {
                                    props.addError(error.message);
                                    setLoading(false);
                                }
                            }}
                            buttonText="OPT-IN"
                        />
                    </div>
                </div>

                {/* close custodial wallets */}
                <div>
                    <TextFieldCard
                        heading="Close Custodial Wallets"
                        action={() => {
                            setLoading(true);
                            closeCustodialWallets(
                                props.web,
                                props.selected_network,
                                props.admin_addr,
                                props.selected
                            )
                                .then(async () => {
                                    setTimeout(async () => {
                                        await updateStats();
                                        setCustodialWalletData(
                                            (existing) => !existing
                                        );
                                        props.addSuccess(
                                            `Custodial Wallets closed Successfully`
                                        );
                                        setLoading(false);
                                    }, TIMEOUT);
                                })
                                .catch((error) => {
                                    props.addError(error.message);
                                    setLoading(false);
                                });
                        }}
                        buttonText="Close"
                    />
                </div>

                {/* withdraw reward */}
                <div>
                    <TextFieldCard
                        heading="Withdraw Rewards"
                        action={() => {
                            setLoading(true);
                            withdrawRewards(
                                props.web,
                                props.selected_network,
                                props.admin_addr
                            )
                                .then(async () => {
                                    setTimeout(async () => {
                                        await updateStats();
                                        setCustodialWalletData(
                                            (existing) => !existing
                                        );
                                        props.addSuccess(
                                            `Rewards withdrawn successfully.`
                                        );
                                        setLoading(false);
                                    }, TIMEOUT);
                                })
                                .catch((error) => {
                                    props.addError(error.message);
                                    setLoading(false);
                                });
                        }}
                        buttonText="Withdraw"
                    />
                </div>

                {/* register wallets */}
                <div>
                    <TextFieldCard
                        heading="Register Custodial Wallets"
                        textfield={
                            <CustomTextField
                                error={registerError}
                                key="register"
                                label="Memo"
                                variant="filled"
                                className="textfield"
                                value={register}
                                onChange={(event) => {
                                    setRegisterError('');
                                    setRegister(event.target.value);
                                }}
                                helperText={registerError}
                            />
                        }
                        buttonText="Register"
                        action={() => {
                            if (!register) {
                                setRegisterError('Please add memo');
                            } else {
                                setLoading(true);
                                registerByCustodialWallets(
                                    props.web,
                                    register,
                                    props.selected_network,
                                    props.admin_addr,
                                    governanceAddr
                                )
                                    .then(() => {
                                        setTimeout(async () => {
                                            await updateStats();
                                            setCustodialWalletData(
                                                (existing) => !existing
                                            );
                                            props.addSuccess(
                                                `Wallets registered successfully`
                                            );
                                            setLoading(false);
                                        }, TIMEOUT);
                                    })
                                    .catch((error) => {
                                        props.addError(error.message);
                                        setLoading(false);
                                    });
                            }
                        }}
                    />
                </div>

                {/* vote */}
                <div>
                    <TextFieldCard
                        heading="Vote"
                        textfield={
                            <CustomTextField
                                error={voteError}
                                key="vote"
                                label="Vote"
                                variant="filled"
                                className="textfield"
                                value={vote}
                                onChange={(event) => {
                                    setVoteError('');
                                    setVote(event.target.value);
                                }}
                                helperText={voteError}
                            />
                        }
                        buttonText="Submit"
                        action={() => {
                            if (!vote) {
                                setVoteError('Please add your vote');
                            } else {
                                setLoading(true);
                                voteByCustodialWallets(
                                    props.web,
                                    vote,
                                    props.selected_network,
                                    props.admin_addr,
                                    governanceAddr
                                )
                                    .then(() => {
                                        setLoading(false);
                                        setTimeout(async () => {
                                            await updateStats();
                                            setCustodialWalletData(
                                                (existing) => !existing
                                            );
                                            props.addSuccess(
                                                `Your vote is registered successfully.`
                                            );
                                        }, TIMEOUT);
                                    })
                                    .catch((error) => {
                                        props.addError(error.message);
                                        setLoading(false);
                                    });
                            }
                        }}
                    />
                </div>
            </div>
            <VRFCard
                heading="VRF"
                buttonText="GET VRF NUMBER"
                action={getVRF}
                btnDisabledTwo={sendVrf}
                actionTwo={sendVRFFunc}
                buttonTextTwo="Send VRf"
             />
          
        <div>
        </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        selected: state.wallet.selected,
        address: state.wallet.address,
        error: state.feedback.error,
        selected_network: state.wallet.selected_network,
        admin_addr: state.wallet.admin_addr,
        governance_addr: state.wallet.governance_addr,
        web: state.wallet.webMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addError: (payload) => dispatch(addError(payload)),
        removeError: () => dispatch(removeError()),
        addSuccess: (payload) => dispatch(addSuccess(payload)),
        updateGovernanceAddr: (payload) =>
            dispatch(updateGovernanceAddr(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
