import React, { Component } from 'react';
import { Loading } from './Load';
import { paperHeader } from './paperHeader';
import { requestPasscode } from './actions/kuwaActions';
import { toggleKuwaPasswordVisibility, togglePasscodeVisibility } from './actions/screenActions';
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
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

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

class RequestPasscode extends Component{
    constructor(props){
        super(props);
        this.state = {
            fullName : "",
            email : "",
            purpose : "",
            isRequested: false
        };
    }


    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                        { paperHeader("Request a Kuwa Registration Passcode")}


                        {this.state.isRequested === false ? this.props.loading ? <Loading loadingMessage="Requesting form for generating a user Passcode" /> : renderContent(this.props, this.state, this.setState.bind(this)) : this.props.loading ? <Loading loadingMessage="Requesting form for generating a user Passcode" /> : kuwaPasscodeRequested(this.props, this.state, this.setState.bind(this))}
               
                            
                        
                    
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const renderContent = (props, state, setState) =>  (
    <div>
    <Typography variant="title" align="left" style={{margin: "1em"}}>
        The Kuwa Identity platform is in alpha testing. Please use this form to request a passcode, which is the credential that you need to register. After we approve your request, we’ll email your passcode to you.
    </Typography>

    <Grid>
    <FormControl style={{width: "100%"}} className={classNames(props.classes.margin, props.classes.textField)}>
        
        <ValidatorForm
            ref="form"
            onError={errors => console.log(errors)}
        >

        <TextValidator
            label="Enter your Full Name"
            onChange={event => setState({fullName: event.target.value})}
            name="fullName"
            value={state.fullName}
            validators={['required']}
            errorMessages={['this field is required']}
            />

        </ValidatorForm>

    </FormControl>
    </Grid>
    
    <Grid>
    <FormControl style={{width: "100%"}} className={classNames(props.classes.margin, props.classes.textField)}>
        <ValidatorForm
                ref="form"
                onError={errors => console.log(errors)}
        >

            <TextValidator
                label="Enter your Email Address"
                onChange={event => setState({email: event.target.value})}
                name="Email"
                value={state.email}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
            />

        </ValidatorForm>
    </FormControl>
    </Grid>

    <Grid>
    <FormControl style={{width: "100%"}} className={classNames(props.classes.margin, props.classes.textField)}>
        <InputLabel htmlFor="adornment-purpose">Why are you requesting a Kuwa Passcode?</InputLabel>
        <Input
            id="adornment-purpose"
            value={state.purpose}
            onChange={event => setState({purpose: event.target.value})}
        />
    </FormControl>
    </Grid>

    <div align="center">
        <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => {
            if (state.fullName === ""){
                alert("Please provide your Full Name");
                return;
            }
            if (state.email === ""){
                alert("Please provide an Email Address");
                return;
            }
            requestPasscode(state.fullName, state.email);
            setState({isRequested : true});
            }
        }>
            Submit Request
        </Button>
    </div>
    </div>
)

const kuwaPasscodeRequested = (props, state, setState) =>  (
    <div align="center" style={{margin: "1em"}}>
    Your Kuwa Passcode has been sent to the Email address you provided.

    <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => {
            
            window.location.href = "https://alpha.kuwa.org/client/";
            
            }
        }>
            Request Sponsorship
        </Button>
    </div>
)


export default (withStyles(styles)(RequestPasscode));