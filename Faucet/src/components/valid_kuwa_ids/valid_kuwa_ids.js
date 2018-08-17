import React, { Component } from 'react';
import './valid_kuwa_ids.css';
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';  
import {
  Alert,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupDropdown,
  Input,
  InputGroupText,
  Fade,
  Collapse,
  Container,
  Row,
  Label,
  Col,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import loading from '../../loading.gif'
require('dotenv').config()

const Web3 = require('web3')
const axios = require('axios')
const EthereumTx = require('ethereumjs-tx')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice



function blockLinks(cell, row){
  return `<a href="https://rinkeby.etherscan.io/address/${cell}" target="_blank">${cell}</a>`;
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onAfterSaveCell(row, cellName, cellValue) {
  
  let rowStr = '';
  for (const prop in row) {
    rowStr += prop + ': ' + row[prop] + '\n';
  }
}

function onBeforeSaveCell(row, cellName, cellValue) {
  // You can do any validation on here for editing value,
  // return false for reject the editing
  return true;
}

const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  // beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
  // afterSaveCell: onAfterSaveCell  // a hook for after saving cell
};


class KuwaFaucet extends Component {

  constructor(props) {
    super(props);

    this.options = {
      defaultSortName: 'registration_id',  // default sort column name
      defaultSortOrder: 'asc',  // default sort order
      noDataText: 'Loading registration data'
    };

    this.state = {
      isLoading: true,
      sponsorship_requests: [],
      registrations:[],
      dropdownOpen: false,
      dropdownValue: 'Choose currency',
      visible: false,
      amountBox: null,
      fadeIn: true,
      payButtonDisabled: true,
      defaultAmount: '0.02',
      checkBoxTicked: false,
      payBtnClicked: false,
      visible2: false
    }

    this.toggle = this.toggle.bind(this);

    this.toggleDropDown = this.toggleDropDown.bind(this);

    this.onPayBtnClick = this.onPayBtnClick.bind(this);

    this.onDismiss = this.onDismiss.bind(this);
    this.onDismiss2 = this.onDismiss2.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.amountFormatter = this.amountFormatter.bind(this);

    this.onCheckBoxClick = this.onCheckBoxClick.bind(this);

    this.addrFormatter = this.addrFormatter.bind(this);

    this.statusFormatter = this.statusFormatter.bind(this);

    this.timeoutFunc = this.timeoutFunc.bind(this);


  }


  addrFormatter(cell,row){

    
    var val1 = `${cell}`;
    if(this.state.payBtnClicked === true){


      //console.log('p1 ',val1 );
      var val1 = `${cell}`;
      
      return val1;

      
      
    }
    else{
      
      return val1;
    }
  }

  statusFormatter(cell,row){
    //console.log('p1');
    var val1 = `${cell}`;
    var d = new Date().toLocaleTimeString();
    
    //return `${cell}`;

    if(`${cell}` === 'undefined'){
      //console.log('k1');
      return `<div>-</div>`;
    }
    else{
      //console.log('k2');
      return `<div style = color:green>${cell}</div>`;
    }


  }

  amountFormatter(cell,row){
    var amt = this.state.amountBox;
    var val = `${cell}`;
    
    //console.log(val);

    if(this.state.checkBoxTicked === true){
      var amt = this.state.amountBox
      
      if(amt === null){
        return 0;
      }
      else{
        return amt;
      }
      
    }

    else{
      if(val === 'undefined'){
      return 0;
    }
    else{
      return `${cell}`;
    }
    }

    
  
    if(val === 'undefined' && amt === null){
        console.log('g3');
        return 0;
      }

    

    
    
  }

  toggle() {
    this.setState({
      isLoading: !this.state.isLoading,
    });
  }

  toggleDropDown(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownValue: e.currentTarget.textContent,
      payButtonDisabled: false
    });

    console.log(e.currentTarget.textContent);
  }

  onPayBtnClick(){
    this.setState({
      visible: true,
      payBtnClicked: true

    });
    console.log('pay clicked');

    var amt = this.state.checkbox2;
    console.log(amt);

    var p =0;




    this.interval = setInterval(() => {
          if(p>40){
            console.log('r1');

            const tempRequests = this.state.registrations;
          
          //tempRequests[p].status = 'Transfer successful';
          p++;
          this.setState({
            isLoading : false,
            registrations : tempRequests,
            visible2 : true

          });
          }

          

          else{


            console.log('k1'+p);
          const tempRequests = this.state.registrations;
          
          tempRequests[p].payment_status = 'Transfer successful';
          p++;
          this.setState({
            isLoading : false,
            registrations : tempRequests
          });
          }
          
        }, 3000);
    

  }

  onDismiss() {
    this.setState({ visible: false });
  }

  onDismiss2() {
    this.setState({ visible2: false });
  }

  timeoutFunc(j) {

    console.log( "hi2" );

        const tempRequests = this.state.sponsorship_requests.slice()
        console.log(tempRequests[j].contract_address);

        tempRequests[j].contract_address = '1';
        this.setState({
        sponsorship_requests: this.state.tempRequests
      });

        console.log(tempRequests[j].contract_address);

        this.setState({isLoading : false});
        this.forceUpdate();

    }

  
  
  onCheckBoxClick() {
    
    this.setState({
      checkBoxTicked: !this.state.checkBoxTicked,

    });
    console.log(this.state.checkBoxTicked);


    const tempRequests = this.state.sponsorship_requests.slice()

    console.log(this.state.sponsorship_requests);
    
    var j = 0, howManyTimes = tempRequests.length;
    
    this.interval = setInterval(() => {
          j++;
          //console.log('e1'+j);
          this.setState({isLoading : false});
          
        }, 1000);
    
    

    }

    

  

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
 
  }


  componentDidMount(){
    
     // this.interval = setInterval(() => {
     //    axios.get('/sponsorship_requests/Test')
     //     .then(res => {
     //      this.setState({sponsorship_requests : res.data.sponsorship_requests});
     //      this.setState({isLoading : false});
     //    })}, 10000);


     // this.interval = setInterval(() => {
     //        fetch('/get_valid_ids')
     //          .then(response => response.json())
     //          .then(table => this.setState({registrations: table}))
     //          .then(console.log('DB =', this.state.registrations))
     //    }, 3000);

     fetch('/get_valid_ids')
              .then(response => response.json())
              .then(table => this.setState({registrations: table}))
              .then(console.log('DB =', this.state.registrations))

    this.interval = setInterval(() => {

          this.setState({isLoading : false});
          
        }, 1000);



    //example get request to verify ajax is working

    // axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //      .then(res => {
    //       console.log(res.data);
    //       this.setState({sponsorship_requests : res.data[0]});
    //     })      

    //update: it is working but ajax cant track changes in database without a page refresh.

    // axios.get('/sponsorship_requests/MySharedSecretKey')
    //      .then(res => {
    //       console.log(res.data);
    //       this.setState({sponsorship_requests : res.data.sponsorship_requests});
    //     })      



   }

   componentWillUnmount() {
        clearInterval(this.interval);
    }

  render() {

    const cellEditProp = {
      mode: 'click',
    };
    if(this.state.isLoading === false){
     return (
      <div>
        
        <Container>
          <Row>  
          
          <InputGroup className="text-right">
          
          <Col>
          <Input placeholder="Enter Standard Payment Amount" className="text-left" maxLength="10" name="amountBox" value={ this.state.amountBox } onChange={ this.handleChange }/>
          </Col>
          
          <Col>
          <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
            <DropdownToggle caret>
              {this.state.dropdownValue}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>KuwaCoin</DropdownItem>
              <DropdownItem divider />
            </DropdownMenu>
          </InputGroupButtonDropdown>
          </Col>

          </InputGroup>
          </Row>
          <Row>
          <Col>
          <InputGroupAddon>
          <Label check>
                <Input type="checkbox" name="checkbox2" id="checkbox2" onChange={this.onCheckBoxClick} />{'Use Standard Payment Amount for All'}
                
              </Label>
          </InputGroupAddon>
          </Col>
          </Row>
        </Container>


        <br />
          <Button id="faucet-payment-button" color="success" size="lg" disabled={this.state.payButtonDisabled} onClick={this.onPayBtnClick}>Pay</Button>{' '}
          <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss} fade={this.state.fadeIn} >
        { this.state.amountBox } KuwaCoins are being sent to each of the valid Kuwa IDs
      </Alert>
          
          <Alert color="info" isOpen={this.state.visible2} toggle={this.onDismiss2} fade={this.state.fadeIn} >
        KuwaCoin transfers completed successfully
      </Alert>
          <br />
          
          <BootstrapTable data={this.state.registrations} options={this.options} cellEdit={ cellEditProp } pagination striped hover condensed>
            
              <TableHeaderColumn dataField="timestamp" filter={ { type: 'TextFilter', delay: 200 }} isKey dataSort editable={ false } hidden={ true }> Time </TableHeaderColumn>
              <TableHeaderColumn dataField="registration_id"  dataSort editable={ false } width='70'> Registration ID </TableHeaderColumn>

              <TableHeaderColumn dataField="client_address" dataSort dataFormat={this.addrFormatter} editable={ false } width='150'> Valid Kuwa IDs (Ethereum Addresses)</TableHeaderColumn>
              <TableHeaderColumn dataField="contract_address" dataSort dataFormat={blockLinks} editable={ false } hidden={ true }> Registration Contract Address</TableHeaderColumn>
              <TableHeaderColumn dataField="amount" dataSort dataFormat={this.amountFormatter} width='100'> Amount in ({this.state.dropdownValue}) </TableHeaderColumn>
              <TableHeaderColumn dataField="payment_status" dataSort dataFormat={this.statusFormatter} editable={ false } width='100'> Payment Status </TableHeaderColumn>

        </BootstrapTable>
      </div>
    ); 
    }
    else{
      return (
      <div className="loading">
      
      <img className="isLoading" src={loading} alt="loading..." />

      </div>
      );
    }
    
  }
}

export default KuwaFaucet;
  
