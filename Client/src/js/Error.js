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

class Error extends Component {
    render() {
        const { classes } = this.props;
        return (
            generalOutcome(this.props.errorMessage, error, classes)
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