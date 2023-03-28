import { types } from '@algo-builder/web';
import { AppActions } from '../constants/constants.js';
import { algodClient } from './algob.config.js';
const {
    default: algosdk,
    makeApplicationOptInTxnFromObject,
    assignGroupID
} = require('algosdk');
const { getApplicationAddress, generateAccount } = require('algosdk');
const { OptAppID, tryExecuteTx } = require('./common.js');

/**
 * 1. Generate n accounts
 * 2. Fund each account with 1 ALGO (to maintan min balance)
 * 3. Opt in by account to optimum app
 * 4. Whitelist each account
 */
export async function genAccounts(n, web, adminAddr, network) {
    if (n > 16) {
        throw new Error('Cannot generate more than 16 accounts at once');
    }

    const accts = [];
    for (let i = 0; i < n; ++i) {
        accts.push(generateAccount());
    }

    const fundAccParams = [];
    for (const acc of accts) {
        // fund each acc with 0.5 ALGO first
        fundAccParams.push({
            type: types.TransactionType.TransferAlgo,
            sign: types.SignType.SecretKey,
            fromAccountAddr: adminAddr,
            toAccountAddr: acc.addr,
            amountMicroAlgos: 0.5e6,
            payFlags: { totalFee: 1000 }
        });
    }

    await tryExecuteTx(web, fundAccParams);

    // whitelist account
    await whiteListAccounts(web, accts, network);
}

async function executeAlgodTxns(txns, network, accts) {
    // get client by network
    const client = algodClient(network);

    // assign group ID
    const grpTxns = assignGroupID(txns);

    // sign all transactions
    const signedTxns = grpTxns.map((txn, i) => {
        const signed = txn.signTxn(accts[i].sk);
        return signed;
    });

    // send all transactions to network, wait for result
    const { txId } = await client.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(client, txId, 10);
}

async function whiteListAccounts(web, accts, network) {
    const client = algodClient(network);
    const execParams = [];
    const whitelistParams = [];

    for (const acc of accts) {
        const suggestedParams = await client.getTransactionParams().do();
        suggestedParams.flatFee = true;
        suggestedParams.fee = 1000;
        execParams.push(
            makeApplicationOptInTxnFromObject({
                from: acc.addr,
                appIndex: OptAppID(network),
                suggestedParams: suggestedParams
            })
        );

        // push whitelist params
        whitelistParams.push(
            algosdk.makeApplicationCallTxnFromObject({
                from: acc.addr,
                appIndex: OptAppID(network),
                suggestedParams: suggestedParams,
                rekeyTo: getApplicationAddress(OptAppID(network)),
                appArgs: [
                    new Uint8Array(Buffer.from(AppActions.WHITELIST_ACCOUNTS))
                ]
            })
        );
    }

    // execute opt-in txns
    await executeAlgodTxns(execParams, network, accts);

    // execute whitelist txns
    await executeAlgodTxns(whitelistParams, network, accts);
}
