import React from 'react';
import loading from '../img/loading.gif';
import Grid from '@material-ui/core/Grid';

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
            <img className="loading-kuwa-reg" src={loading} alt="loading" />
        </Grid>
        <Grid container justify="center" style={{flexGrow: 1}}>
            <h4 style={{textAlign: "center"}}>{props.loadingMessage}</h4>
        </Grid>
    </Grid>
  );
}