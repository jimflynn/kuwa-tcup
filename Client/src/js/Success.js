import { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import success from '../img/success.png';

import { generalOutcome } from './generalOutcome';

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class Success extends Component {
    render() {
        const { classes } = this.props;
        return (
            generalOutcome(this.props.successMessage, success, classes)
        );
    }
}

const mapStateToProps = state => {
    return {
        successMessage: state.kuwaReducer.screen.success.helpText
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Success));