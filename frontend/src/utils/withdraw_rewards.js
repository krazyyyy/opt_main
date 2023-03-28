import { types } from '@algo-builder/web';
import { AppActions } from '../constants/constants.js';
const {
    tryExecuteTx,
    chunkArray,
    OptAppID,
    getCustodialWallets
} = require('./common.js');

/**
 * Returns a list of custodial wallet addresses whose balance is above 10000 ALGO.
 * Inspiration: to take back the rewards gained by wallets during governance.
 * + Each account must be whitelisted and rekeyed to the optimum app.
 * + Each account must be registered and has voted to governance.
 * + We use the indexer to query all accounts opted in & rekeyed to app
 */
async function getCustodialWalletsWithExtraBal(network, adminAddr) {
    const accounts = await getCustodialWallets(
        OptAppID(network),
        { extraBalance: true },
        network,
        adminAddr,
        200
    );

    const custodialWallets = [],
        amtsToWithdraw = [];
    for (const acc of accounts) {
        // check if there is "extra balance" in the custodial wallet
        // note: taking into account that 0.5 ALGO must be present in the wallet
        // to maintain min balance requirment and pay transaction fees
        const bal = Math.floor(acc.amount - (100e6 + 0.5e6));

        // push the address in address array, "amount we can withdraw" into another array.
        // so that we can split them individially into chunks of 4 later during withdraw.
        if (bal > 0) {
            custodialWallets.push(acc.address);
            amtsToWithdraw.push(bal);
        }
    }

    return [custodialWallets, amtsToWithdraw];
}

/**
 * Find and withdraw from each custodial wallet(s) 10000 ALGO's. Returns if enough wallets
 * are not available to withdraw from (which shouldn't happen).
 * NOTE: withdraw amount is in microAlgos
 */
async function withdrawRewardsFromCustodialWallets(
    web,
    custodialWallets,
    amtsToWithdraw,
    adminAddr,
    network
) {
    // split whole custodial wallets array & amts array into chunks of 4
    // as max 4 accounts can be passed in a tx group.
    const txAccountArrays = chunkArray(custodialWallets, 4); // pass in tx.accounts
    const txAppArgArrays = chunkArray(amtsToWithdraw, 4); // pass in tx.application_args

    // let's construct the transactions
    const txArray = [];
    for (let i = 0, j = 0; i < custodialWallets.length; i += 4, j++) {
        // in each iteration we're withdrawing rewards from 4 wallets
        txArray.push({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: adminAddr,
            appID: OptAppID(network),
            payFlags: { totalFee: 1000 + 1000 * txAccountArrays[j].length },
            accounts: txAccountArrays[j],
            appArgs: [
                AppActions.WITHDRAW_REWARDS,
                ...txAppArgArrays[j].map((arg) => `int:${arg}`)
            ]
        });
    }

    // finally assemble transactions into groups of 16. Submit each group to network
    // TODO: check the hit & miss of indexer, apprantley it's giving the updated result in
    // the "next" query. Maybe is this only because of dev mode
    const txGroups = chunkArray(txArray, 16);
    for (const grp of txGroups) {
        await tryExecuteTx(web, grp);
    }
}

/**
 * 1. Get custodial wallets with extra bal (amount allocated as rewards by the governance)
 * 2. Trigger the smart contract to withdraw these rewards from the custodial wallets back into the contract
 */
export async function withdrawRewards(web, network, adminAddr) {
    // withraw ALGO's from custodial wallets "before" withdraw. Can be called by anyone
    const [custodialWallets, amtsToWithdraw] =
        await getCustodialWalletsWithExtraBal(network, adminAddr);

    await withdrawRewardsFromCustodialWallets(
        web,
        custodialWallets,
        amtsToWithdraw,
        adminAddr,
        network
    );
}
