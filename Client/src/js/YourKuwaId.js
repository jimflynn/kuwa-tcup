import React, { Component } from 'react';
import { connect } from 'react-redux';

import { startScanner, stopScanner, qrCodeFound, mobileStartScanner } from './actions/qrActions';
import Instascan from 'instascan';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

import { paperHeader } from './paperHeader';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class YourKuwaId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoWidth: 0,
            videoHeight: 0,
            scanner: {}
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Your Kuwa ID") }

                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            <strong>Kuwa ID:</strong>
                        </Typography>
                        <Typography variant="title" align="center" style={{wordWrap: "break-word", margin: "1em"}}>
                            { this.props.kuwaId ? this.props.kuwaId : "You first need to create your Kuwa Identity" }
                        </Typography>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            The following QR code image represents your Kuwa ID:
                        </Typography>
                        <Grid align="center">
                            <img src={ this.props.qrCodeSrc } alt="Here will lie a QR code" />
                        </Grid>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            <strong>Step 3 –</strong> Please ask other people that you know to scan your QR code.
                        </Typography>
                        <Grid container spacing={24} justify="center">
                            <Grid item xs={6} align="center">
                                <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => handleScanAction(this.props, this.state, this.setState.bind(this))}>
                                    { this.props.qrStatus === "Scanning" ? "Stop scan" : "Scan an ID"}
                                </Button>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => alert("JAJAJAJAJAJA")}>
                                    Export your ID
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container justify="center" style={{margin: "1em"}}>
                            <Grid item xs={12} align="center">
                                <video id="qrScanner" style={{ width: this.state.videoWidth, height: this.state.videoHeight }} />
                            </Grid>
                        </Grid>

                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            { scannedKuwaId(this.props) }
                        </Typography>

                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const scannedKuwaId = (props) => {
    switch(props.qrStatus) {
        case "Found":
            return props.lastScannedKuwaId + " is now part of your network.";
        case "Invalid":
            return "The scanned QR code is not a Kuwa ID.";
        default:
            return null;
    }
}

const handleScanAction = (props, state, setState) => {
    if (props.qrStatus === "Scanning") {
        props.stopScanner(state.scanner);
        setState({ 
            videoWidth: 0,
            videoHeight: 0 })
    } else {
        setState({ 
            videoWidth: "90%",
            videoHeight: "auto" })
        scanId(props, setState)
    }
}

const scanId = (props, setState) => {
    if(!window.usingCordova) {
        let scanner = new Instascan.Scanner({ video: document.getElementById('qrScanner') });
        setState({ scanner });
        scanner.addListener('scan', function(kuwaId) {
            props.qrCodeFound(kuwaId, scanner);
            setState({ 
                videoWidth: 0,
                videoHeight: 0 })
        });
        props.startScanner(scanner);
    } else {
        props.mobileStartScanner();
    }
}

const mapStateToProps = state => {
    return {
        qrCodeSrc: state.kuwaReducer.kuwaId.qrCodeSrc,
        kuwaId: state.kuwaReducer.kuwaId.address,
        scanner: state.qrReducer.scanner,
        qrStatus: state.qrReducer.qrStatus,
        lastScannedKuwaId: state.qrReducer.lastScannedKuwaId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startScanner: scanner => {
            dispatch(startScanner(scanner))
        },
        stopScanner: scanner => {
            dispatch(stopScanner(scanner))
        },
        qrCodeFound: (kuwaId, scanner) => {
            dispatch(qrCodeFound(kuwaId, scanner))
        },
        mobileStartScanner: () => {
            dispatch(mobileStartScanner())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YourKuwaId));