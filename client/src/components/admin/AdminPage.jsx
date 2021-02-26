import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddRounded";
import AddAdminModal from "./modals/AddAdminModal";
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";


export default function AdminPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [admins, setAdmins] = React.useState([]);
    const [addOpen, setAddOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {

        let mounted = true;

        let arr = [];

        if (mounted)
            setLoading(true);

        try {

            contract.CreditX.adminCount()
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.CreditX.adminsByIndex(i)
                            .then(response => {
                                const admin = {
                                    _index: response[0].words[0],
                                    _name: response[2],
                                    _address: response[1],
                                    _active: response[3]
                                };
                                arr = [...arr, admin];
                                if (mounted)
                                    setAdmins(arr);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .then(() => {
                    setTimeout(() => {if (mounted) setLoading(false)}, 400);
                })
                .catch(error => {
                    console.log(error)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

        return () => {mounted = false}

    }, [addOpen]);

    return (
        <React.Fragment>
            <AddAdminModal addOpen={addOpen} setAddOpen={setAddOpen} classes={classes} contract={contract} user={user}/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right"><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Ethereum Address</strong></TableCell>
                            <TableCell align="right"><strong>Status</strong></TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => setAddOpen(!addOpen)} color="primary"
                                            aria-label="upload picture" component="span">
                                    <AddIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        isLoading
                            ? <TableBody>
                                <TableRow key="0x1">
                                    <TableCell colSpan={4} align="center"><LinearProgress /></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    admins.length > 0
                                        ? admins.map((admin) => (
                                            <TableRow key={admin._address}>
                                                <TableCell align="right">{admin._name}</TableCell>
                                                <TableCell align="right">{admin._address}</TableCell>
                                                <TableCell align="right">{admin._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right"> </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={4} align="center">No Admins</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}
