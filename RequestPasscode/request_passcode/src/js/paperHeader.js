import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import kuwaIcon from '../img/kuwa-icon.png';

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