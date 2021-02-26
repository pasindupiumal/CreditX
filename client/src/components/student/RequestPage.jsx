import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import GrantIcon from "@material-ui/icons/CheckRounded";
import NotGrantIcon from "@material-ui/icons/ClearRounded";
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";


export default function RequestPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [requests, setRequests] = React.useState([]);
    const [changePermission, setChangePermission] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        try {

            contract.External.studentCreditViewRequestsCount(user._address)
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.External.studentCreditViewRequests(user._address, i)
                            .then(response => {
                                contract.External.employersByAddress(response[2])
                                    .then(res => {
                                        const module = {
                                            _index: response[0].words[0],
                                            _studentAddress: response[1],
                                            _company: res[2],
                                            _employerAddress: response[2],
                                            _permission: response[3],
                                            _active: response[4]
                                        };
                                        arr = [...arr, module];
                                        setRequests(arr);
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .then(() => {
                    setTimeout(() => setLoading(false), 400);
                })
                .catch(err => {
                    console.log(err)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    }, [changePermission]);

    const setPerm = (index, empAddress,response) => {

        try {

            contract.External.respondCreditViewRequest(index, empAddress, response, {
                from: user._address,
                gas: 3000000
            }).once('receipt', receipt => {
                setSnackbarState({text: 'Responded', open: true, variant: snackbarVariant.SUCCESS})
                console.log(receipt);
            }).catch((err) => {
                if (err.code === 4001) {
                    setSnackbarState({text: 'Transaction Aborted', open: true, variant: snackbarVariant.ERROR});
                } else if (err.code === -32603) {
                    setSnackbarState({text: 'Invalid Input', open: true, variant: snackbarVariant.ERROR});
                }
            });

        } catch (err) {

            setSnackbarState({text: 'Transaction Failed. Check console for details.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    };

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Employer ETH Address</strong></TableCell>
                            <TableCell align="right"><strong>Company</strong></TableCell>
                            <TableCell align="right"><strong>Permission</strong></TableCell>
                            <TableCell align="right"><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        isLoading
                            ? <TableBody>
                                <TableRow key="0x1">
                                    <TableCell colSpan={5} align="center"><LinearProgress /></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    requests.length > 0
                                        ? requests.map((req) => (
                                            <TableRow key={req._index}>
                                                <TableCell component="th" scope="row">
                                                    {req._employerAddress}
                                                </TableCell>
                                                <TableCell align="right">{req._company}</TableCell>
                                                <TableCell align="right">{req._permission ? "Granted" : "Not Granted"}</TableCell>
                                                <TableCell align="right">{req._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => {
                                                        setPerm(req._index, req._employerAddress,!req._permission);
                                                        setChangePermission(!changePermission);
                                                    }} color="primary"
                                                                aria-label="upload picture" component="span">
                                                        {
                                                            req._permission
                                                                ? <NotGrantIcon/>
                                                                : <GrantIcon/>
                                                        }
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={5} align="center">No Requests</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}