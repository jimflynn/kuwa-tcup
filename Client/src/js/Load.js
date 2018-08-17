import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Shows the loading component. Usually rendered when doing GET and POST requests. It is also
 * used when the keypair is being created. More generally it is used when a process is taking
 * place and the user needs to wait for it to complete before he can proceed. This dumb component
 * is rendered within a parent component.
 * @export
 * @class Loading
 * @extends Component
 */
export const Loading = (props) => {
  return (
    <Grid container>
        <Grid container justify="center" style={{flexGrow: 1}}>
            <CircularProgress className="loading-kuwa-reg" style={{ color: "#11B73F" }} thickness={4} size={100} />            
        </Grid>
        <Grid container justify="center" style={{flexGrow: 1}}>
            <h3 style={{textAlign: "center"}}>{props.loadingMessage}</h3>
        </Grid>
    </Grid>
  );
}