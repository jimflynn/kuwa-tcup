import React, { Component } from 'react';
import './App.css';
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
      <table>
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
          {this.state.columns.map(col => <td key={col}>{row[col]}</td>)}
        </tr>
      )
    }.bind(this));
    return (<tbody>{rows}</tbody>);
  }

  renderSelectBox() {
    return (
      <div class="select-box">
        <select value="select-status" onChange={this.handleStatusChange}>
          <option value="select-status">Select status:</option>
          <option value="">All</option>
          <option value="0">Invalid</option>
          <option value="1">Valid</option>
          <option value="2">Waiting</option>
          <option value="3">Preliminary</option>
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
      <div>
        <h1>Directory of Kuwa IDs</h1>
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
