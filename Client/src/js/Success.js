import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import config from 'config';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

import { withStyles } from '@material-ui/core/styles';

import success from '../img/success.png';

import { generalOutcome } from './generalOutcome';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

/**
 * This component is rendered if the user wants to give feedback of success to the user. Whenever this
 * component is rendered a success message is passed. The help message can be found in the Redux store.
 * The Success component uses the generalOutcome component as a template. Please refer to it
 * for more details.
 * @class Success
 * @extends Component
 */
class Success extends Component {
    render() {
        const { classes } = this.props;
        
        return (
            generalOutcome("Success!", successMessage(), null, classes, addiationalContent(this.props))
        );
    }
}

const successMessage = () => (
    <div>
        Congratulations! You now have a Kuwa ID, which you can use to register for decentralized services, such as a crypto basic income distribution. 
    </div>
)

const addiationalContent = (props) => (
    <div align="center">
        <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => props.navigateTo('/YourKuwaId')}>
            Continue
        </Button>
    </div>
)

const mapStateToProps = state => {
    return {
        successMessage: state.kuwaReducer.screen.success.helpText
    }
}

const mapDispatchToProps = dispatch => {
    return {
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Success));
