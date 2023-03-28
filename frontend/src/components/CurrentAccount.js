import * as React from 'react';
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
import { truncateString } from '../constants/functions';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Color } from '../constants/constants';
import { changeWallet, updateAddress } from '../redux/wallet/actions';

function CurrentAccount(props) {
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
        <div>
            <React.Fragment key="right">
                <CssDrawer
                    anchor={'right'}
                    open={drawerState}
                    onClose={() => setDrawerState(false)}
                    onOpen={() => setDrawerState(true)}
                >
                    <div className="drawer">
                        <List sx={{ pt: 0 }}>
                            <ListItem>Current Account</ListItem>
                            <ListItem>
                                <Button
                                    size="large"
                                    className="drawer_card_item"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            props.address
                                        );
                                        setToast(true);
                                    }}
                                >
                                    <ContentCopyIcon className="btn_icon" />
                                    {truncateString(props.address, 13)}
                                </Button>
                            </ListItem>
                            <ListItem>
                                <Button
                                    className="drawer_btn"
                                    variant="outlined"
                                    size="large"
                                    onClick={() => {
                                        props.changeWallet(null);
                                        props.updateAddress('');
                                        setDrawerState(false);
                                        
                                    }}
                                >
                                    <LogoutIcon className="btn_icon" />
                                    Sign Out
                                </Button>
                            </ListItem>
                        </List>
                    </div>
                </CssDrawer>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={toast}
                    onClose={() => setToast(false)}
                    autoHideDuration={1000}
                >
                    <Alert
                        variant="filled"
                        severity="error"
                        icon={false}
                        className="font_size_small"
                    >
                        Copied
                    </Alert>
                </Snackbar>
            </React.Fragment>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentAccount);
