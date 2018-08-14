import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import config from 'config';

import { Loading } from './Load';
import { paperHeader } from './paperHeader';

import { toggleKuwaPasswordVisibility, togglePasscodeVisibility } from './actions/screenActions';
import { provideCredentials } from './actions/kuwaActions';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

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

/**
 * The user provides the credentials. The Kuwa Password is created by the user and is used to
 * create his wallet and encrypt it. It's very important for the user NOT to forget this
 * password. The passcode is provided by the Sponsor via email and can be requested by the
 * Client. In the config file, the passcode field can be disabled and the "Test" string will
 * be automatically placed as the default passcode. If so, the Client only needs to provide
 * a Kuwa Password.
 * Also the current component checks that the Kuwa Password and the Passcode fields are not
 * empty. In the future a better check can be implemented and the logic can be moved to the
 * actions folder in order to keep the business logic separate from the View.
 * @class ProvideCredentials
 * @extends Component
 */
class ProvideCredentials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passcode: config.enablePasscode ? "" : "Test",
            kuwaPassword: ""
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Step 1 – Provide credentials.") }

                        { this.props.loading ? <Loading loadingMessage="We are creating your Kuwa ID and requesting your sponsorship. This may take a few minutes..." /> : renderContent(this.props, this.state, this.setState.bind(this)) }
                    
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const renderContent = (props, state, setState) =>  (
    <div>
        { props.registrationStatus === "New" ? renderProvideCredentials(props, state, setState) : renderDone(props) }
    </div>
)

const renderProvideCredentials = (props, state, setState) =>  (
    <div>
    <Typography variant="title" align="left" style={{ margin: "1em" }}>
        Kuwa registrations must have a sponsor. <strong>The Kuwa Foundation</strong> is the sponsor of your Kuwa Basic Income Registration. For credentials, we only require that you enter a passcode. If you do not have a passcode, please go to <a href={ config.requestPasscodeUrl } target="_blank">http://kuwa.org</a> to request one.
    </Typography>

    { config.enablePasscode ? 
    <Grid>
        <FormControl style={{width: "100%"}} className={classNames(props.classes.margin, props.classes.textField)}>
            <InputLabel htmlFor="adornment-passcode">Enter the passcode we emailed you</InputLabel>
            <Input
                id="adornment-passcode"
                type={props.showPasscode ? 'text' : 'password'}
                value={state.passcode}
                onChange={event => setState({passcode: event.target.value})}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="Toggle passcode visibility"
                    onClick={props.togglePasscodeVisibility}
                    onMouseDown={event => event.preventDefault()}
                    >
                        {props.showPasscode ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
                }
            />
        </FormControl>
    </Grid>
    : null }
    
    <Grid>
        <FormControl style={{width: "100%"}} className={classNames(props.classes.margin, props.classes.textField)}>
            <InputLabel htmlFor="adornment-kuwaPassword">Choose a Kuwa password</InputLabel>
            <Input
                id="adornment-kuwaPassword"
                type={props.showKuwaPassword ? 'text' : 'password'}
                value={state.kuwaPassword}
                onChange={event => setState({kuwaPassword: event.target.value})}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="Toggle Kuwa Password visibility"
                    onClick={props.toggleKuwaPasswordVisibility}
                    onMouseDown={event => event.preventDefault()}
                    >
                        {props.showKuwaPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
                }
            />
        </FormControl>
    </Grid>

    <div align="center">
        <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => {
                if (state.passcode === "") {
                    alert("Please provide a passcode");
                    return;
                }
                if (state.kuwaPassword === "") {
                    alert("Please provide a password");
                    return;
                }
                props.provideCredentials(state.kuwaPassword, state.passcode)
            }}>
            Continue
        </Button>
    </div>

    </div>
)

const renderDone = props => (
    <div>
    <Typography variant="title" align="center" style={{margin: "1em"}}>
        You have already provided your credentials.
    </Typography>
    <div align="center">
        <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => props.navigateTo('/RecordRegistrationVideo')}>
            Continue
        </Button>
    </div>
    </div>
)

const mapStateToProps = state => {
    return {
        registrationStatus: state.kuwaReducer.kuwaId.registrationStatus,
        showKuwaPassword: state.screenReducer.provideCredentials.showKuwaPassword,
        showPasscode: state.screenReducer.provideCredentials.showPasscode,
        loading: state.kuwaReducer.screen.provideCredentials.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleKuwaPasswordVisibility: () => {
            dispatch(toggleKuwaPasswordVisibility())
        },
        togglePasscodeVisibility: () => {
            dispatch(togglePasscodeVisibility())
        },
        provideCredentials: (kuwaPassword, passcode) => {
            dispatch(provideCredentials(kuwaPassword, passcode))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProvideCredentials));