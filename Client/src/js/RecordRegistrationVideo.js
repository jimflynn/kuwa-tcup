import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import Video from './Video';

import { webUploadToStorage, uploadToStorage  } from './actions/kuwaActions';

import kuwaIcon from '../img/kuwa-icon.png';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
const buttonColor = "#11B73F";

const styles = theme => ({
    root: Object.assign({}, theme.mixins.gutters(), {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    })
});

class RecordRegistrationVideo extends Component {
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
                                            <strong>Step 2</strong> – Record your registration video.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
                            Every living human is entitled to exactly one Kuwa ID. To help us identify you, we need a video of you speaking the following numbers:
                        </Typography>
                        <Typography variant="title" align="center" style={{margin: "1em"}}>
                            <strong>{this.props.challenge}</strong>
                        </Typography>
                        <Grid container justify="center" style={{margin: "1em"}}>
                            <Provider store={store}>
                                <Video />
                            </Provider>
                        </Grid>
                        {renderButton(this.props)}
                    </Paper>
                </Grid>
            </Grid>
            
        );
    }
}

const renderButton = props => {
    if (props.videoStatus === 'success') {
        return (
            <Grid container justify="center" style={{margin: "1em"}}> 
                <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => {
                    let uploadFunction = props.webUploadToStorage
                    if (window.isMobile) uploadFunction = props.uploadToStorage
                    uploadFunction(props.videoFilePath, props.ethereumAddress, props.abi, props.contractAddress)
                }}>
                    Upload Video
                </Button>
            </Grid>
        )
    }
    return null;
}

const mapStateToProps = state => {
    return {
        ethereumAddress: state.kuwaReducer.kuwaId.address,
        challenge: state.kuwaReducer.kuwaId.challenge,
        abi: state.kuwaReducer.kuwaId.abi,
        contractAddress: state.kuwaReducer.kuwaId.contractAddress,

        videoStatus: state.videoReducer.videoStatus,
        videoFilePath: state.videoReducer.videoFilePath,
        videoBlob: state.videoReducer.videoBlob,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadToStorage: (videoFilePath, ethereumAddress, abi, contractAddress) => {
            dispatch(uploadToStorage(videoFilePath, ethereumAddress, abi, contractAddress))
        },
        webUploadToStorage: (videoBlob, ethereumAddress, abi, contractAddress) => {
            dispatch(webUploadToStorage(videoBlob, ethereumAddress, abi, contractAddress))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecordRegistrationVideo));