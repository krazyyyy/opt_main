import React from 'react'
import PopUpCloser from '../utils/PopUpCloser'
import Currentimg  from "../../assets/images/currentaccount.svg"
import {
  SwipeableDrawer,
  Button,
  ListItem,
  List,
  styled,
  Alert,
  Snackbar
} from '@mui/material';
import { connect } from 'react-redux';
import { truncateString } from '../../constants/functions';
import { Color } from '../../constants/constants';
import { changeWallet, updateAddress } from '../../redux/wallet/actions';


const CurrentAccountComp = (props) => {
  const [drawerState, setDrawerState] = React.useState(true);
  const [toast, setToast] = React.useState(false);

  React.useEffect(() => {
      props.closeModal(drawerState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerState]);

  const CssDrawer = styled(SwipeableDrawer)({
      '& .MuiPaper-root-MuiDrawer-paper': {
          backgroundColor: Color.RED
      }
  });
  return (
    <div className='active popupclass w-[100%] h-[100vh] fixed top-0 left-0  justify-center items-center z-[20] flex opacity-[0] pointer-events-none'>
    <div className='w-[100%] h-[100%] absolute left-0 top-0  bg-[#11031A]  opacity-[0.8] '>
         
    </div>
   <div className='relative flex flex-col items-center 
     gap-y-[32px] md:gap-y-[2.5vw]'>
   <div className='current-account flex flex-col w-[288px] md:w-[22.5vw] h-[263px] md:h-[20.546875vw] bg-[#2F193D] rounded-[24px] gap-y-[24px] md:gap-y-[1.875vw] relative overflow-hidden'>

   <div className= 'with-drawoverlays  absolute w-[775.41px] h-[712.56px] top-[-167.65px] left-[-237.56px] md:w-[60.57890625vw] md:h-[55.66875vw] md:top-[-13.09765625vw] md:left-[-18.559375vw]'>
     
     <span className='top-left'></span>
     <span className='bottom-e2 z-[1]'></span>
     
     <span className='bottom-e3 z-[2]'></span>
     </div>


    <div className='pt-[26.95px] md:pt-[2.10546875vw] text-center '>
        <h4 className='text-[20px] leading-[24px] md:leading-[1.875vw] md:text-[1.5625vw] text-[#FFFFFF] colus'>Current Account</h4>
    </div>
    <div className='flex flex-col gap-y-[16px] md:gap-y-[1.25vw]  md:pb-[2.50390625vw] pb-[32.05px]'>
    <div  onClick={() => {
                        navigator.clipboard.writeText(
                            props.address
                        );
                        setToast(true);
          }} className='mx-[auto] w-[223px] h-[70px] md:w-[17.421875vw]  md:h-[5.46875vw] bg-[#EDDB0F] rounded-[8px] flex items-center gap-x-[11px]  pl-[15px] cursor-pointer '>
    <img src={Currentimg} alt="" />
    <span className='text-[16px] leading-[22px] md:leading-[1.71875vw] md:text-[1.25vw] text-[#37223B] font-[400]'>{truncateString(props.address, 13)}</span>

    </div>
    <div onClick={() => {
                          props.changeWallet(null);
                          props.updateAddress('');
                          setDrawerState(false);
                      }} className='cursor-pointer mx-[auto] w-[223px] h-[70px] md:w-[17.421875vw]  md:h-[5.46875vw] bg-[transparent] rounded-[8px] items-center justify-center
    border-[1px] border-[#FFFFFF] flex
    '>
    <span className='text-[14px] leading-[19px] md:leading-[1.484375vw] md:text-[1.09375vw] text-[#FFFFFF] font-[400]'>Log Out</span>

    </div>
    </div>
    
   </div>
    <PopUpCloser />
   </div>
      
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
      selected: state.wallet.selected,
      address: state.wallet.address
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      changeWallet: (payload) => dispatch(changeWallet(payload)),
      updateAddress: (payload) => dispatch(updateAddress(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentAccountComp);
