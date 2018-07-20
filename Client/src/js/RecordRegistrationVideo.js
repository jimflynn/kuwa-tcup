import React, { Component } from 'react';
import { connect } from 'react-redux';

import kuwaIcon from '../img/kuwa-icon.png';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class RecordRegistrationVideo extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <img src={ kuwaIcon } alt="Kuwa Icon" />
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography variant="headline">
                                            <strong>Step 2</strong> – Record your registration video.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            Every living human is entitled to exactly one Kuwa ID. To help us identify you, we need a video of you speaking the following numbers:
                        </Typography>
                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            <strong>Here will lie an amazing Challenge Number</strong>
                        </Typography>
                        <div align="center">
                            <Button variant="contained" style={{backgroundColor: buttonColor}}>
                                Record Video <i class="material-icons">videocam</i>
                            </Button>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecordRegistrationVideo));