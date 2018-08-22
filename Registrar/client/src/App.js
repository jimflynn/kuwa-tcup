import React, { Component } from 'react';
import logo from './Kuwa.png';
import './App.css';
import Navigation from './Navigation.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Registrations from './components/Registrations.js';

class App extends Component {

	render() {
        return (
            <div className="App">
                <Navigation />
                <header className="App-header">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Kuwa Registrar Database (Moe)</h1>
                </header>

                <div className="body">
                    <Registrations/>
                </div>

            </div>
        );
    }
}

export default App;
