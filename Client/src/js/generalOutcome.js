import React from 'react';

import { paperHeader } from './paperHeader';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

/**
 * generalOutcome is a dumb component where error and success messages can be rendered.
 * @param {String} header is the title of the screen
 * @param {String} message to show the user for feedback
 * @param {String} image url of the image to show to the user for feedback
 * @param {Object} classes used to give styling to the component
 * @param {Component} additionalContent is a component that can be rendered
 */
export const generalOutcome = (header, message, image, classes, additionalContent) => (
    <Grid container justify="center" style={{flexGrow: 1}}>
        <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
            <Paper className={classes.root} elevation={1} style={{margin: 20}}>

                { paperHeader(header) }

                <Typography variant="title" align="center" style={{margin: "1em"}}>
                    { message }
                </Typography>

                { image ? 
                <Grid container justify="center">
                    <Grid item>
                    <img className="responsive-kuwa-img" style={{maxWidth: "100%", height: "auto"}} src={ image } alt="image" />
                    </Grid>
                </Grid>
                : null }

                { additionalContent ? additionalContent : null }
            </Paper>
        </Grid>
    </Grid>
    
);