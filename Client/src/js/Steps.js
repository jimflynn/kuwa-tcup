import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';

import { paperHeader } from './paperHeader';
import RestoreState from './RestoreState';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

import { loadState } from './actions/kuwaActions';
import { toggleRestoreState } from './actions/screenActions';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }),
    label: Object.assign({}, theme.typography.button, {
        backgroundColor: buttonColor,
        padding: theme.spacing.unit * 1.2
    })
});

/**
 * This component simply renders the steps that user will need to follow to obtain a valid 
 * Kuwa ID and how to register it.
 * @class Steps
 * @extends Component
 */
class Steps extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Create your Kuwa ID") }

                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 1 –</strong> Create a registration request.
                        </Typography>
                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 2 –</strong> Record a registration video.
                        </Typography>
                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>Step 3 –</strong> Download your credentials.
                        </Typography>
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            After the Kuwa network validates your ID, you can use your Kuwa ID to access Kuwa-compatible services, such as basic income distributions, financial services, voting, etc.
                        </Typography>
                        <div align="center">
                            <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => this.props.navigateTo('/ProvideCredentials')}>
                                Continue
                            </Button>
                        </div>

                        <Divider style={{ margin: "1em" }} />

                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            If you already have a Kuwa ID, you can load your wallet:
                        </Typography>
                        <div align="center">
                            <InputLabel htmlFor="fileinput" className={classes.label} style={{ borderRadius: "2px", boxShadow: "0 1px 4px rgba(0, 0, 0, .6)" }}>Load Wallet</InputLabel>
                            <Input type='file' id='fileinput' style={{ display: "none" }} onInput={event => { 
                                this.props.loadState(event.target.files[0]);
                                this.props.toggleRestoreState()
                            }}
                            onClick={(event)=> { 
                                event.target.value = null
                            }} />
                        </div>
                        <RestoreState />
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
        },
        toggleRestoreState: () => {
            dispatch(toggleRestoreState())
        },
        loadState: jsonFile => {
            dispatch(loadState(jsonFile))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Steps));
