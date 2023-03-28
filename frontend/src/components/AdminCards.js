import { types } from '@algo-builder/web';
import React, { useEffect, useState } from 'react';
import { Paper, Button } from '@mui/material';
import { OptAppID, OptAsaID } from '../utils/common';
import CustomTextField from './CustomTextField';
import { AppActions, GlobalStateKeys } from '../constants/constants';
import { convertDateToSeconds, convertSecondsToDate } from '../constants/date';
import Loader from './Loader';

export const StatisticsCard = ({ imageSrc, stats, heading, children }) => {
    stats = stats ? stats.toString() : stats;
    return (
        <Paper elevation={24} className="stats_card">
            <div className="padding_sm">
                <div className="stats_container">
                    <div>
                        <img alt="_img" src={imageSrc} className="stats_img" />
                    </div>
                    <div>
                        <h1 className="stats_number">{stats}</h1>
                        <h2 className="stats_heading">{heading}</h2>
                    </div>
                </div>
                {children}
            </div>
        </Paper>
    );
};

export const GovernanceForm = ({
    props,
    appGlobalState,
    web,
    adminAddr,
    network,
    updateGovernance
}) => {
    const [loading, setLoading] = useState(false);
    useEffect(async () => {
        await getGovTimeslines();
    }, []);

    const [periodStart, setPeriodStart] = useState(undefined);
    const [periodEnd, setPeriodEnd] = useState(undefined);
    const [rewardDistribution, setRewardDistribution] = useState(undefined);
    const [registrationEnd, setRegistrationEnd] = useState(undefined);

    const [periodStartError, setPeriodStartError] = useState('');
    const [periodEndError, setPeriodEndError] = useState('');
    const [rewardDistributionError, setRewardDistributionError] = useState('');
    const [registrationEndError, setRegistrationEndError] = useState('');

    async function getGovTimeslines() {
        if (appGlobalState) {
            const period_start = appGlobalState.get(
                GlobalStateKeys.PERIOD_START
            );
            const period_end = appGlobalState.get(GlobalStateKeys.PERIOD_END);
            const registration_end = appGlobalState.get(
                GlobalStateKeys.REGISTRATION_END
            );
            const reward_distribution = appGlobalState.get(
                GlobalStateKeys.REWARD_DISTRIBUTION
            );
            if (
                period_start &&
                period_end &&
                registration_end &&
                reward_distribution
            ) {
                setPeriodStart(convertSecondsToDate(period_start));
                setPeriodEnd(convertSecondsToDate(period_end));
                setRegistrationEnd(convertSecondsToDate(registration_end));
                setRewardDistribution(
                    convertSecondsToDate(reward_distribution)
                );
            }
        }
    }

    async function handleSubmit() {
        const txParams = {
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: adminAddr,
            appID: OptAppID(network),
            payFlags: { totalFee: 1000 },
            appArgs: [
                AppActions.GOV_TIMELINES,
                `int:${convertDateToSeconds(periodStart)}`,
                `int:${convertDateToSeconds(rewardDistribution)}`,
                `int:${convertDateToSeconds(registrationEnd)}`,
                `int:${convertDateToSeconds(periodEnd)}`
            ],
            foreignAssets: [OptAsaID(network)]
        };

        setLoading(true);
        await web
            .executeTx([txParams])
            .then(() => {
                updateGovernance();
                setLoading(false);
                props.addSuccess(`Governance Timelines are set successfully.`);
            })
            .catch((error) => {
                setLoading(false);
                props.addError(error.message);
            });
    }

    const minDate = new Date().valueOf();

    return (
        <div>
            <Loader loading={loading} />
            <div className="form_container">
                <CustomTextField
                    error={periodStartError}
                    key="periodStart"
                    label="Period Start"
                    variant="filled"
                    className="textfield"
                    type="datetime-local"
                    value={periodStart || ''}
                    onChange={(event) => {
                        setPeriodStart(event.target.value);
                        if (new Date(event.target.value).valueOf() < minDate) {
                            setPeriodStartError(
                                'Please select future date and time.'
                            );
                        } else setPeriodStartError('');
                    }}
                    giveMargin={true}
                    helperText={periodStartError}
                />
                <CustomTextField
                    error={periodEndError}
                    key="periodEnd"
                    label="Period End"
                    variant="filled"
                    className="textfield"
                    type="datetime-local"
                    value={periodEnd || ''}
                    onChange={(event) => {
                        setPeriodEnd(event.target.value);
                        if (
                            new Date(event.target.value).valueOf() < minDate ||
                            new Date(event.target.value).valueOf() <
                                new Date(periodStart).valueOf()
                        ) {
                            setPeriodEndError(
                                'Please select future date and time.'
                            );
                        } else setPeriodEndError('');
                    }}
                    giveMargin={true}
                    helperText={periodEndError}
                />
                <CustomTextField
                    error={rewardDistributionError}
                    key="rewardDistribution"
                    label="Reward Distribution"
                    variant="filled"
                    className="textfield"
                    type="datetime-local"
                    value={rewardDistribution || ''}
                    onChange={(event) => {
                        setRewardDistribution(event.target.value);
                        if (new Date(event.target.value).valueOf() < minDate) {
                            setRewardDistributionError(
                                'Please select future date and time.'
                            );
                        } else setRewardDistributionError('');
                    }}
                    giveMargin={true}
                    helperText={rewardDistributionError}
                />

                <CustomTextField
                    error={registrationEndError}
                    key="registrationEnd"
                    label="Registration End"
                    variant="filled"
                    className="textfield"
                    type="datetime-local"
                    value={registrationEnd || ''}
                    onChange={(event) => {
                        setRegistrationEnd(event.target.value);
                        if (
                            new Date(event.target.value).valueOf() < minDate ||
                            new Date(event.target.value).valueOf() <
                                new Date(rewardDistribution).valueOf()
                        ) {
                            setRegistrationEndError(
                                'Please select future date and time.'
                            );
                        } else setRegistrationEndError('');
                    }}
                    giveMargin={true}
                    helperText={registrationEndError}
                />
                <Button
                    disabled={
                        periodStartError ||
                        periodEndError ||
                        rewardDistributionError ||
                        registrationEndError ||
                        !periodStart ||
                        !periodEnd ||
                        !registrationEnd ||
                        !rewardDistribution
                    }
                    size="large"
                    variant="contained"
                    className="card_btn"
                    onClick={handleSubmit}
                    style={{ color: 'white' }}
                >
                    Set
                </Button>
            </div>
        </div>
    );
};

export const TextFieldCard = ({
    heading,
    textfield,
    buttonText,
    action,
    btnDisabled,
    children
}) => {
    return (
        <Paper elevation={24} className="stats_card width_100">
            <div className="padding_sm">
                <h1>{heading}</h1>
                {textfield}
                <div className="text_center marginTop_medium">
                    {children ? (
                        children
                    ) : (
                        <Button
                            size="large"
                            variant="contained"
                            className="card_btn"
                            onClick={action}
                            disabled={btnDisabled}
                        >
                            {buttonText}
                        </Button>
                    )}
                </div>
            </div>
        </Paper>
    );
};

export const VRFCard = ({
    heading,
    textfield,
    buttonText,
    buttonTextTwo,
    action,
    actionTwo,
    btnDisabled,
    btnDisabledTwo,
    children
}) => {
    return (
        <Paper elevation={24} className="stats_card width_100">
            <div className="padding_sm">
                <h1>{heading}</h1>
                {textfield}
                <div className="text_center marginTop_medium">
                    {children ? (
                        children
                    ) : (
                        <Button
                            size="large"
                            variant="contained"
                            className="card_btn"
                            onClick={action}
                            disabled={btnDisabled}
                        >
                            {buttonText}
                        </Button>
                    )}
                </div>
                <div className="text_center marginTop_medium">
                    {children ? (
                        children
                    ) : (
                        <Button
                            size="large"
                            variant="contained"
                            className="card_btn"
                            onClick={actionTwo}
                            disabled={btnDisabledTwo}
                        >
                            {buttonTextTwo}
                        </Button>
                    )}
                </div>
            </div>
        </Paper>
    );
};
