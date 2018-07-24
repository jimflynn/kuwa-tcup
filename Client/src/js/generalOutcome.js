import React from 'react';

import { paperHeader } from './paperHeader';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const generalOutcome = (header, message, image, classes) => (
    <Grid container justify="center" style={{flexGrow: 1}}>
        <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
            <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                { paperHeader(header) }

                <Typography variant="title" align="center" style={{margin: "1em"}}>
                    { message }
                </Typography>

                <Grid container justify="center">
                    <Grid item>
                    <img className="responsive-kuwa-img" style={{maxWidth: "100%", height: "auto"}} src={ image } alt="error" />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </Grid>
    
);