import * as React from 'react';
import "./index.css";
import "./style.css";
import { Alert } from '@mui/material';
import { connect } from 'react-redux';
import { removeError, removeSuccess } from './redux/feedback_reducer';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Layout from './components/layout/Layout'
import Admin from './pages/Admin';
import Lottery from './pages/Lottery';
import Footer from './components/Footer';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import Home  from './pages/Home'
import LoginModal from './components/modal/LoginModal'
import CurrentAccountComp from './components/modal/CurrentAccount'
import About  from './pages/About'
import NewPage2  from './pages/NewPage2'
import Home_Logged  from './pages/Home_Logged'

const PrivateRoute = ({ admin, children }) => {
    return admin ? children : <Navigate to="/" />;
};
const FooterContainer = ({ children }) => {
    return (
        <div>
            {children}
            <Footer />
        </div>
    );
};
function App(props) {
    console.log(props)
    const [isAdminLogged, setAdminLog] = React.useState(props.is_admin_logged);
    const [showWalletModal, setShowWalletModal] = React.useState(false);
    const [showCurrentModal, setShowCurrentModal] = React.useState(false);
    React.useEffect(() => {
        setAdminLog(props.is_admin_logged);
    }, [props.is_admin_logged]);
    
    function activateLoginModal() {
        
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.add('active');
      }
    return (
        <div>
            <Router>
            {props.error && (
                    <div className="padding_sm">
                        <Alert
                            variant="filled"
                            severity="error"
                            onClose={() => props.removeError()}
                        >
                            <div className="font_size_small">{props.error}</div>
                        </Alert>
                    </div>
                )}
                {props.success && (
                    <div className="padding_sm">
                        <Alert
                            variant="filled"
                            severity="success"
                            onClose={() => props.removeSuccess()}
                        >
                            <div className="font_size_small">
                                {props.success}
                            </div>
                        </Alert>
                    </div>
                )}
                <Routes>
                    
                
                    <Route
                        path="/"
                        element={
                            <Layout props={props} setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal} showFunc={activateLoginModal} >
                            {!props.selected && (
                            <Home props={props} setShowWalletModal={setShowWalletModal} showFunc={activateLoginModal}/>
                            )}
                          {props.selected && (
                        <Home_Logged props={props} setShowWalletModal={setShowWalletModal} showFunc={activateLoginModal}/>
                            )}
                        </Layout>
                        }
                        />
                   
                    <Route
                    path="/About"
                    element={
                    <Layout props={props} setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal} showFunc={activateLoginModal}>
                        <About props={props} setShowWalletModal={setShowWalletModal} showFunc={activateLoginModal} />
                    </Layout>
                    }
                />
                 <Route
            path="/new-page-2"
            element={
              <Layout props={props} setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal}>
                <NewPage2 props={props} setShowWalletModal={setShowWalletModal} />
              </Layout>
            }
          />
           
               <Route
            path="/privacy"
            element={
              <Layout props={props} setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal}>
                <PrivacyPolicy />
              </Layout>
            }
          />
          <Route
            path="/toc"
            element={
              <Layout props={props} setShowWalletModal={setShowWalletModal} setShowCurrentModal={setShowCurrentModal}>
                <TermsCondition />
              </Layout>
            }
          />
           <Route
                  path="/admin"
                  element={
                      <PrivateRoute admin={isAdminLogged}>
                          <FooterContainer>
                              <Admin />
                          </FooterContainer>
                      </PrivateRoute>
                  }
              />
           {/* <Route
                  path="/admin"
                  element={
                          <FooterContainer>
                              <Admin />
                          </FooterContainer>
                  }
              /> */}
              <Route
                  path="/admin/lottery"
                  element={
                      <PrivateRoute admin={isAdminLogged}>
                          <FooterContainer>
                              <Lottery />
                          </FooterContainer>
                      </PrivateRoute>
                  }
              />


  
        </Routes>
            </Router>
            
            {showWalletModal && (
            <LoginModal props={props} setShowWalletModal={setShowWalletModal} />
            )}
            {showCurrentModal && (
                <CurrentAccountComp props={props} closeModal={(state) => setShowCurrentModal(state)}/>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        selected: state.wallet.selected,
        error: state.feedback.error,
        success: state.feedback.success,
        is_admin_logged: state.wallet.is_admin_logged
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeError: () => dispatch(removeError()),
        removeSuccess: () => dispatch(removeSuccess())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
