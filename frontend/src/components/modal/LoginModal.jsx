/* global AlgoSigner */
import React, { useEffect } from 'react'
import algosigner from "../../assets/images/algosigner.svg"
import myalgo  from "../../assets/images/myalgo.svg"
import { connect } from 'react-redux';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import {
    addChainAddressStore,
    changeNetwork,
    changeWallet,
    changeWebMode,
    updateAddress,
    updateAdminAddr
} from '../../redux/wallet/actions';
import { addError } from '../../redux/feedback_reducer';

import { Color, Wallet, CurrentNetwork } from '../../constants/constants';
import { OptAppID, readAppGlobalState } from '../../utils/common';
import { getNetworkAlgodConfig, indexerClient } from '../../utils/algob.config';
import { MyAlgoWalletSession, WebMode } from '@algo-builder/web';
import { encodeAddress } from 'algosdk';


const LoginModal = (props) => {
  const [openModal, setOpenModal] = React.useState(true);
  console.log(props)
  const [loading, setLoading] = React.useState(false);
  const [showAddressInfo, setShowAddressInfo] = React.useState(
      props.selected
  );
  const [accountInfoArray, setAccountInfoArray] = React.useState(
      props.account_store ? props.account_store : []
  );
  const [selectedAddress, setSelectedAddress] = React.useState(
      props.address ? props.address : undefined
  );

  const [selectedNetwork, setSelectedNetwork] = React.useState(
      props.selected_network
  );
  const handleCloseModal = () => props.setShowWalletModal(false);
//   const handleCloseModal = () => setOpenModal(false);

  async function handleNetworkSelection() {
      let network = CurrentNetwork;
      props.changeNetwork(network);
      setSelectedNetwork(network);
      await addAdminAddr(network);
  }

  React.useEffect(() => {
      // props.closeModal(openModal)
    //   setShowWalletModal()
      handleNetworkSelection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  async function getAccountInfo(value) {
      let accountStore = [];
      for (const acc of value) {
          if (acc && acc.address) {
              const accountInfo = await indexerClient(selectedNetwork)
                  .lookupAccountByID(acc.address)
                  .do();

              let account = accountInfo.account;
              accountStore.push({
                  address: account.address,
                  amount: account.amount / 1e6
              });
          }
      }
      setAccountInfoArray(accountStore);
      return accountStore;
  }

  const handleClick = async (selectedWallet) => {
      if (selectedWallet === Wallet.ALGOSIGNER) {
          if (typeof AlgoSigner === 'undefined') {
              AlgoSigner.connect()
                  .then(async (d) => {
                      const address =
                          (await AlgoSigner.accounts({
                              ledger: selectedNetwork
                          })) ?? [];
                      if (address.length) {
                          props.changeWallet(Wallet.ALGOSIGNER);
                          props.changeWebMode(
                              new WebMode(AlgoSigner, selectedNetwork)
                          );
                          // fetching only if new address is added to wallet (since network change is not allowed by sign out)
                          if (address.length === accountInfoArray.length) {
                              setLoading(true);
                              const accountInfo = await getAccountInfo(
                                  address
                              );
                              setLoading(false);
                              props.addChainAddressStore(accountInfo);
                          }
                          setShowAddressInfo(true);
                      }
                  })
                  .catch((e) => {
                      console.error(e);
                      props.addError(JSON.stringify(e));
                      handleCloseModal();
                  });
          } else {
              props.addError('AlgoSigner is NOT installed.');
              handleCloseModal();
          }
      } else if (selectedWallet === Wallet.MY_ALGO_WALLET) {
          let myAlgo = new MyAlgoWalletSession(
              getNetworkAlgodConfig(selectedNetwork)
          );
          
          await myAlgo.connectToMyAlgo().catch((e) => {
              console.error(e);
              props.addError(JSON.stringify(e));
              handleCloseModal();
          });
          props.changeWebMode(myAlgo);
          if (myAlgo.accounts.length) {
              setLoading(true);
              const accountInfo = await getAccountInfo(myAlgo.accounts);
              setLoading(false);
              props.addChainAddressStore(accountInfo);
              props.changeWallet(Wallet.MY_ALGO_WALLET);
              setShowAddressInfo(true);
          }
      }
  };

  async function addAdminAddr(network) {
      const globalState = await readAppGlobalState(
          selectedAddress,
          OptAppID(network),
          network
      );
      const address = encodeAddress(
          Buffer.from(globalState.get('admin'), 'base64')
      );
      props.updateAdminAddr(address);
  }

  function setAddressInfo(address) {
      setSelectedAddress(address);
      props.updateAddress(address);
      setTimeout(() => {
          handleCloseModal();
      }, 500);
  }

    useEffect(()=>{
        const handleClick =(e)=>{ 
            e.target.id =='loginModal' &&  e.target.classList.remove('active')
        }
        window.addEventListener('click',handleClick)
        return ()=> window.removeEventListener('click',handleClick)
    },[])
  return (
    
    <div id='loginModal' className='active w-[100%]  h-[100vh] fixed top-0 left-0 flex justify-center items-center z-[222]'>
      <div className='bg-[#16041B] absolute opacity-[0.6] pointer-events-none 
      w-[100%] h-[100%]
      '></div>
     
      <div className='pop-up flex w-[320px] h-[320px] flex-col items-center justify-center md:w-[25vw] md:h-[21.484375vw] z-[2] overflow-hidden relative '>
    
      <div className='loginModalOverlays'>
    <div className="loginModalOverlayTop"></div>
    <div className="loginModalOverlayRightBotom"></div>
    <div className="loginModalOverlayRightBotom2"></div>
</div>
{!showAddressInfo &&
<div className='flex w-[320px] h-[320px] flex-col items-center justify-center md:w-[25vw] md:h-[23.484375vw] z-[2] overflow-hidden relative'>
   
   <h4 className='text-[20px] z-[5] leading-[24px] pt-[22px] mt-[22px] mb-[22px] md:text-[1.5625vw] md:leading-[1.875vw] text-center md:mb-[1.71875vw] font-[colus] text-[#FFFFFF]'>Connect to wallet</h4>
      {loading ? (
      
      <div className='w-[273px] cursor-pointer z-[5] h-[82px] md:w-[21.328125vw] md:h-[6.40625vw] mx-[auto] bg-[#EDDB0F] rounded-[9px] flex justify-start items-center
pl-[16px] md:pl-[1.25vw]'>
    <div className='flex items-center gap-x-[12px] md:gap-x-[0.9375vw]'>
    <CircularProgress
                size="2rem"
                style={{
                    color: Color.RED,
                    marginLeft: 10
                }}
            />
        <span className='text-[18px] leading-[21.6px] md:text-[1.40625vw] md:leading-[1.6875] font-[700] text-[#1E131A]'> Fetching Address</span>
    </div>
        </div>
      ) : (
        <div className='flex w-[320px] h-[320px] flex-col items-center justify-center md:w-[25vw] mb-[18px] md:h-[23.484375vw] z-[2] overflow-hidden relative'>
        <div className='w-[273px] cursor-pointer z-[5] h-[82px] md:w-[21.328125vw] md:h-[6.40625vw] mx-[auto] bg-[#EDDB0F] rounded-[9px] mb-[16px] md:mb-[1.25vw]
        flex justify-start items-center
        pl-[16px] md:pl-[1.25vw] 
        '>
            <div  onClick={() =>  handleClick(Wallet.ALGOSIGNER)
                                                } className='flex items-center gap-x-[12px] md:gap-x-[0.9375vw]'>
                <img src={algosigner} alt="Algosigner " className='w-[50px] h-[50px] md:w-[3.90625vw] md:h-[3.90625vw]' />
                <span className='text-[18px] leading-[21.6px] md:text-[1.40625vw] md:leading-[1.6875] font-[700] text-[#1E131A]'>Algosigner</span>
            </div>
        </div>
        <div onClick={() => {
                                setLoading(true);
                                handleClick(
                                    Wallet.MY_ALGO_WALLET
                                );
                            }} className='w-[273px] cursor-pointer z-[5] h-[82px] md:w-[21.328125vw] md:h-[6.40625vw] mx-[auto] bg-[#EDDB0F] rounded-[9px] flex justify-start items-center
        pl-[16px] md:pl-[1.25vw]'>
            <div className='flex items-center gap-x-[12px] md:gap-x-[0.9375vw]'>
                <img src={myalgo} alt="Myalgo Walltet " className='w-[50px] h-[50px] md:w-[3.90625vw] md:h-[3.90625vw]' />
                <span className='text-[18px] leading-[21.6px] md:text-[1.40625vw] md:leading-[1.6875] font-[700] text-[#1E131A]'>Myalgo Walltet</span>
            </div>
        </div> 
        </div> ) }
</div> }
{showAddressInfo &&
  <div>

    <div className='pt-[26.95px] md:pt-[2.10546875vw] text-center '>
        <h4 className='text-[20px] leading-[24px] md:leading-[1.875vw] md:text-[1.5625vw] text-[#FFFFFF] colus'>Select Address</h4>
    </div>
  <List sx={{ pt: 0 }}>
      <div className="z-[5] flex mb-[22px] md:mb-[1.71875vw] font-[colus] text-[#FFFFFF]">
          <div className="w-full float-left">Address</div>
          <div className="w-full text-end">Amount</div>
      </div>
      
    {accountInfoArray.map((account, index) => {
          const labelId = `checkbox-list-label-${index}`;
          return (
            <div           selected={
                selectedAddress ===
                account.address
            }
            onClick={() => {
                setAddressInfo(
                    account.address
                );
            }} id={labelId} className='flex justify-center  md:pb-[2.50390625vw] pb-[32px] pointer-cursor  text-center'>
                    <div className='cursor-pointer'>
                    <div  className='mx-[auto] w-[191px] mt-[9px]  h-[70px] md:w-[14.921875vw]  md:h-[5.46875vw] bg-[#FF005C] rounded-[8px] flex items-center gap-x-[11px]     justify-center '>
                    <span className='text-[16px] leading-[22px] md:leading-[1.71875vw] md:text-[1.25vw] text-[#FFFFFF] font-[400]'>{account.address.substring(
                                          0,
                                          12
                                      )}
                                      ...</span>
            
                    </div>
                    </div>
                <div>
                <div className='mx-[auto] w-[96px] mt-[9px] h-[70px] md:w-[7.5vw]  md:h-[5.46875vw] bg-[#EDDB0F] rounded-[8px] items-center justify-center
                    flex
                    '>
                    <span className='text-[14px] leading-[19px] md:leading-[1.484375vw] md:text-[1.09375vw] text-[#15061E] font-[400]'>{account.amount}</span>
            
                    </div>
                </div>
                
                </div>  
          );
      })}
  </List>
</div>
}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
      selected: state.wallet.selected,
      address: state.wallet.address,
      error: state.feedback.error,
      account_store: state.wallet.account_store,
      selected_network: state.wallet.selected_network
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      changeWallet: (payload) => dispatch(changeWallet(payload)),
      updateAddress: (payload) => dispatch(updateAddress(payload)),
      addError: (payload) => dispatch(addError(payload)),
      addChainAddressStore: (payload) =>
          dispatch(addChainAddressStore(payload)),
      changeNetwork: (payload) => dispatch(changeNetwork(payload)),
      updateAdminAddr: (payload) => dispatch(updateAdminAddr(payload)),
      changeWebMode: (payload) => dispatch(changeWebMode(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);


// export default LoginModal