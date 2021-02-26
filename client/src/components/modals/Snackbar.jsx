import React from 'react';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: 'rgba(94,128,0,0.7)',
        opacity: .8,
        borderRadius: '2rem'
    },
    error: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        opacity: .8,
        borderRadius: '2rem'
    },
    info: {
        backgroundColor: 'rgba(99,59,255,0.7)',
        opacity: .8,
        borderRadius: '2rem'
    },
    warning: {
        backgroundColor: 'rgba(205,255,0,0.7)',
        opacity: .8,
        borderRadius: '2rem'
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

export default function CustomizedSnackbar({snackbarState, resetSnackbar}) {
    const [state, setState] = React.useState({text: '', variant: 'info', open: false});

    React.useEffect(() => {if (snackbarState) setState(snackbarState)}, [snackbarState]);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setState({text: '', variant: 'info', open: false});
        resetSnackbar();
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={state.open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper
                    onClose={handleClose}
                    variant={state.variant}
                    message={state.text}
                />
            </Snackbar>
        </div>
    );
}