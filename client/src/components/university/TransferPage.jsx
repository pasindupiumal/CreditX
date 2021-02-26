import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import ApproveIcon from "@material-ui/icons/CheckRounded";
import UploadIcon from "@material-ui/icons/AddRounded";
import snackbarContext, {snackbarVariant} from "../../context/SnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import userContext from "../../context/UserContext";
import contractContext from "../../context/ContractContext";
import {DropzoneDialog} from 'material-ui-dropzone'
import axios from "axios";

export default function TransferPage({classes}) {

    const {setSnackbarState} = React.useContext(snackbarContext);
    const {user} = React.useContext(userContext);
    const {contract} = React.useContext(contractContext);

    const [transfers, setTransfers] = React.useState([]);
    const [appr, setAppr] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const [uploadOpen, setUploadOpen] = React.useState(false);
    const [uploadVal, setUploadVal] = React.useState("");
    const [fileObjects, setFileObjects] = React.useState([]);

    React.useEffect(() => {

        let arr = [];

        setLoading(true);

        try {

            contract.XUni.universityTransferRequestsCount(user._address)
                .then(count => {
                    for (let i = 0; i < count; i++) {
                        contract.XUni.universityTransferRequests(user._address, i)
                            .then(response => {
                                contract.XUni.universityByAddress(response[3])
                                    .then(res => {
                                        const req = {
                                            _index: response[0].words[0],
                                            _uniIndex: response[1].words[0],
                                            _studentName: response[2],
                                            _universityAddress: response[3],
                                            _approval: response[4],
                                            _active: response[5],
                                            _creditCount: response[6].words[0],
                                            _universityName: res[2],
                                            _studentId: response[7]
                                        };
                                        arr = [...arr, req];
                                        setTransfers(arr);
                                    })
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

    }, [appr]);

    const approve = (uniIndex, response) => {

        try {

            contract.XUni.respondTransferRequest(uniIndex, response, {
                from: user._address,
                gas: 3000000
            }).once('receipt', receipt => {
                setSnackbarState({text: 'Responded', open: true, variant: snackbarVariant.SUCCESS})
                console.log(receipt);
            }).catch((err) => {
                if (err.code === 4001) {
                    setSnackbarState({text: 'Transaction Aborted', open: true, variant: snackbarVariant.ERROR});
                } else if (err.code === -32603) {
                    setSnackbarState({text: 'Invalid Input', open: true, variant: snackbarVariant.ERROR});
                }
            });

        } catch (err) {

            setSnackbarState({
                text: 'Transaction Failed. Check console for details.',
                open: true,
                variant: snackbarVariant.ERROR
            })
            console.log(err);

        }

    };

    const checkTranscript = async id => {
        let res = await fetch(`http://localhost:5000/?id=${id}`);
        return (res.uid === id);
    }

    const handleUpload = async files => {
        const formData = new FormData();
        formData.append('file', fileObjects[0]);
        formData.append('id', uploadVal);

        setUploadOpen(false);

        try {

            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (res.status === "failed") {
                setSnackbarState({
                    text: 'Transaction Failed. Check console for details.',
                    open: true,
                    variant: snackbarVariant.ERROR
                })
            } else {
                setSnackbarState({
                    text: 'Transcript uploaded.',
                    open: true,
                    variant: snackbarVariant.SUCCESS
                })
            }


        } catch (err) {

            console.log(err);
            setUploadOpen(false);

        }
    };

    return (
        <React.Fragment>
            <DropzoneDialog
                open={uploadOpen}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                onSave={() => handleUpload()}
                filesLimit={1}
                fileObjects={fileObjects}
                onChange={files => {
                    setFileObjects(files);
                }}
                onClose={() => setUploadOpen(false)}
                dialogTitle="Upload Transcript"
                maxFileSize={5000000}
            />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Transfer ID</strong></TableCell>
                            <TableCell align="right"><strong>Student Name</strong></TableCell>
                            <TableCell align="right"><strong>University Name</strong></TableCell>
                            <TableCell align="right"><strong>University ETH address</strong></TableCell>
                            <TableCell align="right"><strong>Credit Count</strong></TableCell>
                            <TableCell align="right"><strong>Approval</strong></TableCell>
                            <TableCell align="right"><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        isLoading
                            ? <TableBody>
                                <TableRow key="0x1">
                                    <TableCell colSpan={8} align="center"><LinearProgress/></TableCell>
                                </TableRow>
                            </TableBody>
                            : <TableBody>
                                {
                                    transfers.length > 0
                                        ? transfers.map((req) => (
                                            <TableRow key={req._index}>
                                                <TableCell component="th" scope="row">
                                                    {req._studentId}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {req._studentName}
                                                </TableCell>
                                                <TableCell align="right">{req._universityName}</TableCell>
                                                <TableCell align="right">{req._universityAddress}</TableCell>
                                                <TableCell align="right">{req._creditCount}</TableCell>
                                                <TableCell
                                                    align="right">{req._approval ? "Approved" : "Not Approved"}</TableCell>
                                                <TableCell align="right">{req._active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell align="right">
                                                    {
                                                        req._approval
                                                            ? <IconButton disabled color="primary" aria-label="upload picture"
                                                                          component="span">
                                                                <UploadIcon/>
                                                            </IconButton>
                                                            : <IconButton onClick={() => {
                                                                setUploadVal(req._studentId);
                                                                setUploadOpen(true);
                                                            }} color="primary" aria-label="upload picture" component="span">
                                                                <UploadIcon/>
                                                            </IconButton>
                                                    }
                                                    {
                                                        req._approval
                                                            ? <IconButton disabled color="primary" aria-label="upload picture"
                                                                          component="span">
                                                                <ApproveIcon/>
                                                            </IconButton>
                                                            : <IconButton onClick={() => {
                                                                approve(req._uniIndex, true);
                                                                setAppr(!appr);
                                                            }} color="primary" aria-label="upload picture" component="span">
                                                                <ApproveIcon/>
                                                            </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : <TableRow key="0x1">
                                            <TableCell colSpan={7} align="center">No Transfers</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}