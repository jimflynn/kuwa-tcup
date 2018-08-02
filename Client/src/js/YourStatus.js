import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { paperHeader } from './paperHeader';

import { getRegistrationStatus } from './actions/kuwaActions';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class YourStatus extends Component {
    componentDidMount() {
        this.props.getRegistrationStatus(this.props.privateKey, this.props.abi, this.props.contractAddress, this.props.kuwaId)
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Your Status") }

                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            <strong>{ "Status: " + this.props.registrationStatus }</strong>
                        </Typography>
                        
                        <Grid align="center">
                            <i className="material-icons">warning</i>
                        </Grid>
                        
                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            Here there will be an explanation of your status.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        registrationStatus: state.kuwaReducer.kuwaId.registrationStatus,
        kuwaId: state.kuwaReducer.kuwaId.address,
        privateKey: state.kuwaReducer.kuwaId.privateKey,
        abi: state.kuwaReducer.kuwaId.abi,
        contractAddress: state.kuwaReducer.kuwaId.contractAddress,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        navigateTo: link => {
            dispatch(push(link))
        },
        getRegistrationStatus: (privateKey, abi, contractAddress, kuwaId) => {
            dispatch(getRegistrationStatus(privateKey, abi, contractAddress, kuwaId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YourStatus));