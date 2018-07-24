import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { paperHeader } from './paperHeader';

import Instascan from 'instascan';
import { startScanner, qrCodeFound, mobileStartScanner } from './actions/qrActions';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class Steps extends Component {
    componentDidMount() {
        if(!window.usingCordova) {
            scanner = new Instascan.Scanner({ video: document.getElementById('qrScanner') });
            scanner.addListener('scan', (function(kuwaId) {
                this.props.qrCodeFound(kuwaId, scanner);
            }).bind(this));
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Your Kuwa ID") }

                        { showQRCode(this.props) }

                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const showQRCode = (props) => {
    if (props.qrCodeSrc) {
        return (
            <Grid container>
                <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                    Kuwa ID:
                </Typography>
                <Typography variant="title" align="center" style={{margin: "1em"}}>
                    <strong>{props.kuwaId}</strong>
                </Typography>
                <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                    The following QR code image represents your Kuwa ID:
                </Typography>
                <Typography variant="title" align="center" style={{margin: "1em"}}>
                    <img className="responsive-kuwa-img" src={props.qrCodeSrc} alt="QRCode"/>
                </Typography>
                <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                    <strong>Step 3 -</strong> Please ask other people that you know to scan your QR code.
                </Typography>
            </Grid>
        );
    }
    return (
        <Grid container>
            <Typography variant="title" align="center" style={{margin: "1em"}}>
                <strong>You first need to create your Kuwa Identity</strong>
            </Typography>
        </Grid>
    );
}

const mapStateToProps = state => {
    return {
        qrCodeSrc: state.kuwaReducer.kuwaId.qrCodeSrc,
        kuwaId: state.kuwaReducer.kuwaId.address
    }
}

const mapDispatchToProps = dispatch => {
    return {
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Steps));