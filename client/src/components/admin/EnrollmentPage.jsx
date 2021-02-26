import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import {MenuItem, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";


export default function EnrollmentPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [submit, setSubmit] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const [students, setStudents] = React.useState([]);
    const [studentAddress, setStudentAddress] = React.useState("");

    const [modules, setModules] = React.useState([]);
    const [moduleCode, setModuleCode] = React.useState("");

    const [enrolledModules, setEnrolledModules] = React.useState([]);

    React.useEffect(() => {
        if (students.length > 0) setStudentAddress(students[0]._address)
    }, [students]);

    React.useEffect(() => {
        if (modules.length > 0) setModuleCode(modules[0]._code)
    }, [modules]);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        if (studentAddress !== "") {

            try {

                contract.CreditX.studentEnrolledModulesCount(studentAddress)
                    .then(count => {
                        setEnrolledModules([]);
                        for (let i = 0; i < count; i++) {
                            contract.CreditX.studentEnrolledModules(studentAddress, i)
                                .then(response => {
                                    const module = {
                                        _index: response[0].words[0],
                                        _code: response[1],
                                        _name: response[2],
                                        _credits: response[3].words[0],
                                        _active: response[4],
                                        _graded: response[5],
                                        _obtainedCredits: response[6].words[0]
                                    };
                                    arr = [...arr, module];
                                    setEnrolledModules(arr);
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

        } else {

            setTimeout(() => setLoading(false), 400);

        }

    }, [studentAddress, submit]);

    React.useEffect(() => {

        let arr = [];

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
                                    _active: response[4]
                                };
                                arr = [...arr, student];
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

    }, []);

    React.useEffect(() => {

        let arr = [];

        try {

            contract.CreditX.moduleCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.CreditX.modulesByIndex(i)
                            .then(response => {
                                const module = {
                                    _index: response[0].words[0],
                                    _code: response[1],
                                    _name: response[2],
                                    _credits: response[3].words[0],
                                    _active: response[4],
                                    _graded: response[5],
                                    _obtainedCredits: response[6].words[0]
                                };
                                arr = [...arr, module];
                                setModules(arr);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    }, []);

    const enroll = () => {

        setSubmit(true);

        try {

            if (studentAddress === "") {

                setSnackbarState({text: 'Invalid student address', open: true, variant: snackbarVariant.ERROR});

            } else if (moduleCode === "") {

                setSnackbarState({text: 'Invalid module code', open: true, variant: snackbarVariant.ERROR});

            } else {

                contract.CreditX.enrollStudent(studentAddress, moduleCode, {
                    from: user._address,
                    gas: 3000000
                }).once('receipt', receipt => {
                    setSnackbarState({text: 'Student Enrolled', open: true, variant: snackbarVariant.SUCCESS})
                    console.log(receipt);
                    setSubmit(false);
                });

            }

        } catch (err) {

            setSnackbarState({text: 'Transaction Failed. Check console for details.', open: true, variant: snackbarVariant.ERROR});
            console.log(err);

        }

    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <TextField
                            id="outlined-select-student"
                            fullWidth
                            select
                            label="Select"
                            size="small"
                            value={studentAddress}
                            onChange={event => setStudentAddress(event.target.value)}
                            helperText="Please select a student"
                            variant="outlined"
                        >
                            {students.map((student) => (
                                <MenuItem key={student._address} value={student._address}>
                                    {`${student._id} - ${student._name}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <TextField
                            id="outlined-select-module"
                            fullWidth
                            select
                            label="Select"
                            size="small"
                            value={moduleCode}
                            onChange={event => setModuleCode(event.target.value)}
                            helperText="Please select a module"
                            variant="outlined"
                        >
                            {modules.map((module) => (
                                <MenuItem key={module._code} value={module._code}>
                                    {`${module._code} - ${module._name}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper className={classes.paper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={studentAddress === "" || moduleCode === ""}
                            style={{margin: '0.84rem 0', background: '#4b79a2'}}
                            onClick={() => {enroll()}}
                        >
                            Enroll
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Code</strong></TableCell>
                                    <TableCell align="right"><strong>Name</strong></TableCell>
                                    <TableCell align="right"><strong># Credits</strong></TableCell>
                                    <TableCell align="right"><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                isLoading
                                    ? <TableBody>
                                        <TableRow key="0x1">
                                            <TableCell colSpan={4} align="center"><LinearProgress /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                    : <TableBody>
                                        {
                                            enrolledModules.length > 0
                                                ? enrolledModules.map((module) => (
                                                    <TableRow key={module._code}>
                                                        <TableCell component="th" scope="row">
                                                            {module._code}
                                                        </TableCell>
                                                        <TableCell align="right">{module._name}</TableCell>
                                                        <TableCell align="right">{module._credits}</TableCell>
                                                        <TableCell align="right">{module._active ? "Active" : "Inactive"}</TableCell>
                                                    </TableRow>
                                                ))
                                                : <TableRow key="0x1">
                                                    <TableCell colSpan={4} align="center">No Enrolled Modules</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                            }
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
