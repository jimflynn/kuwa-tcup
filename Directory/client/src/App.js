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
    this.getData = this.getData.bind(this);
  };

  componentDidMount() {
      this.getData("/kuwaIds");
  }

  getData(resource) {
    axios.get(`${this.props.baseUrl}${resource}`).then(res => {
      let data = JSON.parse(res.data);
      let cols;
      if (data.length === 0) {
        this.setState({ tableData: data });
        return;
      }
      cols = Object.keys(data[0]);
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
      /*columnsHTML.push(<div key={column}>
                        <input type="checkbox" key={column} value={column} onChange={this.onColumnChange}/>
                        <label htmlFor={column}>{column}</label>
                       </div>);*/
      columnsHTML.push(<div><input type="checkbox" key={column} value={column} onChange={this.onColumnChange}/>{column}</div>);
    }

    return (<div>
              <legend>Select columns: </legend>
                  {columnsHTML}
            </div>);
  }

  onColumnChange(event) {
    let options = event.target.checked;
    let selectedColumns = [];
    for (let i = 0; i < options.length; i++){
      if (options[i].selected){
        selectedColumns.push(options[i].value);
      }
    }
    this.setState({
      selectedColumns,
    });
  }

  render() {
    return (
      <div>
        <h1 style={{fontSize: '1.2em', color: '#177CB8', marginBottom: '0'}}>Kuwa Clients</h1>
        <button onClick={()=> this.getData("/kuwaIds")}>All Kuwa IDs</button>
        <button onClick={()=> this.getData("/kuwaIds/valid")}>Valid Kuwa IDs</button>
        <button onClick={()=> this.getData("/kuwaIds/invalid")}>Invalid Kuwa IDs</button>
        <br/>
          { this.renderColumnList() }
        <br/>
        <br/>
        { this.state.tableData.length > 0 ? this.renderTable() : null }
      </div>
    );
  }
}

export default App;
