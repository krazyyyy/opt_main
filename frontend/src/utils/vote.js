import { types } from '@algo-builder/web';
import { AppActions } from '../constants/constants.js';
const {
    tryExecuteTx,
    getCustodialWallets,
    chunkArray,
    OptAppID
} = require('./common.js');

/**
 * Find and vote by each custodial wallets (which haven't voted before) for algorand governance.
 */
// `af/gov1:j[5,"a"]`;
export async function voteByCustodialWallets(
    web,
    memo,
    network,
    adminAddr,
    governanceAddr
) {
    // extract custodial wallets from indexer, which we will fund
    const custodialWallets = await getCustodialWallets(
        OptAppID(network),
        {
            registered: true,
            voted: false
        },
        network,
        adminAddr,
        200
    );

    // split whole custodial wallets array into chunks of 3
    // as max 4 accounts can be passed in a tx group and we need
    // the last one as the governance address
    const txAccountArrays = chunkArray(custodialWallets, 3);

    // after getting wallets, let's construct the transactions
    const txArray = [];
    for (let i = 0, j = 0; i < custodialWallets.length; i += 3, j++) {
        // in each iteration we're funding 4 wallets
        txArray.push({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: adminAddr,
            appID: OptAppID(network),
            payFlags: { totalFee: 1000 + 1000 * txAccountArrays[j].length },
            accounts: [...txAccountArrays[j], governanceAddr], // append gov address
            appArgs: [AppActions.VOTE, `addr:${governanceAddr}`, `str:${memo}`]
        });
    }

    // finally assemble transactions into groups of 16. Submit each group to network
    const txGroups = chunkArray(txArray, 16);
    for (const grp of txGroups) {
        await tryExecuteTx(web, grp);
    }
}
