import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { paperHeader } from './paperHeader';

import { getKuwaNetwork } from './actions/kuwaActions';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class YourNetwork extends Component {
    componentDidMount() {
        this.props.getKuwaNetwork(this.props.abi, this.props.contractAddress, this.props.kuwaId)
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Your Network") }

                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            <strong>These are the people whose QR codes you have scanned:</strong>
                        </Typography>

                        { renderNetwork(this.props) }

                    </Paper>
                </Grid>
            </Grid>            
        );
    }
}

const renderNetwork = (props) => {
    let kuwaNetwork = props.kuwaNetwork.map((kuwaId, id) => {
        return { id, kuwaId }
    });

    return (
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Kuwa ID</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {kuwaNetwork.map(n => {
                return (
                    <TableRow key={n.id}>
                        <TableCell component="th" scope="row">
                            {n.kuwaId}
                        </TableCell>
                    </TableRow>
                );
            })}
            </TableBody>
        </Table>
    )
}

const mapStateToProps = state => {
    return {
        kuwaId: state.kuwaReducer.kuwaId.address,
        abi: state.kuwaReducer.kuwaId.abi,
        contractAddress: state.kuwaReducer.kuwaId.contractAddress,
        kuwaNetwork: state.kuwaReducer.kuwaId.kuwaNetwork
    }
}

const mapDispatchToProps = dispatch => {
    return {
        navigateTo: link => {
            dispatch(push(link))
        },
        getKuwaNetwork: (abi, contractAddress, kuwaId) => {
            dispatch(getKuwaNetwork(abi, contractAddress, kuwaId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YourNetwork));