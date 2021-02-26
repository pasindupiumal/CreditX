import React from "react";
import {Button, Grid, MenuItem, TextField,} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CancelIcon from "@material-ui/icons/ClearRounded";
import snackbarContext, {snackbarVariant} from "../../../context/SnackbarContext";

export default function AddTransferModal({addOpen, setAddOpen, classes, contract, user}) {

    const {setSnackbarState} = React.useContext(snackbarContext);

    const [trans, setTrans] = React.useState({_studentName: "", _universityAddress: "", _creditCount: 30, _studentId: ""})

    const [universities, setUniversities] = React.useState([]);

    const handleClose = () => {
        setAddOpen(false);
    };

    React.useEffect(() => {

        let arr = [];

        try {

            contract.XUni.universityCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.XUni.universityByIndex(i)
                            .then(response => {
                                const module = {
                                    _index: response[0].words[0],
                                    _address: response[1],
                                    _name: response[2],
                                    _email: response[3],
                                    _active: response[4]
                                };
                                arr = [...arr, module];
                                setUniversities(arr);
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

    const addTrans = () => {

        try {

            contract.XUni.addTransferRequest(trans._studentName, trans._universityAddress, trans._creditCount, trans._studentId, {
                from: user._address,
                gas: 3000000
            }).once('receipt', receipt => {
                setSnackbarState({text: 'Transfer Added', open: true, variant: snackbarVariant.SUCCESS})
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
                <DialogTitle id="Add Module-dialog-title">New Transfer</DialogTitle>
                <DialogContent style={{width: "30rem"}}>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Transfer ID"
                        variant="outlined"
                        onChange={event => {
                            setTrans({...trans, _studentId: event.target.value})
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Student Name"
                        variant="outlined"
                        onChange={event => {
                            setTrans({...trans, _studentName: event.target.value})
                        }}
                    />
                    <TextField
                        id="outlined-select-student"
                        fullWidth
                        select
                        margin="normal"
                        label="Select University"
                        size="small"
                        value={trans._universityAddress}
                        onChange={event => setTrans({...trans, _universityAddress: event.target.value})}
                        helperText="Please select the University to transfer from"
                        variant="outlined"
                    >
                        {universities.map((uni) => (
                            <MenuItem key={uni._index} value={uni._address}>
                                {uni._name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-student"
                        fullWidth
                        select
                        margin="normal"
                        label="Transferring Credit Amount"
                        size="small"
                        value={trans._creditCount}
                        onChange={event => setTrans({...trans, _creditCount: parseInt(event.target.value)})}
                        helperText="Please select the Credit amount"
                        variant="outlined"
                    >
                        {[30, 60, 90].map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                        ))}
                    </TextField>
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
                            onClick={() => addTrans()}
                        >
                            Add Transfer
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}
