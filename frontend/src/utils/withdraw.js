/* global BigInt */
import {
    AppActions,
    GlobalStateKeys
} from '../constants/constants.js';
import { indexerClient } from './algob.config.js';
const { types } = require('@algo-builder/web');
const { getApplicationAddress } = require('algosdk');
const {
    readAppGlobalState,
    tryExecuteTx,
    getCustodialWallets,
    chunkArray,
    OptAsaID,
    OptAppID,
    getAssetHolding
} = require('./common.js');

const TEN_BILLION = 10000000000000000n;

export async function withdraw(
    web,
    senderAcc,
    feeAddress,
    optAmt,
    network,
    adminAddr
) {
    const algoWithdrawAmount = await computeAlgoWithdrawAmtFromOPT(
        adminAddr,
        OptAppID(network),
        OptAsaID(network),
        optAmt,
        network
    ); // algoWithdrawAmount will be in microAlgo's

    // withraw ALGO's from custodial wallets "before" withdraw. Can be called by anyone
    await withdrawFromCustodialWallets(
        web,
        senderAcc,
        OptAppID(network),
        algoWithdrawAmount,
        network
    );

    // withdraw ALGO from the contract, submit OPT
    const withdrawTxGroup = [
        {
            type: types.TransactionType.TransferAsset,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            toAccountAddr: getApplicationAddress(OptAppID(network)),
            amount: optAmt * 1e6,
            assetID: OptAsaID(network),
            payFlags: { totalFee: 1000 }
        },
        {
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAcc,
            appID: OptAppID(network),
            payFlags: { totalFee: 3000 },
            appArgs: [AppActions.EXCHANGE],
            foreignAssets: [OptAsaID(network)],
            accounts: [feeAddress]
        }
    ];
    await tryExecuteTx(web, withdrawTxGroup);
}

/**
 * Computes ALGO amount to withdraw from the custodial wallets, depending on the OPT we
 * will submit, using the current exchange rate.
 */
export async function computeAlgoWithdrawAmtFromOPT(
    adminaddr,
    optAppID,
    optASAID,
    optAmt,
    network
) {
    const appAccAddr = getApplicationAddress(optAppID);
    const optHoldingOfApp = await getAssetHolding(
        appAccAddr,
        optASAID,
        network
    );

    const optAccInfo = await indexerClient(network)
        .lookupAccountByID(appAccAddr)
        .do();

    const appGlobalState = await readAppGlobalState(
        adminaddr,
        optAppID,
        network
    );
    // acc balance + custodial deposit - minBalance
    const optAppAlgoBalance =
        optAccInfo.account.amount +
        (appGlobalState.get(GlobalStateKeys.CUSTODIAL_DEPOSIT) ?? 0) -
        1e6;
    if (optHoldingOfApp.amount === TEN_BILLION) {
        return optAmt * 1e6; // 1:1 exchange rate
    } else {
        if (TEN_BILLION - BigInt(optHoldingOfApp.amount) === 0) {
            throw new Error('Please deposit Algos to get OPT.');
        }
        // i think instead of * 1e6 we should directly fix at source
        const amt =
            (BigInt(optAmt * 1e6) * (BigInt(optAppAlgoBalance))) /
            (TEN_BILLION - BigInt(optHoldingOfApp.amount));
        return Math.round(Number(amt));
    }
}

/**
 * Find and withdraw from each custodial wallet(s) 10000 ALGO's. Returns if enough wallets
 * are not available to withdraw from (which shouldn't happen).
 * NOTE: withdraw amount is in microAlgos
 */
async function withdrawFromCustodialWallets(
    web,
    senderAcc,
    optAppID,
    withdrawAmt,
    network
) {
    const appAccAddr = getApplicationAddress(optAppID);
    const optAccInfo = await indexerClient(network)
        .lookupAccountByID(appAccAddr)
        .do();
    if (optAccInfo.account.amount > withdrawAmt) {
        return;
    }

    const reqWallets = Math.ceil(
        (withdrawAmt - optAccInfo.account.amount) / 10000e6
    );

    // extract custodial wallets from indexer, from which we will withdraw 10000 ALGO's
    const custodialWalletsOrig = await getCustodialWallets(
        optAppID,
        {
            deposited: 10000
        },
        network
    );

    if (reqWallets !== 0 && custodialWalletsOrig.length < reqWallets) {
        throw new Error(
            `Not enough wallets to withdraw from. Required ${reqWallets} but got ${custodialWalletsOrig.length}. Please generate more accounts`
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
            fromAccountAddr: senderAcc,
            appID: optAppID,
            payFlags: { totalFee: 1000 + (1000 * txAccountArrays[j].length) },
            accounts: txAccountArrays[j],
            appArgs: [AppActions.CUSTODIAL_WITHDRAW]
        });
    }

    // finally assemble transactions into groups of 16. Submit each group to network
    const txGroups = chunkArray(txArray, 16);
    for (const grp of txGroups) {
        await tryExecuteTx(web, grp);
    }
}
