import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

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

class Steps extends Component {
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
                                            Create your Kuwa ID
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 1 –</strong> Provide credentials.
                        </Typography>
                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 2 –</strong> Record a registration video.
                        </Typography>
                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 3 –</strong> Connect your ID to other IDs.
                        </Typography>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            After the Kuwa network validates your ID, you can use your Kuwa ID to access Kuwa-compatible services, such as basic income distributions, financial services, voting, etc.
                        </Typography>
                        <div align="center">
                            <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => this.props.navigateTo('/ProvideCredentials')}>
                                Continue
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
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Steps));