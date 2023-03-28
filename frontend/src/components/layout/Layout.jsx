import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({props,  setShowWalletModal, setShowCurrentModal, children}) => {
  return (
    <>
        <Header props={props}  setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal}/>
        {children}
        <Footer/>
    </>
  )
}

export default Layout