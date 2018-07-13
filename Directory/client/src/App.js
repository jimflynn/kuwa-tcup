import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedColumns: [],
      columns: [],
      tableData:[],
    };

    this.onColumnChange = this.onColumnChange.bind(this);
    this.renderTableHeaders = this.renderTableHeaders.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
    //this.getColumnList = this.getColumnList.bind(this);
    //this.getData = this.getData.bind(this);
  };

  componentDidMount() {
    axios.get(`http://localhost:3001/api/kuwaIds`)
      .then(res => {
        let data = JSON.parse(res.data);
        let cols = Object.keys(data[0]);
        this.setState({ columns: cols });
        this.setState({ selectedColumns: cols });
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
    for (let i = 0; i < this.state.selectedColumns.length; i++) {
      let col = this.state.selectedColumns[i];
      headers.push(<th key={col} style={{backgroundColor: '#177CB8', color: 'white', border: '1px solid grey', borderCollapse: 'collapse', padding: '5px'}}>{col}</th>)
    }
    return (<tr>{headers}</tr>);
  }

  renderTableBody() {
    let rows = [];
    this.state.tableData.forEach(function(row) {
      rows.push(
        <tr key={btoa('row'+rows.length)}>
          {this.state.selectedColumns.map(col =>
            <td key={col} style={{border: '1px solid grey', borderCollapse: 'collapse', padding: '5px'}}>{row[col]}</td>
          )}
        </tr>
      )
    }.bind(this));
    return (<tbody>{rows}</tbody>);
  }

  renderColumnList() {
    let columnsHTML = [];
    for (let i = 0; i < this.state.columns.length; i++){
      let column = this.state.columns[i];
      columnsHTML.push(<option key={column} value={column}>{column}</option>);
    }
    return columnsHTML;
  }

  onColumnChange(event) {
    let options = event.target.options;
    let selectedColumns = [];
    for (let i = 0; i < options.length; i++){
      if (options[i].selected){
        selectedColumns.push(options[i].value);
      }
    }
    this.setState({
      selectedColumns,
      //tableData: [],
      });
  }

  render() {
    return (
      <div>
        <h1 style={{fontSize: '1.2em', color: '#177CB8', marginBottom: '0'}}>Kuwa Clients</h1>
        <br/>
        <select className='columnMultiSelect' onChange={this.onColumnChange} multiple>
          { this.renderColumnList() }
        </select>
        <br/>
        <br/>
        { this.state.tableData.length > 0 ? this.renderTable() : null }
      </div>
    );
  }
}

export default App;
