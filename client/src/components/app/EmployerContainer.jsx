import React from "react";
import {Link as ReactLink, Redirect, Route, Switch} from "react-router-dom";
import clsx from "clsx";
import {makeStyles, useTheme, withStyles} from "@material-ui/core/styles";
import {Avatar, Badge, Drawer, Grid,} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import GradingIcon from "@material-ui/icons/GradeRounded";
import RequestPage from "../employer/RequestPage";
import userContext, {userRole} from "../../context/UserContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        background: "#fbfbfb",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: "#4b79a2",
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        backgroundColor: "#24262B",
        padding: "0.8rem",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#24262B",
        padding: "0.2rem",
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: "100%",
        overflow: "auto",
        width: "100%",
    },
    bigAvatar: {
        margin: "0 35%",
        width: 80,
        height: 80,
    },
    profileName: {
        textAlign: "center",
        margin: "0.5rem",
        color: "#fff",
    },
    profileStatus: {
        textAlign: "center",
        color: "#28F6EF",
        fontSize: "0.8rem",
    },
    listItemClass: {
        borderRadius: "1.5rem",
        backgroundColor: "#313337",
        color: "#fff",
        margin: "0.5rem 0.1rem",
        "&:hover": {
            backgroundColor: "#283339",
        },
    },
    drawerIcon: {
        color: "#fff",
    },
    dividerClass: {
        opacity: "0.4",
        margin: "2rem 0rem",
        backgroundColor: "#fff",
    },
    searchContainer: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 300,
        borderRadius: 24,
    },
    iconButton: {
        padding: 10,
    },
    detailsroot: {
        backgroundColor: "#FBFBFB",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0px 3px 6px #00000029",
        minHeight: "40rem",
    },
    getStartedButton: {
        borderRadius: 24,
        background:
            "transparent linear-gradient(108deg, #FC0441 0%, #F62DA8 100%) 0% 0% no-repeat padding-box",
        padding: " 0.5rem 2rem",
        color: "#fff",
    },
    cDeleteButton: {
        backgroundColor: "#f8767d",
        color: "#FFFFFF",
        textTransform: "none",
        borderRadius: "0.3rem",
        marginRight: "0.5rem",
        margin: "auto",
        textAlign: "center",
        padding: "0.2rem 0rem",
        fontSize: "0.8rem",
        "&:hover": {
            backgroundColor: "#f8767d",
        },
    },
    btnActive: {
        backgroundColor: "#4c79a2",
        color: "#FFFFFF",
        textTransform: "none",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        fontSize: "0.8rem",
        "&:hover": {
            backgroundColor: "#4c79a2",
        },
    },
    table: {
        minWidth: 650,
    },
    paper: {
        padding: '1rem'
    },
}));
const StyledBadge = withStyles((theme) => ({
    badge: {
        right: 3,
        top: 1,
        border: "2px solid ",
        padding: "0 4px",
        borderColor: "#ffffff",
        color: "#ffffff",
        backgroundColor:
            "transparent linear-gradient(148deg, #02F0C7 0%, #02F0C7 0%, #02F0C7 17%, #02F0C7 92%, #02F0C7 100%) 0% 0% no-repeat padding-box",
    },
}))(Badge);

export default function EmployerContainer() {

    const {user, logout} = React.useContext(userContext);

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    if (user._active && user._role === userRole.EMPLOYER) {

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    elevation={2}
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Grid container spacing={0}>
                            <Grid container item xs={4} justify="center"/>
                            <Grid container item xs={8} justify="flex-end" alignItems="center">
                                <Typography align="center" variant="body2" style={{color: 'white'}}>
                                    Account: {user._address}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon className={classes.drawerIcon}/>
                            ) : (
                                <ChevronLeftIcon className={classes.drawerIcon}/>
                            )}
                        </IconButton>
                    </div>

                    <div hidden={!open}>
                        <Avatar
                            alt={user._name}
                            src="#"
                            className={classes.bigAvatar}
                        />
                        <Typography className={classes.profileName}>
                            {user._name}
                        </Typography>
                        <Typography className={classes.profileStatus}>Employer</Typography>
                    </div>
                    <Divider hidden={!open} className={classes.dividerClass}/>
                    <List>
                        <ListItem
                            component={ReactLink}
                            to={"/employer"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <GradingIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Requests"}/>
                        </ListItem>
                    </List>
                    <ListItem
                        onClick={() => logout()}
                        button
                        style={{color: "#fff", marginTop: "2rem"}}
                    >
                        <ListItemIcon>
                            {" "}
                            <InboxIcon className={classes.drawerIcon}/>{" "}
                        </ListItemIcon>
                        <ListItemText primary={"Log Out"}/>
                    </ListItem>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <div style={{minHeight: "40rem"}}>
                        <Switch>
                            <Route
                                exact
                                path="/employer"
                                render={(props) => (
                                    <RequestPage {...props} classes={classes}/>
                                )}
                            />
                        </Switch>
                    </div>
                </main>
            </div>
        );

    } else {

        return <Redirect exact to="/"/>;

    }

}
