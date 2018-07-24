import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { paperHeader } from './paperHeader';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class YourKuwaId extends Component {
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
                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            { this.props.kuwaId }
                        </Typography>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            The following QR code image represents your Kuwa ID:
                        </Typography>
                        <Grid align="center">
                            <img src={ this.props.qrCodeSrc } />
                        </Grid>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            <strong>Step 3 –</strong> Please ask other people that you know to scan your QR code.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        qrCodeSrc: state.kuwaReducer.kuwaId.qrCodeSrc,
        kuwaId: state.kuwaReducer.kuwaId.address
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YourKuwaId));