import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CircularProgress,
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
    useTheme
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { Color } from '../constants/constants';
import { connect } from 'react-redux';
import { localOPTRewardAmt } from '../utils/common';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { addError } from '../redux/feedback_reducer';

const LotteryTable = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [showLoading, setLoading] = useState(false);

    async function getLotteryData() {
        setLoading(true);
        const data = await localOPTRewardAmt(props.selected_network).catch(
            (error) => {
                setLoading(false);
                props.addError(error.message);
            }
        );
        if (data?.length > 0) {
            if (props.screen === 'Home') {
                const winnerData = data.filter(
                    (item) => item.reward !== 'Nil' || item.reward > 0
                );
                setRows(winnerData);
            } else {
                const addressWithStake = data.filter(
                    (item) => item.stake !== 'Nil' || item.stake > 0
                );
                setRows(addressWithStake);
            }
        }
        setLoading(false);
    }
    useEffect(() => {
        getLotteryData();
    }, [props.updateData]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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

        const handleFirstPageButtonClick = (event) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
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
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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
                    <h1>
                        Prize Game Winners Information <CelebrationIcon />
                    </h1>
                    {showLoading ? (
                        <div className="flexBox_center flex_row">
                            <CircularProgress
                                style={{
                                    color: Color.DARK_YELLOW,
                                    backgroundColor: 'black'
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            {!rows.length ? (
                                <h2 style={{ color: Color.RED }}>
                                    No prize game has been drawn yet.
                                </h2>
                            ) : (
                                <TableContainer>
                                    <Table
                                        sx={{
                                            backgroundColor: Color.DARK_YELLOW
                                        }}
                                        aria-label="custom pagination table"
                                    >
                                        <TableHead
                                            sx={{
                                                borderBottom: `2px solid ${Color.RED}`,
                                                '& th': {
                                                    fontSize: '1.25rem',
                                                    color: Color.RED,
                                                    fontWeight: 600
                                                }
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    colSpan={1}
                                                ></TableCell>
                                                <TableCell
                                                    align="center"
                                                    colSpan={3}
                                                >
                                                    (in OPT)
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Address</TableCell>
                                                {/* <TableCell align="right">
                                                    Stake
                                                </TableCell> */}

                                                <TableCell align="right">
                                                    Reward
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(rowsPerPage > 0
                                                ? rows.slice(
                                                      page * rowsPerPage,
                                                      page * rowsPerPage +
                                                          rowsPerPage
                                                  )
                                                : rows
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
                                                            {row.address}
                                                        </div>
                                                    </TableCell>

                                                    {/* <TableCell
                                                        component="th"
                                                        align="right"
                                                    >
                                                        {row.stake}
                                                    </TableCell> */}

                                                    <TableCell
                                                        component="th"
                                                        align="right"
                                                    >
                                                        {row.reward}
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
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    sx={{
                                                        fontSize:
                                                            '1.5rem !important',
                                                        color: Color.RED
                                                    }}
                                                    rowsPerPageOptions={[
                                                        5,
                                                        10,
                                                        25,
                                                        {
                                                            label: 'All',
                                                            value: -1
                                                        }
                                                    ]}
                                                    colSpan={4}
                                                    count={rows.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: {
                                                            'aria-label':
                                                                'rows per page'
                                                        },
                                                        native: true
                                                    }}
                                                    onPageChange={
                                                        handleChangePage
                                                    }
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
                    )}
                </div>
            </Paper>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selected_network: state.wallet.selected_network
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addError: (payload) => dispatch(addError(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotteryTable);
