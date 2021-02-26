import React from "react";
import {Button, Grid, TextField,} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/ClearRounded";
import snackbarContext from "../../../context/SnackbarContext";
import {snackbarVariant} from "../../../context/SnackbarContext";

export default function AddTransferStudentModal({addOpen, setAddOpen, classes, contract, user, req}) {

    const {setSnackbarState} = React.useContext(snackbarContext);

    const [student, setStudent] = React.useState({_id: "", _name: req._studentName, _address: ""})

    React.useEffect(() => {
        console.log(req)
        setStudent({...student, _name: req._studentName});
    }, [req._studentName]);

    const handleClose = () => {
        setAddOpen(false);
    };

    const addStudent = () => {

        try {

            contract.CreditX.addStudent(student._id, student._name, student._address, true, true, req._creditCount, {
                from: user._address,
                gas: 3000000
            }).once('receipt', receipt => {
                setSnackbarState({text: 'Student Added', open: true, variant: snackbarVariant.SUCCESS})
                console.log(receipt);
                handleClose();
                fetch(`http://localhost:5000/update?id=${req._studentId}`, {
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        "newId": student._id
                    })
                }).then(res => {
                    if (res.status === "failed")
                        setSnackbarState({text: 'Transcript Failed', open: true, variant: snackbarVariant.ERROR})
                    else
                        setSnackbarState({text: 'Transcript Updated', open: true, variant: snackbarVariant.SUCCESS})
                });
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
        <div>
            <Dialog
                maxWidth={"md"}
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
                <DialogTitle id="Add Module-dialog-title">Add Transfer Student</DialogTitle>
                <DialogContent style={{width: "30rem"}}>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Student ID"
                        variant="outlined"
                        value={student._id}
                        onChange={event => {
                            setStudent({...student, _id: event.target.value})
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Student Name"
                        variant="outlined"
                        value={student._name}
                        onChange={event => {
                            setStudent({...student, _name: event.target.value})
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Ethereum Address"
                        variant="outlined"
                        value={student._address}
                        onChange={event => {
                            setStudent({...student, _address: event.target.value})
                        }}
                    />
                </DialogContent>
                <Grid container>
                    <Grid container item xs={12} justify="center">
                        <Button
                            className={classes.btnActive}
                            style={{
                                textAlign: "center",
                                margin: "2rem",
                                borderRadius: 24,
                            }}
                            onClick={() => addStudent()}
                        >
                            Add Transfer Student
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}
