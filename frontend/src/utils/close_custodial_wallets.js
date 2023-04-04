import { types } from '@algo-builder/web';
import { AppActions } from '../constants/constants.js';
import { algodClient } from './algob.config.js';
const {
    tryExecuteTx,
    chunkArray,
    OptAppID,
    executeRekeyedTx,
    getCustodialWallets
} = require('./common.js');
const { default: algosdk } = require('algosdk');

/**
 * Returns a list of custodial wallet addresses whose balance is above 10000 ALGO.
 * Inspiration: to take back the rewards gained by wallets during governance.
 * + Each account must be whitelisted and rekeyed to the optimum app.
 * + Each account must be registered and has voted to governance.
 * + We use the indexer to query all accounts opted in & rekeyed to app
 */
async function getCustodialWalletsToClose(network, adminAddr) {
    const accounts = await getCustodialWallets(
        OptAppID(network),
        undefined,
        network,
        adminAddr,
        200
    );
    const custodialWallets = [];
    for (const acc of accounts) {
        // check if there is "residual balance" in the custodial wallet (< 5 ALGO)
        const bal = Math.floor(acc.amount);
        if (bal < 5e6) {
            custodialWallets.push(acc.address);
        }
    }

    return custodialWallets;
}

/**
 * Find and withdraw from each custodial wallet(s) 10000 ALGO's. Returns if enough wallets
 * are not available to withdraw from (which shouldn't happen).
 * NOTE: withdraw amount is in microAlgos
 */
async function _closeCustodialWallets(
    web,
    custodialWallets,
    adminAddr,
    network,
    selectedWalletType
) {
    // split whole custodial wallets array into chunks of 4
    // as max 4 accounts can be passed in a tx group.
    const txAccountArrays = chunkArray(custodialWallets, 4); // pass in tx.accounts

    // 1. rekey all custodial wallets from contract -> admin
    const rekeyTxArray = [];
    for (let i = 0, j = 0; i < custodialWallets.length; i += 4, j++) {
        // in each iteration we're withdrawing rewards from 4 wallets
        rekeyTxArray.push({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: adminAddr,
            appID: OptAppID(network),
            payFlags: { totalFee: 1000 + 1000 * txAccountArrays[j].length },
            accounts: txAccountArrays[j],
            appArgs: [AppActions.CLOSE_CUSTODIAL_WALLETS]
        });
    }

    // finally assemble transactions into groups of 16. Submit each group to network
    const rekeyTxGroups = chunkArray(rekeyTxArray, 16);

    for (const grp of rekeyTxGroups) {
        await tryExecuteTx(web, grp);
    }

    const client = algodClient(network);

    // 2. clear wallet state (clear tx appl call)
    const clearTxArray = [];
    for (let i = 0; i < custodialWallets.length; i++) {
        const suggestedParams = await client.getTransactionParams().do();
        suggestedParams.flatFee = true;
        suggestedParams.fee = 1000;

        // in each iteration we're withdrawing rewards from 4 wallets
        clearTxArray.push(
            algosdk.makeApplicationClearStateTxnFromObject({
                from: custodialWallets[i],
                suggestedParams: suggestedParams,
                appIndex: OptAppID(network)
            })
        );
    }

    const clearTxGroups = chunkArray(clearTxArray, 16);
    for (const grp of clearTxGroups) {
        await executeRekeyedTx(web, grp, adminAddr, selectedWalletType);
    }

    // 3. close the wallet
    const closeTxnArray = [];
    for (let i = 0; i < custodialWallets.length; i++) {
        const suggestedParams = await client.getTransactionParams().do();
        suggestedParams.flatFee = true;
        suggestedParams.fee = 1000;

        closeTxnArray.push(
            algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: custodialWallets[i],
                suggestedParams: suggestedParams,
                closeRemainderTo: adminAddr,
                amount: 0,
                to: custodialWallets[i]
            })
        );
    }

    const closeTxGroups = chunkArray(closeTxnArray, 16);
    for (const grp of closeTxGroups) {
        await executeRekeyedTx(web, grp, adminAddr, selectedWalletType);
    }
}

/**
 * 1. Get custodial wallets with extra bal ( < 5 ALGO )
 * 2. Trigger the smart contract to completely withdraw these algos from the custodial wallets back into the contract
 */
export async function closeCustodialWallets(
    web,
    network,
    adminAddr,
    selectedWalletType
) {
    const custodialWallets = await getCustodialWalletsToClose(
        network,
        adminAddr
    );

    await _closeCustodialWallets(
        web,
        custodialWallets,
        adminAddr,
        network,
        selectedWalletType
    );
}
