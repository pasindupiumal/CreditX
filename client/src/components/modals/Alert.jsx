import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({alertState}) => {
    const [state, setState] = React.useState({title: '', text: '', open: false});

    React.useEffect(() => {
        if (alertState.open) setState(alertState);
    }, [alertState]);

    const handleClose = () => {
        setState({title: '', text: '', open: false});
    };

    return (
        <Dialog
            open={state.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{state.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {state.body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;