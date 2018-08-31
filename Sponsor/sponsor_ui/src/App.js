import React, { Component } from 'react';
import logo from './site-logo.png';
import './App.css';
import {
  Button,
  Navbar,
  NavbarBrand } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {paperHeader} from './components/sponsorship_requests/paperHeader'


import SponsorshipRequests from './components/sponsorship_requests/sponsorship_requests';
import Navigation from './components/sponsorship_requests/Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
      
      <Navigation/>
      <div className="body">
      <Grid container justify="center" style={{flexGrow: 1}}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Paper elevation={1} style={{margin: 20}}>

                        { paperHeader("Kuwa Sponsor")}

                        
               
                            
                        
                    
                    </Paper>
                </Grid>
                <SponsorshipRequests/>
        </Grid>
        
      </div>
      </div>
    );
  }
}

export default App;

