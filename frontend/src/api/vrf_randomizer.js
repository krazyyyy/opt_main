
export default async function vrf_randomizer(wallet_address) {

    var raw = {
      "sender_wallet": wallet_address
    };
  
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(raw),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/blockchain/disperse_lottery/vrf_randomizer", requestOptions);
      const result = await response.text();
      return result;
    } catch (error) {
      return error;
    }
  }
  