import React from "react";
import {Button, Grid, MenuItem, TextField,} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/ClearRounded";
import snackbarContext from "../../../context/SnackbarContext";
import {snackbarVariant} from "../../../context/SnackbarContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";

export default function ViewCreditsModal({addOpen, setAddOpen, classes, contract, user, studentAddress, index}) {

    const {setSnackbarState} = React.useContext(snackbarContext);

    const [isLoading, setLoading] = React.useState(false);

    const [enrolledModules, setEnrolledModules] = React.useState([]);
    const [creditedModules, setCreditedModules] = React.useState([]);
    const [totalCredits, setTotalCredits] = React.useState(0);

    const [year, setYear] = React.useState(0);

    const [path, setPath] = React.useState("");

    const [trn, setTrn] = React.useState("");

    const getTranscript = async () => {
        contract.CreditX.studentsByAddress(studentAddress)
            .then(response => {
                axios.get(`http://localhost:5000/?id=${response[1]}`)
                    .then(res => {
                        if (res.data.filePath) setPath(res.data.filePath);
                        if (res.data) setTrn(res.data);
                    })
            })
    };

    const handleClose = () => {
        setAddOpen(false);
    };

    React.useEffect(() => {

        let mounted = true;

        getTranscript();

        if (studentAddress) {

            contract.CreditX.getTotalStudentsCredits(studentAddress, index)
                .then(response => {

                    let x = response.words[0];
                    if (response.words[0] > 0) x /= 1000;

                    if (mounted)
                        setTotalCredits(x);

                })
                .catch(error => {
                    console.log(error)
                })

            return () => {
                mounted = false
            }

        }

    }, [studentAddress, index]);

    React.useEffect(() => {

        let mounted = true;

        let arr = [];

        if (studentAddress) {

            try {

                contract.CreditX.studentEnrolledModulesCount(studentAddress)
                    .then(async count => {
                        if (mounted)
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
                                    if (mounted)
                                        setEnrolledModules(arr);
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }

                        return arr;
                    })
                    .then(arr => {
                        if (mounted) setEnrolledModules(arr)
                    })
                    .catch(error => {
                        console.log(error)
                    })

            } catch (err) {

                setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
                console.log(err);

            }

            return () => {
                mounted = false
            }

        }

    }, [studentAddress, index]);

    React.useEffect(() => {

        let mounted = true;

        const arr = enrolledModules;

        if (studentAddress) {

            if (enrolledModules.length > 0) {

                if (mounted)
                    setLoading(true);

                enrolledModules.forEach(module => {
                    contract.CreditX.getStudentsCredits(studentAddress, module._code, index)
                        .then(response => {

                            let x = response[6].words[0];

                            if (response[6].words[0] > 0) x /= 1000;

                            const newModule = {
                                _index: response[0].words[0],
                                _code: response[1],
                                _name: response[2],
                                _credits: response[3].words[0],
                                _active: response[4],
                                _graded: response[5],
                                _obtainedCredits: x
                            };

                            const index = arr.indexOf(module);

                            if (index !== -1)
                                arr[index] = newModule;
                            if (mounted)
                                setCreditedModules(arr);
                        })
                        .then(() => {
                            if (mounted)
                                setCreditedModules(arr);
                        })
                        .then(() => {
                            setTimeout(() => {
                                if (mounted) setLoading(false)
                            }, 500);
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

            }

        }

        return () => {
            mounted = false
        }

    }, [enrolledModules]);

    const getFile = () => {
        axios.get(`http://localhost:5000/hash?id=${trn.uid}`)
            .then(res => {
                if (res.data.hash === trn.hash) window.open(`http://localhost:5000/file?file=${path}`, '_blank');
                else setSnackbarState({text: 'Transcript Corrupted.', open: true, variant: snackbarVariant.ERROR});
            })
            .catch(err => {console.log(err)})

    }

    return (
        <div>
            <Dialog
                maxWidth={"lg"}
                fullWidth
                open={addOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Grid container>
                    <Grid container item xs={12} justify="flex-end">
                        <CancelIcon
                            onClick={handleClose}
                            style={{margin: "1rem", cursor: "pointer"}}
                        />
                    </Grid>
                </Grid>
                <DialogTitle id="Add Module-dialog-title" style={{marginLeft: '0.5rem'}}>Student Credits | {studentAddress}</DialogTitle>
                <DialogContent>
                    <React.Fragment>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Paper className={classes.paper} style={{padding: '2rem 1rem', backgroundColor: '#BBB'}}>
                                    <Typography variant="h6" component="h2">
                                        Total Credits : {totalCredits}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.paper} style={{padding: '2.31rem 1rem', textAlign: 'center', textDecoration: 'underline'}}>
                                    {
                                        (path !== "")
                                            ? <Typography style={{cursor: 'pointer'}} onClick={() => {getFile()}} variant="body2" component="h2">
                                                View Transferred Transcript
                                            </Typography>
                                            : <Typography variant="body2" component="h2">
                                                Transcript not available
                                            </Typography>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <TextField
                                        id="outlined-select-year"
                                        fullWidth
                                        select
                                        label="Select Year"
                                        size="small"
                                        value={year}
                                        onChange={event => {
                                            setYear(event.target.value);
                                        }}
                                        helperText="Please select a year"
                                        variant="outlined"
                                    >
                                        {[0, 1, 2, 3, 4].map((y) => (
                                            <MenuItem key={y} value={y}>
                                                {
                                                    (y !== 0) ? `Year ${y}` : `All`
                                                }
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} style={{backgroundColor: '#BBB', marginBottom: '2rem'}}>
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Code</strong></TableCell>
                                                <TableCell align="right"><strong>Name</strong></TableCell>
                                                <TableCell align="right"><strong>Total Credits</strong></TableCell>
                                                <TableCell align="right"><strong>Obtained Credits</strong></TableCell>
                                                <TableCell align="right"><strong>Status</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            isLoading
                                                ? <TableBody>
                                                    <TableRow key="0x1">
                                                        <TableCell colSpan={5} align="center"><LinearProgress/></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                                : <TableBody>
                                                    {
                                                        (year === 0) ?
                                                        creditedModules.length > 0
                                                            ? creditedModules.map((module) => (
                                                                <TableRow key={module._code}>
                                                                    <TableCell component="th" scope="row">
                                                                        {module._code}
                                                                    </TableCell>
                                                                    <TableCell align="right">{module._name}</TableCell>
                                                                    <TableCell align="right">{module._credits}</TableCell>
                                                                    {
                                                                        module._graded
                                                                            ? <TableCell align="right">{module._obtainedCredits}</TableCell>
                                                                            : <TableCell align="right">Not Graded</TableCell>
                                                                    }
                                                                    <TableCell
                                                                        align="right">{module._active ? "Active" : "Inactive"}</TableCell>
                                                                </TableRow>
                                                            ))
                                                            : <TableRow key="0x1">
                                                                <TableCell colSpan={5} align="center">No Enrolled Modules</TableCell>
                                                            </TableRow>
                                                            :
                                                            creditedModules.filter(m => m._code.charAt(2) == year).length > 0
                                                                ? creditedModules.filter(m => m._code.charAt(2) == year).map((module) => (
                                                                    <TableRow key={module._code}>
                                                                        <TableCell component="th" scope="row">
                                                                            {module._code}
                                                                        </TableCell>
                                                                        <TableCell align="right">{module._name}</TableCell>
                                                                        <TableCell align="right">{module._credits}</TableCell>
                                                                        {
                                                                            module._graded
                                                                                ? <TableCell align="right">{module._obtainedCredits}</TableCell>
                                                                                : <TableCell align="right">Not Graded</TableCell>
                                                                        }
                                                                        <TableCell
                                                                            align="right">{module._active ? "Active" : "Inactive"}</TableCell>
                                                                    </TableRow>
                                                                ))
                                                                : <TableRow key="0x1">
                                                                    <TableCell colSpan={5} align="center">No Enrolled Modules</TableCell>
                                                                </TableRow>
                                                    }
                                                </TableBody>
                                        }
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                </DialogContent>
                <Grid container>
                    <Grid container item xs={12} justify="center">

                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}
