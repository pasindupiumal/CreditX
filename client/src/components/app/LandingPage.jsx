import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {green, red} from "@material-ui/core/colors";
import {Redirect} from "react-router-dom";
import BackgroundImage from "../../assets/img/land.png";
import Logo from "../../assets/img/creditxLogo.png";
import {userRole} from "../../context/UserContext";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="#">
                CreditX
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
    },
    image: {
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    success: {
        margin: theme.spacing(0),
        backgroundColor: green[500],
    },
    fail: {
        margin: theme.spacing(0),
        backgroundColor: red[500],
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    button: {
        background: 'transparent linear-gradient(99deg, #FC0441 0%, #F62DA8 100%) 0% 0% no-repeat padding-box',
        color: '#FFF',
        borderRadius: '2rem',
        fontSize: '0.8rem',
        '&:hover': {
            backgroundColor: 'linear-gradient(to right, #4ecdc4, #556270)'
        },
        textTransform: 'capitalize',
        margin: '0.6rem 0'
    },
    connectionStatus: {
        margin: '1rem 0'
    }
}));

export default function LandingPage({loginAdmin, loginStudent, loginEmployer, loginUniversity, account, connection, user}) {
    const classes = useStyles();

    if (!user._active) {

        return (
            <Grid container component="main" className={classes.root}>
                <CssBaseline/>
                <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Box mt={2}>
                            <img alt="logo" src={Logo} style={{width: '10rem', height: 'auto', marginBottom: '2rem'}}/>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            style={{width: '23rem', height: '3rem'}}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                loginAdmin()
                            }}
                        >
                            Login as a Administrator
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            style={{width: '23rem', height: '3rem'}}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                loginStudent()
                            }}
                        >
                            Login as a Student
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            style={{width: '23rem', height: '3rem'}}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                loginEmployer()
                            }}
                        >
                            Login as an Employer
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            style={{width: '23rem', height: '3rem'}}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                loginUniversity()
                            }}
                        >
                            Login as an External University
                        </Button>
                        <Grid container style={{marginTop: '2rem'}} className={classes.connectionStatus}>
                            <Grid item xs={4}/>
                            <Grid item xs={3}>
                                <Box mt={1}>
                                    <Typography component="h6" variant="h5">
                                        Connection:
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                {connection ? (
                                    <Avatar className={classes.success}>
                                        <DoneOutlinedIcon/>
                                    </Avatar>
                                ) : (
                                    <Avatar className={classes.fail}>
                                        <ClearOutlinedIcon/>
                                    </Avatar>
                                )}
                            </Grid>
                            <Grid item xs={3}/>
                        </Grid>
                        <Box mt={2}>
                            <Typography align="center" variant="body2" color="textSecondary">
                                Account: {account}
                            </Typography>
                        </Box>
                        <Box style={{marginTop: '4rem'}}>
                            <Copyright/>
                        </Box>
                    </div>
                </Grid>
            </Grid>
        );

    } else {

        if (user._role === userRole.ADMIN)
            return <Redirect exact to="/main"/>;
        else if (user._role === userRole.STUDENT)
            return <Redirect exact to="/student"/>;
        else if (user._role === userRole.UNIVERSITY)
            return <Redirect exact to="/university"/>;
        else
            return <Redirect exact to="/employer"/>;
    }


}
