import React from 'react';

import kuwaIcon from '../img/kuwa-icon.png';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const generalOutcome = (message, image, classes) => (
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
                                    <strong>Error!</strong>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="title" align="center" style={{margin: "1em"}}>
                    { message }
                </Typography>

                <Grid container justify="center" style={{flexGrow: 1}}>
                    <img className="responsive-kuwa-img" src={ image } alt="error" />
                </Grid>
            </Paper>
        </Grid>
    </Grid>
    
);