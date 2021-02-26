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
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";
import AddTransferModal from "./modals/AddTransferModal";
import ApproveIcon from "@material-ui/icons/CheckRounded";
import AddTransferStudentModal from "./modals/AddTransferStudentModal";

export default function TransferPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [transfers, setTransfers] = React.useState([]);
    const [addOpen, setAddOpen] = React.useState(false);
    const [transOpen, setTransOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [req, setReq] = React.useState({_studentName: "", _creditCount: 0, _studentId: ""});
    const [students, setStudents] = React.useState([]);

    React.useEffect(() => {

        let arr = [];

        try {

            contract.CreditX.studentCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.CreditX.studentsByIndex(i)
                            .then(response => {
                                arr = [...arr, response[3]];
                                setStudents(arr);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    }, [transOpen]);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        try {

            contract.XUni.transferRequestsCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.XUni.transferRequests(i)
                            .then(response => {
                                contract.XUni.universityByAddress(response[3])
                                    .then(res => {
                                        const req = {
                                            _index: response[0].words[0],
                                            _uniIndex: response[1].words[0],
                                            _studentName: response[2],
                                            _universityAddress: response[3],
                                            _approval: response[4],
                                            _active: response[5],
                                            _creditCount: response[6].words[0],
                                            _universityName: res[2],
                                            _studentId: response[7]
                                        };
                                        arr = [...arr, req];
                                        setTransfers(arr);
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

    }, [addOpen, transOpen, students]);

    return (
        <React.Fragment>
            <AddTransferModal addOpen={addOpen} setAddOpen={setAddOpen} classes={classes} contract={contract}
                                user={user}/>
            <AddTransferStudentModal req={req} addOpen={transOpen} setAddOpen={setTransOpen} classes={classes} contract={contract}
                              user={user}/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Transfer ID</strong></TableCell>
                            <TableCell align="right"><strong>Student Name</strong></TableCell>
                            <TableCell align="right"><strong>University Name</strong></TableCell>
                            <TableCell align="right"><strong>University ETH address</strong></TableCell>
                            <TableCell align="right"><strong>Credit Count</strong></TableCell>
                            <TableCell align="right"><strong>Approval</strong></TableCell>
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
                                    <TableCell colSpan={7} align="center"><LinearProgress /></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    transfers.length > 0
                                        ? transfers.map((r) => (
                                            <TableRow key={r._index}>
                                                <TableCell component="th" scope="row">
                                                    {r._studentId}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {r._studentName}
                                                </TableCell>
                                                <TableCell align="right">{r._universityName}</TableCell>
                                                <TableCell align="right">{r._universityAddress}</TableCell>
                                                <TableCell align="right">{r._creditCount}</TableCell>
                                                <TableCell align="right">{r._approval ? "Approved" : "Not Approved"}</TableCell>
                                                <TableCell align="right">{r._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right">
                                                    {
                                                        !r._approval
                                                            ? <IconButton disabled color="primary" aria-label="upload picture"
                                                                          component="span">
                                                                <ApproveIcon/>
                                                            </IconButton>
                                                            : students.indexOf(r._studentName) === -1
                                                            ? <IconButton onClick={() => {
                                                                setReq({_studentName: r._studentName, _creditCount: r._creditCount, _studentId: r._studentId});
                                                                setTransOpen(true);
                                                            }} color="primary" aria-label="upload picture" component="span">
                                                                <ApproveIcon/>
                                                            </IconButton>
                                                            : <IconButton disabled color="primary" aria-label="upload picture"
                                                                          component="span">
                                                                <ApproveIcon/>
                                                            </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={6} align="center">No Transfers</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}