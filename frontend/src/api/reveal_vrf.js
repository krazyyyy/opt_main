
export default async function reveal_vrf_number(wallet_address) {

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
      const response = await fetch("/blockchain/disperse_lottery/vrf_randomizer/reveal_vrf_number", requestOptions);
      const result = await response.text();
      return result;
    } catch (error) {
      return error;
    }
  }
  