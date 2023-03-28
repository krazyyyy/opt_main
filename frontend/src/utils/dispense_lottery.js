import { AppActions, GlobalStateKeys } from '../constants/constants.js';
const { types } = require('@algo-builder/web');
const {
    OptAppID,
    tryExecuteTx,
    OptAsaID,
    localOPTBalances,
    FEE_ADDR,
    readAppGlobalState
} = require('./common.js');

/**
 * Returns the "lottery amount": i.e reward per week ((totalOPT * APY)/no_of_weeks_in_governance)
 */
export async function getRewardAmt(network, adminAddr) {
    const localOptBalances = await localOPTBalances(network);

    const appGlobalState = await readAppGlobalState(
        adminAddr,
        OptAppID(network),
        network
    );

    const rewardRateNumber = appGlobalState.get(GlobalStateKeys.REWARD_RATE);
    const rewardRateDecimals = appGlobalState.get(
        GlobalStateKeys.REWARD_DECIMAL
    );
    const apy =
        rewardRateDecimals === 0
            ? rewardRateNumber
            : (rewardRateNumber * 1.0) / rewardRateDecimals;

    let totalOPT = 0.0;
    for (const v of Object.values(localOptBalances)) {
        totalOPT += v;
    }

    // this would be the reward we would get after each governance period
    const reward = totalOPT * apy;
    return reward;
}

// call the contract to send lottery to the winner
// note: reward is already in microOPT (during reward calculation it's already set in local state as microOPT)
async function sendLotteryToWinnerByContract(
    web,
    adminAddr,
    network,
    feeAddress,
    winnerAddress,
    reward
) {
    const rewardToDisperse = parseInt((reward * 90) / 100); // 90% reward goes to user
    const tenPerCentReward = parseInt((reward * 10) / 100); // 10% reward goes to the fee wallet

    const txParams = {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccountAddr: adminAddr,
        appID: OptAppID(network),
        payFlags: { totalFee: 3000 },
        appArgs: [
            AppActions.DISPENSE_LOTTERY,
            `int:${rewardToDisperse}`,
            `int:${tenPerCentReward}`
        ],
        accounts: [winnerAddress, feeAddress],
        foreignAssets: [OptAsaID(network)]
    };

    await tryExecuteTx(web, txParams);
}

export async function dispenseLottery(web, adminAddr, winnerAddr, network) {
    // we need to take the winner address and the reward amount from the user here
    // and then pass it to `sendLotteryToWinnerByContract`

    const reward = await getRewardAmt(network, adminAddr);
    await sendLotteryToWinnerByContract(
        web,
        adminAddr,
        network,
        FEE_ADDR,
        winnerAddr,
        parseInt(reward)
    );
}
