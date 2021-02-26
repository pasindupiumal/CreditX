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
import ModuleIcon from "@material-ui/icons/MenuBookRounded";
import AdminIcon from "@material-ui/icons/ComputerRounded";
import StudentIcon from "@material-ui/icons/SchoolRounded";
import EnrollmentIcon from "@material-ui/icons/LibraryBooksRounded";
import GradingIcon from "@material-ui/icons/GradeRounded";
import ApartmentIcon from "@material-ui/icons/ApartmentRounded";
import AdminPage from "../admin/AdminPage";
import StudentPage from "../admin/StudentPage";
import ModulePage from "../admin/ModulePage";
import EnrollmentPage from "../admin/EnrollmentPage.jsx";
import GradingPage from "../admin/GradingPage";
import userContext, {userRole} from "../../context/UserContext";
import EmployerPage from "../admin/EmployerPage";
import UniversityPage from "../admin/UniversityPage";
import TransferPage from "../admin/TransferPage";

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

export default function MainContainer() {

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

    if (user._active && user._role === userRole.ADMIN) {

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
                        <Typography className={classes.profileStatus}>Admin</Typography>
                    </div>
                    <Divider hidden={!open} className={classes.dividerClass}/>
                    <List>
                        <ListItem
                            component={ReactLink}
                            to={"/main"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <AdminIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Admin"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/module"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <ModuleIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Modules"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/student"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <StudentIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Students"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/enrollment"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <EnrollmentIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Enrollments"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/grading"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <GradingIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Gradings"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/employer"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <ApartmentIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Employers"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/university"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <ApartmentIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Universities"}/>
                        </ListItem>
                        <ListItem
                            component={ReactLink}
                            to={"/main/transfer"}
                            button
                            className={classes.listItemClass}
                        >
                            <ListItemIcon>
                                {" "}
                                <ApartmentIcon className={classes.drawerIcon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Transfers"}/>
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
                                path="/main"
                                render={(props) => (
                                    <AdminPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/module"
                                render={(props) => (
                                    <ModulePage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/student"
                                render={(props) => (
                                    <StudentPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/enrollment"
                                render={(props) => (
                                    <EnrollmentPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/grading"
                                render={(props) => (
                                    <GradingPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/employer"
                                render={(props) => (
                                    <EmployerPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/university"
                                render={(props) => (
                                    <UniversityPage {...props} classes={classes}/>
                                )}
                            />
                            <Route
                                exact
                                path="/main/transfer"
                                render={(props) => (
                                    <TransferPage {...props} classes={classes}/>
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
