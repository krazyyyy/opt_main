import React from 'react';
import { Button } from '@mui/material';
import { decodeAddress } from 'algosdk';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { TextFieldCard } from '../components/AdminCards';
import CustomTextField from '../components/CustomTextField';
import Loader from '../components/Loader';
import LotteryTable from '../components/LotteryTable';
import CustomToolTip from '../components/Tooltip';
import { GlobalStateKeys, TIMEOUT } from '../constants/constants';
import { addError, addSuccess } from '../redux/feedback_reducer';
import { OptAppID, readAppGlobalState } from '../utils/common';
import { dispenseLottery } from '../utils/dispense_lottery';
import { setGovernanceRewardRate } from '../utils/set_gov_reward_rate';

const Lottery = (props) => {
    const [winnerAddr, setWinnerAddr] = useState(null);
    const [winnerAddrError, setWinnerAddrError] = useState('');

    const [loading, setLoading] = useState(false);
    const [updateLotteryData, setUpdateData] = useState(false);

    const [rewardRate, setRewardRate] = useState(null);
    const [rewardRateError, setRateError] = useState('');

    async function getGlobalState() {
        let appGlobalState = undefined;
        await readAppGlobalState(
            props.admin_addr,
            OptAppID(props.selected_network),
            props.selected_network
        )
            .then((res) => {
                appGlobalState = res;
            })
            .catch((error) => {
                props.addError(error.message);
            });
        return appGlobalState;
    }

    async function getRewardRate() {
        const appGlobalState = await getGlobalState();
        if (appGlobalState) {
            let rate = appGlobalState.get(GlobalStateKeys.REWARD_RATE) ?? 0;
            let decimal =
                appGlobalState.get(GlobalStateKeys.REWARD_DECIMAL) ?? 0;
            setRewardRate(decimal <= 100 ? rate : (rate * 100) / decimal);
        }
    }

    useEffect(() => {
        getRewardRate();
    }, []);

    async function handleDispenseClick() {
        try {
            if (!winnerAddr) {
                setWinnerAddrError('Please input Winner Address');
                return;
            }
            if (!rewardRate) {
                setRateError('Please input Reward Rate.');
                return;
            }

            const globalState = await getGlobalState();
            const lastDispenseTS = globalState.get(
                GlobalStateKeys.LAST_LOTTERY_DISPENSE_TS
            );
            // ensure atleast 23h b/w consecutive lottery dispersals
            if (lastDispenseTS && moment().unix() - lastDispenseTS < 82800) {
                throw new Error('Last Dispense occured in less than 23 Hours.');
            }
            const addr = decodeAddress(winnerAddr);
            setLoading(true);
            dispenseLottery(
                props.web,
                props.admin_addr,
                winnerAddr,
                props.selected_network
            )
                .then(() => {
                    setUpdateData(true);
                    setTimeout(async () => {
                        props.addSuccess(`Prize Game is drawn successfully.`);
                        setLoading(false);
                    }, TIMEOUT);
                })
                .catch((error) => {
                    props.addError(error.message);
                    setLoading(false);
                });
        } catch (error) {
            props.addError(error.message);
            setLoading(false);
        }
    }

    return (
        <div className="margin_medium ">
            <Loader loading={loading} />
            <div className="flex_row">
                <div className="margin_right_med" style={{ flex: 1 }}>
                    <div>
                        <TextFieldCard
                            heading="Governance Reward Rate"
                            textfield={
                                <CustomTextField
                                    error={rewardRateError}
                                    key="rewardAmt"
                                    label="Rate (%)"
                                    variant="filled"
                                    className="textfield"
                                    type="number"
                                    value={rewardRate || ''}
                                    onChange={(event) => {
                                        setRateError('');
                                        setRewardRate(+event.target.value);
                                    }}
                                    helperText={rewardRateError}
                                />
                            }
                            buttonText="Set"
                            action={() => {
                                try {
                                    if (rewardRate) {
                                        // ensure max reward rate is <= 0.2% for the week
                                        if (rewardRate > 0.2) {
                                            throw new Error(
                                                'Maximum reward rate can be 0.2%'
                                            );
                                        }
                                        setLoading(true);
                                        let rate = rewardRate;
                                        const rateString = `${rewardRate}`;
                                        let decimalLength = 0;
                                        if (
                                            rateString.split('.')?.[1]?.length
                                        ) {
                                            rate = rateString;
                                            rate = parseInt(
                                                rate.replace('.', '')
                                            );
                                            decimalLength =
                                                rateString.split('.')[1].length;
                                        } else {
                                            decimalLength = 0;
                                        }

                                        const decimalPoints =
                                            decimalLength > 0
                                                ? Math.pow(
                                                      10,
                                                      decimalLength + 2
                                                  )
                                                : 100;

                                        setGovernanceRewardRate(
                                            props.web,
                                            props.admin_addr,
                                            props.selected_network,
                                            rate,
                                            decimalPoints
                                        )
                                            .then(() => {
                                                setTimeout(async () => {
                                                    props.addSuccess(
                                                        `Reward Rate of ${rewardRate}% for current governance period is successfully set.`
                                                    );
                                                    setLoading(false);
                                                }, TIMEOUT);
                                            })
                                            .catch((error) => {
                                                props.addError(error.message);
                                                setLoading(false);
                                            });
                                    } else
                                        setRateError(
                                            'Please provide reward rate for current governance period.'
                                        );
                                } catch (error) {
                                    props.addError(error.message);
                                    setLoading(false);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <div className="margin_block_med">
                            <TextFieldCard
                                heading="Dispense Prize Game"
                                textfield={
                                    <CustomTextField
                                        error={winnerAddrError}
                                        key="winnerAddr"
                                        label="Winner Address"
                                        variant="filled"
                                        className="textfield"
                                        value={winnerAddr}
                                        onChange={(event) => {
                                            setWinnerAddr('');
                                            setWinnerAddr(event.target.value);
                                        }}
                                        helperText={winnerAddrError}
                                    />
                                }
                            >
                                <CustomToolTip>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        className="card_btn"
                                        onClick={handleDispenseClick}
                                    >
                                        Dispense
                                    </Button>
                                </CustomToolTip>
                            </TextFieldCard>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 2 }}>
                    <LotteryTable updateData={updateLotteryData} />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        error: state.feedback.error,
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

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
