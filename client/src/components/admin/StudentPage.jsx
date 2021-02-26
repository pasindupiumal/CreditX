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
import AddStudentModal from "./modals/AddStudentModal";
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";


export default function StudentPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [students, setStudents] = React.useState([]);
    const [addOpen, setAddOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        try {

            contract.CreditX.studentCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.CreditX.studentsByIndex(i)
                            .then(response => {
                                const student = {
                                    _index: response[0].words[0],
                                    _id: response[1],
                                    _name: response[3],
                                    _address: response[2],
                                    _active: response[4],
                                    _transfer: response[5]
                                };
                                arr = [...arr, student];
                                setStudents(arr);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .then(() => {
                    setTimeout(() => setLoading(false), 400);
                })
                .catch(error => {
                    console.log(error)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    }, [addOpen]);

    return (
        <React.Fragment>
            <AddStudentModal addOpen={addOpen} setAddOpen={setAddOpen} classes={classes} contract={contract} user={user}/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell align="right"><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Ethereum Address</strong></TableCell>
                            <TableCell align="right"><strong>Transfer Status</strong></TableCell>
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
                                    <TableCell colSpan={6} align="center"><LinearProgress /></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    students.length > 0
                                        ? students.map((student) => (
                                            <TableRow key={student._address}>
                                                <TableCell component="th" scope="row">
                                                    {student._id}
                                                </TableCell>
                                                <TableCell align="right">{student._name}</TableCell>
                                                <TableCell align="right">{student._address}</TableCell>
                                                <TableCell align="right">{student._transfer ? "Transfer" : "Non Transfer"}</TableCell>
                                                <TableCell align="right">{student._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right"> </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={6} align="center">No Students</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}
