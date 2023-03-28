
export default async function send_vrf(wallet_address) {

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
      const response = await fetch("/blockchain/disperse_lottery/vrf_randomizer/send_vrf_number_to_admin", requestOptions);
      const result = await response.text();
      return result;
    } catch (error) {
      return error;
    }
  }
  