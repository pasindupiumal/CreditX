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
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";
import AddUniversityModal from "./modals/AddUniversityModal";

export default function UniversityPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [universities, setUniversities] = React.useState([]);
    const [addOpen, setAddOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

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
                .then(() => {
                    setTimeout(() => setLoading(false), 400);
                })
                .catch(err => {
                    console.log(err)
                })

        } catch (err) {

            setSnackbarState({text: 'Failed to call contract.', open: true, variant: snackbarVariant.ERROR})
            console.log(err);

        }

    }, [addOpen]);

    return (
        <React.Fragment>
            <AddUniversityModal addOpen={addOpen} setAddOpen={setAddOpen} classes={classes} contract={contract}
                            user={user}/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Address</strong></TableCell>
                            <TableCell align="right"><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Email</strong></TableCell>
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
                                    <TableCell colSpan={5} align="center"><LinearProgress /></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    universities.length > 0
                                        ? universities.map((uni) => (
                                            <TableRow key={uni._index}>
                                                <TableCell component="th" scope="row">
                                                    {uni._address}
                                                </TableCell>
                                                <TableCell align="right">{uni._name}</TableCell>
                                                <TableCell align="right">{uni._email}</TableCell>
                                                <TableCell align="right">{uni._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right"> </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={5} align="center">No Universities</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}