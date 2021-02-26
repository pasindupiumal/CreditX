import React from "react";
import {Button, Grid, TextField,} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/ClearRounded";
import snackbarContext from "../../../context/SnackbarContext";
import {snackbarVariant} from "../../../context/SnackbarContext";

export default function AddCreditModal({addOpen, setAddOpen, classes, contract, user, address, code}) {

    const {setSnackbarState} = React.useContext(snackbarContext);

    const [marks, setMarks] = React.useState(-1)

    const handleClose = () => {
        setAddOpen(false);
    };

    const setCredits = () => {

        if (marks === -1) {

            setSnackbarState({text: 'Please enter a valid mark', open: true, variant: snackbarVariant.ERROR})

        } else {

            try {

                contract.CreditX.setCredits(address, code, marks, {
                    from: user._address,
                    gas: 3000000
                }).once('receipt', receipt => {
                    setSnackbarState({text: 'Graded', open: true, variant: snackbarVariant.SUCCESS})
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
                <DialogTitle id="Add Module-dialog-title">Set Marks</DialogTitle>
                <DialogContent style={{width: "30rem"}}>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Marks"
                        variant="outlined"
                        onChange={event => {
                            setMarks(parseInt(event.target.value))
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
                            onClick={() => setCredits()}
                        >
                            Add Marks
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}
