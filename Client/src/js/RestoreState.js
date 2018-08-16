import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import { toggleKuwaPasswordVisibility, toggleRestoreState } from './actions/screenActions';
import { restoreState } from './actions/kuwaActions';

/**
 * This component appears in two different ways to load the private key of a Wallet: It can be
 * rendered in the Cordova app when the application first loads and detects that there is a 
 * Wallet in the filesystem. It can also be rendered if the user manually loads his Wallet in
 * the application from either the Web Client or the Cordova App.
 * In any case, the Client needs to introduce the Kuwa Password to unlock the Wallet and be able
 * to use it.
 * @class ResponsiveDialog
 * @extends React.Component
 */
class ResponsiveDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kuwaPassword: ""
        }
    }

    render() {
        const { fullScreen } = this.props;
        return (
        <div>
            <Dialog
            fullScreen={fullScreen}
            open={this.props.showRestoreState}
            onClose={this.props.toggleRestoreState}
            aria-labelledby="responsive-dialog-title"
            >
            <DialogTitle id="responsive-dialog-title">Load Wallet</DialogTitle>
            <DialogContent>
                <DialogContentText>
                In order to load your wallet, you need to provide your Kuwa Password
                </DialogContentText>
                <FormControl style={{ width: "100%" }}>
                    <InputLabel htmlFor="adornment-passcode">Enter your Kuwa password</InputLabel>
                    <Input
                        id="adornment-passcode"
                        type={this.props.showKuwaPassword ? 'text' : 'password'}
                        value={this.state.kuwaPassword}
                        onChange={event => this.setState({kuwaPassword: event.target.value})}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="Toggle passcode visibility"
                            onClick={this.props.toggleKuwaPasswordVisibility}
                            onMouseDown={event => event.preventDefault()}
                            >
                                {this.props.showKuwaPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => {
                    this.setState({kuwaPassword: ""})
                    this.props.toggleRestoreState()
                }} color="primary">
                Cancel
                </Button>
                <Button onClick={() => {
                    this.props.restoreState(this.props.jsonFile, this.state.kuwaPassword, this.props.toggleRestoreState.bind(this))
                    this.setState({kuwaPassword: ""})
                }} color="primary" autoFocus>
                OK
                </Button>
            </DialogActions>
            </Dialog>
        </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        showKuwaPassword: state.screenReducer.provideCredentials.showKuwaPassword,
        showRestoreState: state.screenReducer.showRestoreState,
        jsonFile: state.kuwaReducer.loadedState
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleKuwaPasswordVisibility: () => {
            dispatch(toggleKuwaPasswordVisibility())
        },
        toggleRestoreState: () => {
            dispatch(toggleRestoreState())
        },
        restoreState: (jsonFile, kuwaPassword, onSuccess) => {
            dispatch(restoreState(jsonFile, kuwaPassword, onSuccess))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(ResponsiveDialog));