/* global AlgoSigner */
import * as React from 'react';
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
import { connect } from 'react-redux';

import {
    addChainAddressStore,
    changeNetwork,
    changeWallet,
    changeWebMode,
    updateAddress,
    updateAdminAddr
} from '../redux/wallet/actions';
import { addError } from '../redux/feedback_reducer';

import { Color, Wallet, CurrentNetwork } from '../constants/constants';
import { OptAppID, readAppGlobalState } from '../utils/common';
import { getNetworkAlgodConfig, indexerClient } from '../utils/algob.config';
import { MyAlgoWalletSession, WebMode } from '@algo-builder/web';
import { encodeAddress } from 'algosdk';

function ConnectWallet(props) {
    const [openModal, setOpenModal] = React.useState(true);
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
    const handleCloseModal = () => setOpenModal(false);

    async function handleNetworkSelection() {
        let network = CurrentNetwork;
        props.changeNetwork(network);
        setSelectedNetwork(network);
        await addAdminAddr(network);
    }

    React.useEffect(() => {
        props.closeModal(openModal);
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

    return (
        <div>
            <Dialog onClose={handleCloseModal} open={openModal}>
                <div className="modal">
                    {!showAddressInfo ? (
                        // wallet config
                        <div>
                            <DialogTitle className="modal_heading">
                                Connect to Wallet
                            </DialogTitle>
                            <List sx={{ pt: 0 }}>
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        className="modal_option"
                                        onClick={() =>
                                            handleClick(Wallet.ALGOSIGNER)
                                        }
                                    >
                                        {loading ? (
                                            <div>
                                                Fetching Address
                                                <CircularProgress
                                                    size="2rem"
                                                    style={{
                                                        color: Color.RED,
                                                        marginLeft: 10
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            'AlgoSigner'
                                        )}
                                    </Button>
                                </ListItem>
                                {!loading && (
                                    <ListItem>
                                        <Button
                                            variant="contained"
                                            className="modal_option"
                                            onClick={() => {
                                                setLoading(true);
                                                handleClick(
                                                    Wallet.MY_ALGO_WALLET
                                                );
                                            }}
                                        >
                                            MyAlgo Wallet
                                        </Button>
                                    </ListItem>
                                )}
                            </List>
                        </div>
                    ) : (
                        // address config
                        <div>
                            <DialogTitle className="modal_heading">
                                Select Address
                            </DialogTitle>
                            <List sx={{ pt: 0 }}>
                                <div className="address_list_container padding_sm list_header">
                                    <div>Address</div>
                                    <div>Amount</div>
                                </div>
                                {accountInfoArray.map((account, index) => {
                                    const labelId = `checkbox-list-label-${index}`;
                                    return (
                                        <ListItem style={{ padding: 0 }}>
                                            <ListItemButton
                                                selected={
                                                    selectedAddress ===
                                                    account.address
                                                }
                                                onClick={() => {
                                                    setAddressInfo(
                                                        account.address
                                                    );
                                                }}
                                                dense
                                                className="padding_extra_sm"
                                            >
                                                <ListItemText
                                                    className="padding_sm"
                                                    style={{
                                                        backgroundColor:
                                                            selectedAddress ===
                                                            account.address
                                                                ? Color.DARK_YELLOW
                                                                : Color.RED
                                                    }}
                                                    id={labelId}
                                                    primary={
                                                        <div className="address_list_container list_item">
                                                            <div>
                                                                {account.address.substring(
                                                                    0,
                                                                    12
                                                                )}
                                                                ...
                                                            </div>
                                                            <div>
                                                                {account.amount}
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet);
