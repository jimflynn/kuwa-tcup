/**
 * This file represents the React UI App for displaying the directory of Kuwa IDs.
 * in tabular form.
 * 
 * The Kuwa client ID (Ethereum address), the client's contract address, 
 * the creation time, and the last status update time are displayed.
 * 
 * Users can select to only display Kuwa IDs with a certain status using the select box.
 */
import React, { Component } from 'react';
import './App.css';
import logo from './Kuwa.png';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      tableData:[]
    };

    this.renderTableHeaders = this.renderTableHeaders.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
    this.getData = this.getData.bind(this);
    this.renderSelectBox = this.renderSelectBox.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  };

  componentDidMount() {
      this.getData("/kuwaIds");
  }

  getData(resource) {
    axios.get(`${this.props.baseApiUrl}${resource}`).then(res => {
      let data = JSON.parse(res.data);
      let cols;
      if (data.length === 0) {
        this.setState({ tableData: data });
        return;
      }
      cols = Object.keys(data[0]);
      if (this.state.columns.length === 0)
        this.setState({ columns: cols });
      this.setState({ tableData: data });
    })
    .catch (error => {
      if (error.response) {
        alert(error.response.data);
      }
      else {
        console.log(error.message);
      }
    });
  }

  renderTable() {
    return (
      <table id="tableIdToFill">
        <thead>
          { this.renderTableHeaders() }
        </thead>
        { this.renderTableBody() }
      </table>
    );
  }

  renderTableHeaders() {
    let headers = [];
    for (let i = 0; i < this.state.columns.length; i++) {
      let col = this.state.columns[i];
      headers.push(<th key={col}>{col}</th>)
    }
    return (<tr>{headers}</tr>);
  }

  renderTableBody() {
    let rows = [];
    this.state.tableData.forEach(function(row) {
      rows.push(
        <tr key={btoa('row'+rows.length)}>
          {this.state.columns.map(col => {
            if (col === "Registration Contract Address") {
              let url = this.props.etherScanBaseUrl + row[col];
              return <td key={col}><a href={url} target="_blank" rel="noopener noreferrer">{row[col]}</a></td>;
            }
            else
              return <td key={col}>{row[col]}</td>;
          })}
        </tr>
      )
    }.bind(this));
    return (<tbody>{rows}</tbody>);
  }

  renderSelectBox() {
    return (
      <div className="select-box">
        <select id="select-box" value="select-status" onChange={this.handleStatusChange}>
          <option value="select-status">Select status:</option>
          <option value="">All</option>
          <option value="Invalid">Invalid</option>
          <option value="Valid">Valid</option>
          <option value="Credentials-Provided">Credentials Provided</option>
          <option value="Challenge-Expired">Challenge Expired</option>
          <option value="Video-Uploaded">Video Uploaded</option>
          <option value="QR-Code-Scanned">QR Code Scanned</option>
        </select>
      </div>
      );
  }

  handleStatusChange(event) {
    let status = event.target.value;
    if (status === "") {
      this.getData("/kuwaIds");
      return;
    }

    this.getData("/kuwaIds/" + status);
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Directory of Kuwa IDs</h1>
      </header>
        <br/>
          { this.renderSelectBox() }
        <br/>
        <br/>
        { this.state.tableData.length > 0 ? this.renderTable() : "Nothing to display" }
      </div>
    );
  }
}

export default App;
