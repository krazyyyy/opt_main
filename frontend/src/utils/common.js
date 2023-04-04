import { types } from '@algo-builder/web';
import {
    GlobalStateKeys,
    LocalStateKeys,
    NetworkArray,
    Wallet
} from '../constants/constants';
import { indexerClient } from './algob.config';
const {
    getApplicationAddress,
    assignGroupID,
    encodeUnsignedTransaction
} = require('algosdk');

let OptimumASA = {"mainnet":{"timestamp":1672621838734,"metadata":{},"asa":{"OptimumASA":{"creator":"2UBZKFR6RCZL7R24ZG327VKPTPJUPFM6WTG7PJG2ZJLU234F5RGXFLTAKA","txId":"2WSA2INHLLNW7JI6NPZPWX7WKG47NKLTYGGRQDKV6WMTFHXS4F6A","assetIndex":996657698,"confirmedRound":25969935,"assetDef":{"total":"10000000000000000","decimals":6,"unitName":"OPT","url":"https://<name>.com","metadataHash":"12312442142141241244444411111133","note":"Algorand governance Optimum ASA","manager":null,"reserve":null,"freeze":null,"clawback":null,"defaultFrozen":false,"name":"OptimumASA"},"deleted":false}},"ssc":{},"dLsig":{}}}
let OptimumApp = {"mainnet":{"timestamp":1672621846342,"metadata":{},"asa":{},"ssc":{"Optimum App":{"1672621846":{"creator":"2UBZKFR6RCZL7R24ZG327VKPTPJUPFM6WTG7PJG2ZJLU234F5RGXFLTAKA","txId":"5RDBACFR3ZEN7ZHJIFZAXBTZERWSYOV2GAY7IQXOVHDKRCKW2REA","confirmedRound":25969937,"appID":996657780,"applicationAccount":"I6AVUENYYJCIYONJCEYFSK3LNYUKASDLFQGGIKQDN3UU4DMIPPUEDB4CTA","timestamp":1672621846,"deleted":false}}},"dLsig":{}}}

async function readAppLocalState(account, appID, network) {
    const accountInfoResponse = await indexerClient(network)
        .lookupAccountByID(account)
        .do();

    for (const app of accountInfoResponse.account['apps-local-state']) {
        if (app.id === appID) {
            let localStateMap = new Map();
            if (app['key-value']) {
                localStateMap = decodeState(app[`key-value`]);
            }
            return localStateMap;
        }
    }
    return undefined;
}

async function executeRekeyedTx(
    web,
    txnParameters,
    authAddr,
    selectedWalletType
) {
    try {
        const txns = [];
        const groupTxn = assignGroupID(txnParameters);
        for (const txn of groupTxn) {
            if (selectedWalletType === Wallet.ALGOSIGNER) {
                txns.push({
                    txn: Buffer.from(encodeUnsignedTransaction(txn)).toString(
                        'base64'
                    ),
                    signers: [authAddr],
                    authAddr: authAddr
                });
            } else {
                txns.push({
                    txn: txn,
                    signers: authAddr
                });
            }
        }

        if (selectedWalletType === Wallet.ALGOSIGNER) {
            const signTxns = await web.signTransaction(txns);
            const txInfo = await web.sendGroupTransaction(signTxns);
            await web.waitForConfirmation(txInfo.txId);
        } else {
            const txnsGroup = txns.map((v) => v.txn);
            const signTxns = await web.connector.signTransaction(
                txnsGroup.map((txn) => txn.toByte()),
                {
                    overrideSigner: authAddr
                }
            );

            const Uint8ArraySignedTx = signTxns?.map((stxn) => stxn.blob);
            await web.sendAndWait(Uint8ArraySignedTx);
        }
    } catch (e) {
        console.error('Rekeyed Transaction Failed', e);
        throw e;
    }
}

async function tryExecuteTx(web, txnParams) {
    try {
        const txnParameters = Array.isArray(txnParams)
            ? txnParams
            : [txnParams];
        return await web.executeTx(txnParameters);
    } catch (e) {
        console.error('Transaction Failed', e);
        throw e;
    }
}

async function getGovernanceNonce(adminAddr, network) {
    const appGlobalState = await readAppGlobalState(
        adminAddr,
        OptAppID(network),
        network
    );

    // during first governance period, simply return the algoAmt
    const governanceNonce =
        appGlobalState.get(GlobalStateKeys.GOVERNANCE_NONCE) ?? 0;
    return governanceNonce;
}

/**
 * Returns a list of custodial wallet addresses with a particular deposit amount.
 * Each account must be whitelisted and rekeyed to the optimum app.
 * + We use the indexer to query all accounts opted in & rekeyed to app,
 * and then we filter according to local state (whitelisted == 1, amt == depositAmt, register status, vote status)
 */
async function getCustodialWallets(
    optAppID,
    config,
    network,
    adminAddr,
    limit = 100,
    getNextToken = false,
    nextTokenFromComp
) {
    let nextToken = nextTokenFromComp;
    const custodialWallets = [];
    await (async () => {
        while (custodialWallets.length < limit) {
            let response = await indexerClient(network)
                .searchAccounts()
                .applicationID(OptAppID(network))
                .authAddr(getApplicationAddress(OptAppID(network)))
                .nextToken(nextToken)
                .do();
            let transactions = response['accounts'];
            if (transactions.length) {
                nextToken = response['next-token'];
                for (const acc of transactions) {
                    const localState = await readAppLocalState(
                        acc.address,
                        optAppID,
                        network
                    );
                    if (localState === undefined) {
                        continue;
                    }

                    // each wallet must be whitelistest irrespectively
                    const whitelisted = localState.get(
                        LocalStateKeys.WHITELISTED
                    );
                    let shouldPush = true;
                    if (whitelisted !== 1) {
                        shouldPush = false;
                    }

                    // check for all keys passed in config, if their values match
                    // if anyone doesn't, we don't push that address
                    if (config) {
                        for (const key in config) {
                            // for withdraw rewards
                            if (key === 'extraBalance') {
                                // note: taking into account that 0.5 ALGO must be present in the wallet
                                // to maintain min balance requirment and pay transaction fees
                                const bal = Math.floor(
                                    acc.amount - (100e6 + 0.5e6)
                                );

                                if (bal <= 0) {
                                    shouldPush = false;
                                }
                            } else {
                                const v = localState.get(key);

                                /*
                                 * Logic: If boolean is passed against "registered" & "voted", then
                                 * + if true, it means the value "must be equal to governance nonce", i.e registered/voted
                                 * + if false, it means the value "must be LESS THAN governance nonce" , i.e NOT registered/voted
                                 */
                                if (
                                    key === 'registered' ||
                                    (key === 'voted' &&
                                        typeof config[key] === 'boolean')
                                ) {
                                    const governanceNonce =
                                        await getGovernanceNonce(
                                            adminAddr,
                                            network
                                        );
                                    if (
                                        config[key] === true &&
                                        v !== governanceNonce
                                    ) {
                                        shouldPush = false;
                                        break;
                                    }

                                    if (
                                        config[key] === false &&
                                        v >= governanceNonce
                                    ) {
                                        shouldPush = false;
                                        break;
                                    }
                                } else {
                                    if (v !== config[key]) {
                                        shouldPush = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (shouldPush === true) {
                        // need all information
                        if (!config) {
                            custodialWallets.push(acc);
                        } else {
                            custodialWallets.push(acc.address);
                        }
                    }
                }
            } else {
                nextToken = undefined;
                break;
            }
        }
    })().catch((e) => {
        console.log(e);
    });

    if (getNextToken) {
        return { custodialWallets, nextToken: nextToken };
    }
    return custodialWallets;
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}

function decodeState(state) {
    const stateMap = new Map();
    for (const g of state) {
        const key = Buffer.from(g.key, 'base64').toString();
        if (g.value.type === 1) {
            stateMap.set(key, g.value.bytes);
        } else {
            stateMap.set(key, g.value.uint);
        }
    }
    return stateMap;
}

async function readAppGlobalState(creator, appID, network) {
    const appInfoResponse = await indexerClient(network)
        .lookupApplications(appID)
        .do();

    let globalStateMap = new Map();
    globalStateMap = decodeState(
        appInfoResponse.application.params['global-state']
    );
    return globalStateMap;
}

// retuns an object containing the addresses + local_opt_balance for all accounts (accounts who deposited and got some OPT)
// eg. { <addr1>: <amt1> , ..}
async function localOPTBalances(network) {
    const accounts = await indexerClient(network)
        .searchAccounts()
        .applicationID(OptAppID(network))
        .do();

    let localOptBalances = {};
    for (const acc of accounts.accounts) {
        const localState = await readAppLocalState(
            acc.address,
            OptAppID(network),
            network
        );
        if (localState === undefined) {
            continue;
        }

        // local OPT in user state
        const localOptAmount = localState.get('local_opt_amt');
        if (localOptAmount && localOptAmount > 0) {
            localOptBalances[acc.address] = localOptAmount;
        }
    }

    return localOptBalances;
}

async function localOPTRewardAmt(network) {
    const accounts = await indexerClient(network)
        .searchAccounts()
        .applicationID(OptAppID(network))
        .do();

    let localOptRewardData = [];
    for (const acc of accounts.accounts) {
        const localState = await readAppLocalState(
            acc.address,
            OptAppID(network),
            network
        );

        if (localState === undefined) {
            continue;
        }

        const localOptRewardAmount = localState.get('local_opt_reward_amt');
        const localOptAmount = localState.get('local_opt_amt');
        localOptRewardData.push({
            address: acc.address,
            stake:
                localOptAmount && localOptAmount > 0
                    ? localOptAmount / 1e6
                    : 'Nil',
            reward:
                localOptRewardAmount && localOptRewardAmount > 0
                    ? localOptRewardAmount / 1e6
                    : 'Nil'
        });
    }

    return localOptRewardData;
}

async function getAssetHolding(accountAddress, assetID, network) {
    const accountInfo = await indexerClient(network)
        .lookupAccountByID(accountAddress)
        .do();

    console.log("account info***", accountInfo)

    if (accountInfo?.account?.assets) {
        for (const asset of accountInfo.account.assets) {
            if (asset['asset-id'] === assetID) {
                return asset;
            }
        }
    }
    return undefined;
}

async function getContractAlgoHolding(network) {
    const appAccountInfo = await indexerClient(network)
        .lookupAccountByID(getApplicationAddress(OptAppID(network)))
        .do();

    return appAccountInfo.account.amount / 1e6;
}

async function isApplicationOpted(accountAddress, appID, network) {
    const accountInfo = await indexerClient(network)
        .lookupAccountAppLocalStates(accountAddress)
        .do();

    if (accountInfo?.['apps-local-states']) {
        for (const app of accountInfo['apps-local-states']) {
            if (app['id'] === appID) {
                return true;
            }
        }
    }
    return false;
}

async function optInApp(senderAddr, appID, web) {
    try {
        const execParam = {
            type: types.TransactionType.OptInToApp,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAddr,
            appID: appID,
            payFlags: { totalFee: 1000 }
        };
        await tryExecuteTx(web, execParam);
    } catch (error) {
        throw error;
    }
}

async function optInASA(senderAddr, assetID, web) {
    try {
        const execParam = {
            type: types.TransactionType.OptInASA,
            sign: types.SignType.SecretKey,
            fromAccountAddr: senderAddr,
            assetID: assetID,
            payFlags: { totalFee: 1000 }
        };
        await tryExecuteTx(web, execParam);
    } catch (error) {
        throw error;
    }
}

const networkKey = (network) => {
    switch (network) {
        case NetworkArray[0]:
            return 'mainnet';
        case NetworkArray[1]:
            return 'testnet';
        case NetworkArray[3]:
            return 'default';
        default:
            break;
    }
};

const OptAsaID = (network) => {
    try{
        return OptimumASA[networkKey(network)].asa.OptimumASA.assetIndex;
    } catch {
        return JSON.parse(OptimumASA)[network.toLowerCase()].asa.OptimumASA.assetIndex
    }



};
const OptAppID = (network) => {

    try {
        return Object.values(
            OptimumApp[networkKey(network)].ssc['Optimum App']
        )[0].appID;
        
    } catch {
        return Object.values(
            JSON.parse(OptimumApp)[network.toLowerCase()].ssc['Optimum App']
        )[0].appID;
    }
};

const TotalOPTMinted = (network) => {
    return JSON.parse(OptimumASA.replace("module.exports = ", ""))[network.toLowerCase()].asa.OptimumASA.JSON.parse(OptimumASA.replace("module.exports = ", ""))[network.toLowerCase()].asa.OptimumASA.assetIndex.total
    // return OptimumASA[networkKey(network)].asa.OptimumASA.assetDef
    //     .total;
};

const FEE_ADDR = 'EW4VAAYXIZ7ZAODYELMY5ZD335QYRAQAP6N527DIJYBLL52UVREDC4FROI';
const WEEKS_IN_GOVERNANCE_PERIOD = 13;

// here we will generate 10 accounts. Change this no. if you want to generate more accounts
const GEN_ACCOUNTS_CNT = 10;
export {
    tryExecuteTx,
    GEN_ACCOUNTS_CNT,
    getCustodialWallets,
    chunkArray,
    readAppLocalState,
    readAppGlobalState,
    getAssetHolding,
    getContractAlgoHolding,
    OptAsaID,
    OptAppID,
    getGovernanceNonce,
    FEE_ADDR,
    localOPTBalances,
    WEEKS_IN_GOVERNANCE_PERIOD,
    localOPTRewardAmt,
    isApplicationOpted,
    decodeState,
    TotalOPTMinted,
    executeRekeyedTx,
    optInASA,
    optInApp
};
