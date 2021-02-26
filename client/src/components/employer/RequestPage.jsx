import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddRounded";
import ViewIcon from "@material-ui/icons/VisibilityRounded";
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";
import AddRequestModal from "./modal/RequestModal";
import NotGrantIcon from "@material-ui/icons/ClearRounded";
import GrantIcon from "@material-ui/icons/CheckRounded";
import ViewCreditsModal from "./modal/ViewCreditsModal";

export default function RequestPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [requests, setRequests] = React.useState([]);
    const [addOpen, setAddOpen] = React.useState(false);
    const [viewOpen, setViewOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const [student, setStudent] = React.useState({studentAddress: "", index: -1})

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        try {

            contract.External.employerCreditViewRequestsCount(user._address)
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.External.employerCreditViewRequests(user._address, i)
                            .then(response => {
                                contract.CreditX.studentsByAddress(response[1])
                                    .then(res => {
                                        const module = {
                                            _index: response[0].words[0],
                                            _studentAddress: response[1],
                                            _name: res[3],
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

    }, [addOpen]);

    return (
        <React.Fragment>
            <AddRequestModal addOpen={addOpen} setAddOpen={setAddOpen} classes={classes} contract={contract} user={user}/>
            <ViewCreditsModal addOpen={viewOpen} setAddOpen={setViewOpen} classes={classes} contract={contract} user={user} studentAddress={student.studentAddress} index={student.index}/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Student ETH Address</strong></TableCell>
                            <TableCell align="right"><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Permission</strong></TableCell>
                            <TableCell align="right"><strong>Status</strong></TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => setAddOpen(!addOpen)} color="primary"
                                            aria-label="upload picture" component="span">
                                    <AddIcon/>
                                </IconButton>
                            </TableCell>
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
                                                    {req._studentAddress}
                                                </TableCell>
                                                <TableCell align="right">{req._name}</TableCell>
                                                <TableCell align="right">{req._permission ? "Granted" : "Not Granted"}</TableCell>
                                                <TableCell align="right">{req._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right">
                                                    {
                                                        req._permission
                                                            ? <IconButton onClick={async () => {
                                                                await setStudent({studentAddress: req._studentAddress, index: req._index});
                                                                setViewOpen(true);
                                                            }} color="primary"
                                                                          aria-label="upload picture" component="span">
                                                                <ViewIcon/>
                                                            </IconButton>
                                                            : <IconButton disabled color="primary"
                                                                          aria-label="upload picture" component="span">
                                                                <ViewIcon/>
                                                            </IconButton>
                                                    }
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