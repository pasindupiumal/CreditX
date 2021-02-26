import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

import LandingPage from "./LandingPage"
import MainContainer from "./MainContainer"
import Snackbar from "../modals/Snackbar";
import getTheme from "../../theme/index";
import {SnackbarProvider} from "../../context/SnackbarContext";
import {UserProvider, userRole} from "../../context/UserContext";
import {ContractProvider} from "../../context/ContractContext";
import StudentContainer from "./StudentContainer";
import EmployerContainer from "./EmployerContainer";
import UniversityContainer from "./UniversityContainer";

const theme = getTheme('1rem 0 1rem 0', 'rgb(120, 120, 120)');

export default function AppRouter({account, contract, connection}) {

    const [user, setUser] = React.useState({_address: 0x0, _name: 0x0, _active: false, _role: "", _email: ""});
    const [snackbarState, setSnackbarState] = React.useState({text: '', variant: 'info', open: false});

    const resetSnackbar = () => {
        setSnackbarState({text: '', variant: 'info', open: false})
    };

    React.useEffect(() => {
        if (sessionStorage.getItem('user'))
            setUser(JSON.parse(sessionStorage.getItem('user')))
    }, []);

    const loginAdmin = async () => {
        const response = await contract.CreditX.adminsByAddress(account);
        if (response._address == 0) {
            setSnackbarState({text: 'Please use an administrator account', variant: 'info', open: true});
        } else {
            const userSession = {_address: response._address, _name: response._name, _email: "", _active: response._active, _role: userRole.ADMIN};
            sessionStorage.clear();
            sessionStorage.setItem('user', JSON.stringify(userSession));
            setUser({_address: response._address, _name: response._name, _email: "", _active: response._active, _role: userRole.ADMIN});
        }
    }

    const loginStudent = async () => {
        const response = await contract.CreditX.studentsByAddress(account);
        if (response._address == 0) {
            setSnackbarState({text: 'Please use an student account', variant: 'info', open: true});
        } else {
            const userSession = {_address: response._address, _name: response._name, _email: "", _active: response._active, _role: userRole.STUDENT};
            sessionStorage.clear();
            sessionStorage.setItem('user', JSON.stringify(userSession));
            setUser({_address: response._address, _name: response._name, _email: "", _active: response._active, _role: userRole.STUDENT});
        }
    }

    const loginEmployer = async () => {
        const response = await contract.External.employersByAddress(account);
        if (response._address == 0) {
            setSnackbarState({text: 'Please use an employer account', variant: 'info', open: true});
        } else {
            const userSession = {_address: response._address, _name: response._company, _email: response._email, _active: response._active, _role: userRole.EMPLOYER};
            sessionStorage.clear();
            sessionStorage.setItem('user', JSON.stringify(userSession));
            setUser({_address: response._address, _name: response._company, _email: response._email, _active: response._active, _role: userRole.EMPLOYER});
        }
    }

    const loginUniversity = async () => {
        const response = await contract.XUni.universityByAddress(account);
        if (response._address == 0) {
            setSnackbarState({text: 'Please use an external university account', variant: 'info', open: true});
        } else {
            const userSession = {_address: response._address, _name: response._name, _email: response._email, _active: response._active, _role: userRole.UNIVERSITY};
            sessionStorage.clear();
            sessionStorage.setItem('user', JSON.stringify(userSession));
            setUser({_address: response._address, _name: response._name, _email: response._email, _active: response._active, _role: userRole.UNIVERSITY});
        }
    }

    const logout = () => {
        setUser({_address: 0x0, _name: 0x0, _active: false, _email: ""});
        sessionStorage.clear();
    }

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <ContractProvider value={{contract}}>
                    <UserProvider value={{user, loginAdmin, loginStudent, loginEmployer, loginUniversity, logout}}>
                        <SnackbarProvider value={{setSnackbarState}}>
                            <Snackbar snackbarState={snackbarState} resetSnackbar={resetSnackbar}/>
                            <Switch>
                                <Route exact path="/" render={(props) => (
                                    <LandingPage{...props} loginAdmin={loginAdmin} loginStudent={loginStudent}
                                                loginEmployer={loginEmployer} loginUniversity={loginUniversity}
                                                connection={connection} account={account}
                                                user={user}/>)}/>
                                <Route path="/main" component={() => <MainContainer/>}/>
                                <Route path="/student" component={() => <StudentContainer/>}/>
                                <Route path="/employer" component={() => <EmployerContainer/>}/>
                                <Route path="/university" component={() => <UniversityContainer/>}/>
                            </Switch>
                        </SnackbarProvider>
                    </UserProvider>
                </ContractProvider>
            </Router>
        </ThemeProvider>
    );
}
