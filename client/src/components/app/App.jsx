import React, {useEffect, useState} from "react";
import CreditXContract from "../../contracts/CreditX.json";
import ExternalContract from "../../contracts/External.json";
import XUniContract from "../../contracts/XUni.json";
import getWeb3 from "../../util/getWeb3";
import TruffleContract from "truffle-contract";

import AppRouter from "./AppRouter";
import AlertDialog from "../modals/Alert";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

const App = () => {

    const [state, setState] = useState({connection: false, web3: null, accounts: null, contract: {CreditX: null, External: null, XUni: null}});
    const [alertState, setAlertState] = useState({title: '', body: '', open: false});

    useEffect(() => {
        initialize();
    }, []);
    useEffect(() => {
        if (state.contract.CreditX)
            connect()
                .then(response => {
                    response
                        ? console.log('Connection : Success')
                        : console.log('Connection : Failed')
                });
    }, [state.contract]);

    const initialize = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();

            const CreditX = TruffleContract(CreditXContract);
            const External = TruffleContract(ExternalContract);
            const XUni = TruffleContract(XUniContract);

            CreditX.setProvider(web3.currentProvider);
            External.setProvider(web3.currentProvider);
            XUni.setProvider(web3.currentProvider);

            const creditXInstance = await CreditX.deployed();
            const externalInstance = await External.deployed();
            const xUniInstance = await XUni.deployed();

            setState({web3: web3, accounts: accounts, contract: {CreditX: creditXInstance, External: externalInstance, XUni: xUniInstance}});
        } catch (error) {
            setAlertState({
                title: 'Error',
                body: 'Failed to load web3, accounts, or contract. Check console for details.',
                open: true
            });
            console.error(error);
        }
    };

    const connect = async () => {
        let response = null;
        try {
            response = await state.contract.CreditX.connect();
        } catch (e) {
            console.log(e)
        }

        setState({...state, connection: response});
        return response;
    };

    if (!state.web3) {
        return <div style={{
            width: '100vw',
            height: '10rem',
            position: 'absolute',
            margin: 'auto',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        }}>
            <AlertDialog alertState={alertState}/>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h6" component="h2" style={{marginBottom: '1rem', marginLeft: '1rem'}}>
                        Loading Web3, Contract and Accounts
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <LinearProgress />
                </Grid>
            </Grid>
        </div>;
    } else {
        return <AppRouter account={state.accounts[0]} connection={state.connection} contract={state.contract}/>;
    }

}

export default App;
