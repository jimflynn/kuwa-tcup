import React, { Component } from 'react';
import { connect } from 'react-redux';

import kuwaIcon from '../img/kuwa-icon.png';

import { toggleKuwaPasswordVisibility, togglePasscodeVisibility } from './actions/screenActions';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

let passcode = "";

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }),
    textField: {
        flexBasis: 200,
    },
    margin: {
        margin: theme.spacing.unit,
    }
});

class ProvideCredentials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passcode: "",
            kuwaPassword: ""
        }
    }

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
                                            <strong>Step 1</strong> – Provide credentials.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Typography variant="title" align="left" style={{margin: "1em"}}>
                            Kuwa registrations must have a sponsor. <strong>The Kuwa Foundation</strong> is the sponsor of your Kuwa registration. For credentials, we only require that you enter a passcode. If you do not have a passcode, please go to <a href="http://kuwa.org" target="_blank">http://kuwa.org</a> to request one.
                        </Typography>

                        <Grid>
                        <FormControl style={{width: "100%"}} className={classNames(classes.margin, classes.textField)}>
                            <InputLabel htmlFor="adornment-passcode">Enter the passcode we emailed you</InputLabel>
                            <Input
                                id="adornment-passcode"
                                type={this.props.showPasscode ? 'text' : 'password'}
                                value={this.state.passcode}
                                onChange={event => this.setState({passcode: event.target.value})}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="Toggle passcode visibility"
                                    onClick={this.props.togglePasscodeVisibility}
                                    onMouseDown={event => event.preventDefault()}
                                    >
                                        {this.props.showPasscode ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                        </Grid>
                        <Grid>
                        <FormControl style={{width: "100%"}} className={classNames(classes.margin, classes.textField)}>
                            <InputLabel htmlFor="adornment-kuwaPassword">Choose a Kuwa password</InputLabel>
                            <Input
                                id="adornment-kuwaPassword"
                                type={this.props.showKuwaPassword ? 'text' : 'password'}
                                value={this.state.kuwaPassword}
                                onChange={event => this.setState({kuwaPassword: event.target.value})}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="Toggle Kuwa Password visibility"
                                    onClick={this.props.toggleKuwaPasswordVisibility}
                                    onMouseDown={event => event.preventDefault()}
                                    >
                                        {this.props.showKuwaPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                        </Grid>

                        <div align="center">
                            <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}}>
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
        showKuwaPassword: state.screenReducer.provideCredentials.showKuwaPassword,
        showPasscode: state.screenReducer.provideCredentials.showPasscode
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleKuwaPasswordVisibility: () => {
            dispatch(toggleKuwaPasswordVisibility())
        },
        togglePasscodeVisibility: () => {
            dispatch(togglePasscodeVisibility())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProvideCredentials));