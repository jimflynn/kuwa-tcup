import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import { push } from 'connected-react-router';
import Video from './Video';

import { webUploadToStorage, uploadToStorage  } from './actions/kuwaActions';
import { paperHeader } from './paperHeader';
import { Loading } from './Load';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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
        return (
            <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper className={this.props.classes.root} elevation={1} style={{margin: 20}}>

                    { paperHeader("Step 2 – Record your registration video.") }

                    { this.props.loading ? <Loading loadingMessage="Uploading Information. This may take several minutes..." /> : renderContent(this.props) }

                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

const renderContent = props => (
    <div>
        { props.infoUploaded ? renderDone(props) : renderRecordRegistrationVideo(props) }
    </div>
)

const renderButton = props => {
    if (props.videoStatus === 'success') {
        return (
            <Grid container justify="center" style={{margin: "1em"}}> 
                <Button variant="contained" style={{backgroundColor: buttonColor}} onClick={() => {
                    if (window.usingCordova) {
                        props.uploadToStorage(props.videoFilePath, props.ethereumAddress, props.abi, props.contractAddress)
                    } else {
                        props.webUploadToStorage(props.videoBlob, props.ethereumAddress, props.abi, props.contractAddress)
                    }
                }}>
                    Upload Video
                </Button>
            </Grid>
        )
    }
    return null;
}

const renderRecordRegistrationVideo = props => (
    <div>
        <Typography variant="subheading" align="left" style={{margin: "1em"}}>
            Every living human is entitled to exactly one Kuwa ID. To help us identify you, we need a video of you speaking the following numbers:
        </Typography>
        <Typography variant="title" align="center" style={{margin: "1em"}}>
            <strong>{props.challenge}</strong>
        </Typography>
        <Grid container justify="center" style={{margin: "1em"}}>
            <Provider store={store}>
                <Video />
            </Provider>
        </Grid>
        {renderButton(props)}
    </div>
)

const renderDone = props => (
    <div>
    <Typography variant="title" align="center" style={{margin: "1em"}}>
        You have already uploaded your challenge video.
    </Typography>
    <div align="center">
        <Button variant="contained" style={{backgroundColor: buttonColor, marginTop: "1em"}} onClick={() => props.navigateTo('/YourKuwaId')}>
            Continue
        </Button>
    </div>
    </div>
)

const mapStateToProps = state => {
    return {
        ethereumAddress: state.kuwaReducer.kuwaId.address,
        challenge: state.kuwaReducer.kuwaId.challenge,
        abi: state.kuwaReducer.kuwaId.abi,
        contractAddress: state.kuwaReducer.kuwaId.contractAddress,

        videoStatus: state.videoReducer.videoStatus,
        videoFilePath: state.videoReducer.videoFilePath,
        videoBlob: state.videoReducer.videoBlob,
        infoUploaded: state.kuwaReducer.kuwaId.infoUploaded,

        loading: state.kuwaReducer.screen.uploadToStorage.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadToStorage: (videoFilePath, ethereumAddress, abi, contractAddress) => {
            dispatch(uploadToStorage(videoFilePath, ethereumAddress, abi, contractAddress))
        },
        webUploadToStorage: (videoBlob, ethereumAddress, abi, contractAddress) => {
            dispatch(webUploadToStorage(videoBlob, ethereumAddress, abi, contractAddress))
        },
        navigateTo: link => {
            dispatch(push(link))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecordRegistrationVideo));