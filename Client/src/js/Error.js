import { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import error from '../img/error.png';

import { generalOutcome } from './generalOutcome';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

/**
 * This component is rendered every time an Exception occurs and is caught. Whenever this
 * component is rendered an error message should be passed to let the user know what went
 * wrong. The help message can be found in the Redux store.
 * The Error component uses the generalOutcome component as a template. Please refer to it
 * for more details.
 * @class Error
 * @extends Component
 */
class Error extends Component {
    render() {
        const { classes } = this.props;
        return (
            generalOutcome("Oops!", this.props.errorMessage, error, classes)
        );
    }
}

const mapStateToProps = state => {
    return {
        errorMessage: state.kuwaReducer.screen.error.helpText
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Error));
