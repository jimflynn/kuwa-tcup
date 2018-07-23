import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Shows loading Gif component
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