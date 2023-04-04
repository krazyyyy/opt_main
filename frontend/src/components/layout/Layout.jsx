import React from 'react'
import Header from './Header'
import Footer from './Footer'
 
const Layout = ({props,  setShowWalletModal, setShowCurrentModal, showFunc, children}) => {
  return (
    <>
        <Header props={props}  setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal} showFunc={showFunc}/>
        {children}
        <Footer/>
    </>
  )
}

export default Layout