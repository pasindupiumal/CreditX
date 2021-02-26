import React from "react";
import {Button, Grid, TextField,} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/ClearRounded";
import snackbarContext from "../../../context/SnackbarContext";
import {snackbarVariant} from "../../../context/SnackbarContext";

export default function AddEmployerModal({addOpen, setAddOpen, classes, contract, user}) {

    const {setSnackbarState} = React.useContext(snackbarContext);

    const [employer, setEmployer] = React.useState({_address: "", _company: "", _email: ""})

    const handleClose = () => {
        setAddOpen(false);
    };

    const addEmployer = () => {

        try {

            contract.External.addEmployer(employer._address, employer._company, employer._email, {
                from: user._address,
                gas: 3000000
            }).once('receipt', receipt => {
                setSnackbarState({text: 'Employer Added', open: true, variant: snackbarVariant.SUCCESS})
                console.log(receipt);
                handleClose();
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
                <DialogTitle id="Add Module-dialog-title">Add Employer</DialogTitle>
                <DialogContent style={{width: "30rem"}}>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Ethereum Address"
                        variant="outlined"
                        onChange={event => {
                            setEmployer({...employer, _address: event.target.value})
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Company Name"
                        variant="outlined"
                        onChange={event => {
                            setEmployer({...employer, _company: event.target.value})
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={event => {
                            setEmployer({...employer, _email: event.target.value})
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
                            onClick={() => addEmployer()}
                        >
                            Add Employer
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}
