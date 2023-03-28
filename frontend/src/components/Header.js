import * as React from 'react';
import { Button } from '@mui/material';
import ConnectWallet from './ConnectWallet';
import { connect } from 'react-redux';
import CurrentAccount from './CurrentAccount';
import { truncateString } from '../constants/functions';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageSrc, Routes } from '../constants/constants';

function Header(props) {
    const [showWalletModal, setShowWalletModal] = React.useState(false);
    const [showCurrentModal, setShowCurrentModal] = React.useState(false);
    const handleWalletModal = () => setShowWalletModal(true);
    const handleCurrentModal = () => setShowCurrentModal(true);
    const [isAdminPage, setIsAdminPage] = React.useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    React.useEffect(() => {
        const path = location.pathname;
        if (
            path.includes(Routes.ADMIN) ||
            path.includes(Routes.PRIVACY) ||
            path.includes(Routes.TERMS) ||
            path.includes(Routes.ABOUT)
        ) {
            setIsAdminPage(true);
        } else setIsAdminPage(false);
    }, [location.pathname]);

    return (
        <div>
            <div className="header">
                <div
                    onClick={() => navigate('/')}
                    style={{
                        display: isAdminPage ? 'flex' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    <img
                        alt="_img"
                        className="header_img"
                        src={ImageSrc.LOGO}
                    />
                    <h1 className="header_heading">Optimum</h1>
                </div>
                <Button
                    style={{ marginLeft: isAdminPage ? 0 : 'auto' }}
                    size="large"
                    variant="contained"
                    onClick={
                        props.address ? handleCurrentModal : handleWalletModal
                    }
                    className="header_btn"
                >
                    {props.selected
                        ? truncateString(props.address, 10)
                        : 'Connect Wallet'}
                </Button>
            </div>
            {showWalletModal && (
                <ConnectWallet
                    closeModal={(state) => setShowWalletModal(state)}
                />
            )}
            {showCurrentModal && (
                <CurrentAccount
                    closeModal={(state) => setShowCurrentModal(state)}
                />
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        selected: state.wallet.selected,
        address: state.wallet.address
    };
};

export default connect(mapStateToProps)(Header);
