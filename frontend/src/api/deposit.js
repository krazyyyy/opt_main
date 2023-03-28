
const { types } = require('@algo-builder/web');
const { getApplicationAddress } = require('algosdk');
const {
    OptAsaID,
    OptAppID,
} = require('../utils/common.js');


export default async function depositFunc(web, wallet_address, algo_amt, network) {
    var raw = {
          "sender_wallet": wallet_address,
          "algo_amt": algo_amt
        }

    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      redirect: 'follow',
      headers : {
          'Content-Type' : 'application/json'
      }
    };
    console.log(getApplicationAddress(OptAppID(network)))
    let txnParams = {
            type: types.TransactionType.TransferAlgo,
            sign: types.SignType.SecretKey,
            fromAccountAddr: wallet_address,
            toAccountAddr: getApplicationAddress(OptAppID(network)),
            amountMicroAlgos: algo_amt,
            payFlags: { totalFee: 1000 }
        }
    // web.executeTx()
    let res = await tryExecuteTx(web, txnParams)
    res.then(response => response.text())
    .then(result => console.log(result))
    fetch("http://127.0.0.1:5000/blockchain/deposit", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result)
    })
    .catch(error => console.log('error', error));
  }  

async function tryExecuteTx(web, txnParams) {
  try {
      const txnParameters = Array.isArray(txnParams)
          ? txnParams
          : [txnParams];
      console.log(txnParameters)
      return await web.executeTx(txnParameters);
  } catch (e) {
      console.error('Transaction Failed', e);
      throw e;
  }
}