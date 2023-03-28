import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    useTheme,
    Button,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Color, LocalStateKeys } from '../constants/constants';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { connect } from 'react-redux';
import {
    getCustodialWallets,
    OptAppID,
    readAppLocalState
} from '../utils/common';

const CustodialWalletTable = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [toast, setToast] = React.useState(false);
    const [rowsData, setRowsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationToken, setPaginationToken] = useState('');

    function createData(address, register, vote, amount) {
        return { address, register, vote, amount };
    }

    const getWalletInfo = async (calledFromAdminComponent = false) => {
        setLoading(true);
        const response = await getCustodialWallets(
            OptAppID(props.selected_network),
            undefined,
            props.selected_network,
            props.admin_addr,
            100,
            true,
            calledFromAdminComponent ? undefined : paginationToken
        );
        setPaginationToken(response.nextToken);

        if (response.custodialWallets.length) {
            let data = [];
            for (const acc of response.custodialWallets) {
                const localState = await readAppLocalState(
                    acc.address,
                    OptAppID(props.selected_network),
                    props.selected_network
                );
                if (localState === undefined) {
                    continue;
                }
                const registered = localState.get(LocalStateKeys.REGISTERED);
                const voted = localState.get(LocalStateKeys.VOTED);
                const address = acc.address;
                data.push(
                    createData(address, registered, voted, acc.amount / 1e6)
                );
            }
            const sortedArray = data.sort(function (a, b) {
                return b.amount - a.amount;
            });
            if (calledFromAdminComponent) {
                setRowsData(sortedArray);
            } else {
                setRowsData((existingData) => existingData.concat(sortedArray));
            }
        } else {
            setRowsData(rowsData ?? []);
        }
        setLoading(false);
    };

    useEffect(() => {
        getWalletInfo(true);
        setPage(0);
    }, [props.updateCustodialWalletsData]);

    useEffect(() => {
        if (paginationToken) {
            var paragraph = document.getElementsByClassName(
                'MuiTablePagination-displayedRows'
            )?.[0];
            if (paragraph) {
                paragraph.innerHTML = `Currently showing ${rowsData.length} results`;
            }
        }
    });

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function TablePaginationActions(props) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;
        const isLastPage = page >= Math.ceil(count / rowsPerPage) - 1;
        const handleFirstPageButtonClick = (event) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = async (event) => {
            // token exists and fetch more data
            if (isLastPage && paginationToken) {
                setLoading(true);
                await getWalletInfo();
                setLoading(false);
            } else {
                onPageChange(event, page + 1);
            }
        };

        const handleLastPageButtonClick = (event) => {
            onPageChange(
                event,
                Math.max(0, Math.ceil(count / rowsPerPage) - 1)
            );
        };

        return (
            <div style={{ display: 'flex' }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? (
                        <LastPageIcon />
                    ) : (
                        <FirstPageIcon />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="previous page"
                >
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={!paginationToken && isLastPage}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={isLastPage}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? (
                        <FirstPageIcon />
                    ) : (
                        <LastPageIcon />
                    )}
                </IconButton>
            </div>
        );
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    };

    return (
        <div>
            <Paper elevation={24} className="stats_card">
                <div className="padding_sm">
                    <h1>Custodial Wallets Information</h1>
                    {!loading && !rowsData.length ? (
                        <h2 style={{ color: Color.RED }}>
                            No Custodial wallets exists.
                        </h2>
                    ) : (
                        <TableContainer>
                            <Table
                                sx={{
                                    backgroundColor: Color.DARK_YELLOW
                                }}
                                aria-label="custom pagination table"
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            borderBottom: `2px solid ${Color.RED}`,
                                            '& th': {
                                                fontSize: '1.25rem',
                                                color: Color.RED,
                                                fontWeight: 600
                                            }
                                        }}
                                    >
                                        <TableCell>Address</TableCell>
                                        <TableCell align="right">
                                            Registered
                                        </TableCell>
                                        <TableCell align="right">
                                            Voted
                                        </TableCell>
                                        <TableCell align="right">
                                            Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div
                                                style={{
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <CircularProgress
                                                    size="5rem"
                                                    style={{
                                                        color: Color.RED,
                                                        justifyContent: 'center'
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? rowsData.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage +
                                                      rowsPerPage
                                              )
                                            : rowsData
                                        ).map((row) => (
                                            <TableRow
                                                key={row.address}
                                                sx={{
                                                    borderBottom:
                                                        '1px solid black',
                                                    '& th': {
                                                        fontSize: '1rem',
                                                        color: Color.RED,
                                                        fontWeight: 600
                                                    }
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <div className="flexBox_row_center">
                                                        {row.address.substring(
                                                            0,
                                                            15
                                                        ) + '...'}

                                                        <Button
                                                            style={{
                                                                margin: -10,
                                                                color: Color.RED
                                                            }}
                                                            onClick={() => {
                                                                setToast(true);
                                                                navigator.clipboard.writeText(
                                                                    row.address
                                                                );
                                                            }}
                                                        >
                                                            <ContentCopyIcon />
                                                        </Button>
                                                    </div>
                                                </TableCell>

                                                <TableCell
                                                    component="th"
                                                    align="right"
                                                >
                                                    {row.register}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    align="right"
                                                >
                                                    {row.vote}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    align="right"
                                                >
                                                    {row.amount}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                )}

                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            sx={{
                                                fontSize: '1.5rem !important',
                                                color: Color.RED
                                            }}
                                            rowsPerPageOptions={[
                                                5,
                                                10,
                                                25,
                                                { label: 'All', value: -1 }
                                            ]}
                                            colSpan={4}
                                            count={rowsData.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label':
                                                        'rows per page'
                                                },
                                                native: true
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={
                                                handleChangeRowsPerPage
                                            }
                                            ActionsComponent={
                                                TablePaginationActions
                                            }
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </Paper>
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
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selected: state.wallet.selected,
        address: state.wallet.address,
        error: state.feedback.error,
        selected_network: state.wallet.selected_network,
        admin_addr: state.wallet.admin_addr,
        governance_addr: state.wallet.governance_addr,
        web: state.wallet.webMode
    };
};

export default connect(mapStateToProps)(CustodialWalletTable);
