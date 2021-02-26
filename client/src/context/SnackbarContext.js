import React from "react";

const snackbarContext = React.createContext({
    setSnackbarState: () => {}
});

export const snackbarVariant = {
    INFO: 'info',
    ERROR: 'error',
    SUCCESS: 'success'
};

export const SnackbarProvider = snackbarContext.Provider;

export default snackbarContext;