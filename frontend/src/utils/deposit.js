/* global BigInt */

import {
    AppActions,
    GlobalStateKeys,
} from '../constants/constants.js';
const { types } = require('@algo-builder/web');
const {
    tryExecuteTx,
    getCustodialWallets,
    chunkArray,
    OptAsaID,
    OptAppID,
    readAppGlobalState,
    getAssetHolding,
    isApplicationOpted
} = require('./common.js');
const { getApplicationAddress } = require('algosdk');

export async function expectedOPTAmount(algoAmt, network, adminAddr) {
    // console.log(encodeForSigning(OptAppID(network)))
    // console.log(getApplicationAddress())
    // define bellow to const appOPTHolding = await getAssetHolding -- if needed

    // const appAccountInfo = await indexerClient(network)
    // .lookupAccountByID(getApplicationAddress(OptAppID(network)))
    // .do();
    
    // const appOPTHolding = await getAssetHolding(
    //     getApplicationAddress(OptAppID(network)),
    //     OptAsaID(network),
    //     network
    // );


    const appGlobalState = await readAppGlobalState(
        adminAddr,
        OptAppID(network),
        network
    );
    

    // during first governance period, simply return the algoAmt
    const governanceNonce =
        appGlobalState.get(GlobalStateKeys.GOVERNANCE_NONCE) ?? 0;
    if (governanceNonce <= 1) {
        return algoAmt / 1e6;
    }

    // const globalCustodialDeposit =
    //     appGlobalState.get(GlobalStateKeys.CUSTODIAL_DEPOSIT) ?? 0;

    /*
    Below is the dynamic exchange rate - but since we're keeping the exchange rate static
    for each period now, we're going to use the static exchange rate (for each respective period)

    const num =
        BigInt(algoAmt) *
        ((TEN_BILLION - BigInt(appOPTHolding.amount)) / 1000000n);
    const den =
        BigInt(appAccountInfo.account.amount) +
        BigInt(globalCustodialDeposit) -
        BigInt(ACCOUNT_MIN_BALANCE);
    */

    const num =
        BigInt(algoAmt) *
        (BigInt(appGlobalState.get(GlobalStateKeys.GLOBAL_TOTAL_OPT_DISPERSED_AT_GOVERNANCE) ?? 0));
    
    const den = BigInt(appGlobalState.get(GlobalStateKeys.GLOBAL_APP_BALANCE_AT_GOVERNANCE) ?? 0);

    if (num === 0n) {
        return 0;
    }

    const expectedAmt = Number(num / den) / 1e6;
    return expectedAmt;
}

export async function deposit(web, senderAcc, algoAmt, network, adminAddr) {
    const userASAHolding = await getAssetHolding(
        senderAcc,
        OptAsaID(network),
        network
    );

    const isAppOpted = await isApplicationOpted(
        senderAcc,
        OptAppID(network),
        network
        );

    

    if (!isAppOpted) {
        const optInAppParams = {
            type: types.TransactionType.OptInToApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            appID: OptAppID(network),
            payFlags: { totalFee: 1000 }
        };
        await tryExecuteTx(web, optInAppParams);
    }

    // opt in to optimum ASA first (so that sender can receive OPT)
    if (userASAHolding === undefined) {
        const optInASAParams = {
            type: types.TransactionType.OptInASA,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            assetID: OptAsaID(network),
            payFlags: { totalFee: 1000 }
        };
        await tryExecuteTx(web, optInASAParams);
    }

    // deposit ALGO to the contract, receive OPT
    const depositTxGroup = [
        {
            type: types.TransactionType.TransferAlgo,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            toAccountAddr: getApplicationAddress(OptAppID(network)),
            amountMicroAlgos: algoAmt,
            payFlags: { totalFee: 1000 }
        },
        {
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            appID: OptAppID(network),
            payFlags: { totalFee: 2000 },
            appArgs: [AppActions.EXCHANGE],
            foreignAssets: [OptAsaID(network)]
        }
    ];
    await tryExecuteTx(web, depositTxGroup);
}

/**
 * Find and fund custodial wallets with 10000 ALGO increments. Returns if enough wallets
 * are not available.
 * NOTE: deposit amount is in microAlgos
 */
export async function fundCustodialWallets(
    web,
    senderAcc,
    optAppID,
    depositAmt,
    network
) {
    // extract custodial wallets from indexer, which we will fund
    const custodialWalletsOrig = await getCustodialWallets(
        optAppID,
        {
            deposited: 0
        },
        network
    );

    // TODO: ask about remainder amt (atm we just leave it in the optimum app)
    // const reqWallets = depositAmt/10000 + (depositAmt % 10000 !== 0 ? 1 : 0);

    const reqWallets = Math.round(depositAmt / 10000e6);
    if (custodialWalletsOrig.length < reqWallets) {
        throw new Error(
            `Not enough wallets to fund. Required ${reqWallets} but got ${custodialWalletsOrig.length}. Please generate more accounts`
        );
    }

    // get only the addresses we need.
    const custodialWallets = custodialWalletsOrig.slice(0, reqWallets);

    // split whole custodial wallets array into chunks of 4
    // as max 4 accounts can be passed in a tx group.
    const txAccountArrays = chunkArray(custodialWallets, 4);

    // after getting wallets, let's construct the transactions
    const txArray = [];
    for (let i = 0, j = 0; i < reqWallets; i += 4, j++) {
        // in each iteration we're funding 4 wallets
        txArray.push({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc, // addr
            appID: optAppID,
            payFlags: { totalFee: 1000 + 1000 * txAccountArrays[j].length },
            accounts: txAccountArrays[j],
            appArgs: [AppActions.CUSTODIAL_DEPOSIT]
        });
    }

    // finally assemble transactions into groups of 16. Submit each group to network
    const txGroups = chunkArray(txArray, 16);
    for (const grp of txGroups) {
        await tryExecuteTx(web, grp);
    }
}
