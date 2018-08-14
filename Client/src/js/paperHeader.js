import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import kuwaIcon from '../img/kuwa-icon.png';

/**
 * This dumb component renders the Kuwa Icon at the top of every page along with its title
 * @param {String} header title of the page
 */
export const paperHeader = header => (
    <div>
        <Grid container spacing={16} alignItems="center" style={{flexGrow: 1}} justify="center">
            <Grid item>
                <img src={ kuwaIcon } alt="Kuwa Icon" />
            </Grid>
            <Grid item>
                <Typography variant="headline">
                    {header}
                </Typography>
            </Grid>
        </Grid>
        <Divider />
    </div>
)