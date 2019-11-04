import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './App.css';
import Meme from './abis/Meme.json'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { bake_cookie, read_cookie } from 'sfcookies';

//const ipfsClient = require('ipfs-http-client')
//const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function insert(a,b){
  
    var imgDestination = document.getElementById("heartbeat");
    var imgAdded = document.createElement("img");
    var label1 = document.createElement("label");
    imgAdded.src = "./acc1.png";
    imgAdded.style.width = '90px';
    label1.innerHTML = a + "<br />" + b;
    imgDestination.appendChild(imgAdded);
    imgDestination.appendChild(label1);
    ImgRandomPosition(imgAdded,label1);

  }


 function ImgRandomPosition(imgAdded,label1){
    var left = Math.floor((Math.random() * 400) + 1)+"px";
    var top = Math.floor((Math.random() * 400) + 1)+"px";
    var imagestyle = imgAdded.style;var Lstyle1 = label1.style;

    imagestyle.position = "absolute";imagestyle.top = top; imagestyle.left = left;
    Lstyle1.position = "absolute"; Lstyle1.top = top ; Lstyle1.left = left; Lstyle1.fontWeight="bold";
  }

class Donor extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props);
    this.state = {
      account : '',
      contracts : null,
      BenReq : '',
      contact : '',
      phone : '',
      BenAcc : '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contracts: contract })
      const memeHash = await contract.methods.getBen().call()
      const communication = await contract.methods.getBenC().call()
      const phones = await contract.methods.getBenP().call()
      const Baccount = await contract.methods.getBenA().call()
      this.setState({ BenReq: memeHash , contact : communication, phone : phones, BenAcc : Baccount})
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }

    if(this.state.BenReq === "1"){
      var imgDestination = document.getElementById("heartbeat");
      var imgAdded = document.createElement("img");
      var label1 = document.createElement("label");

      imgAdded.src = "./acc1.png";
      imgAdded.style.width = '90px';
      label1.innerHTML = "New Request ✨" + "<br/>" + this.state.contact + "✨";

      var acc  = this.state.BenAcc, 
      phn  = this.state.phone,
      contract = this.state.contracts,
      donaccount = this.state.account;

      var names = read_cookie('name'),
      addrs = read_cookie('address'),
      phone = read_cookie('phone'),
      donacc = read_cookie('acc_type');
      
      imgAdded.onclick = function() { 
          var person = prompt("Account: "+ acc + "\nContact: "+ phn + "\nConfirm your Transaction by typing 'YES' or cancel");
          if (person === "YES") {
            contract.methods.setAccept('1',donacc,names+", "+addrs,phone).send({ from: donaccount }).then((r) => {
            this.setState({ request : '1' })
            })

            const Nexmo = require('nexmo');
            const nexmo = new Nexmo({
              apiKey: 'API-KEY',
              apiSecret: 'API-SECRET',
            });
            console.log(phn)
            const to = '91'+phn;
            var sms = 'Your Request has been accepted by ' + names + ' from ' + addrs + '.  For More Details: '+ phone + '. Acknowledge it ASAP ';
            nexmo.message.sendSms('Nexmo', to , sms);

            alert("Transaction is confirmed! \nContact  " + phn +"  for more details");

          } else {
            alert("User cancelled the prompt.");
          }
      };
      imgDestination.appendChild(imgAdded);
      imgDestination.appendChild(label1);
      ImgRandomPosition(imgAdded,label1);
      }

  }

  handleSubmit(event) {
      event.preventDefault();
  }
  render(){
    const names = read_cookie('name');
    const addrs = read_cookie('address');
    const phones = read_cookie('phone');
    const acc = read_cookie('acc_type');
    
    return(
            <div class="panel">
            <Container> 
              <Row>
                <Col sm={3}>
                  <img src='./acc2.png' width="150" alt="Logo"></img><br/><br/>
                  <label class="user-display">Type of Account:</label><br/>
                  <span>{acc}</span><br/><br/><br/>
                  <label class="user-display">Organisation:</label><br/>
                  <span>{names}</span><br/><br/>
                  <label class="user-display">Address:</label><br/>
                  <span>{addrs}</span><br/><br/>
                  <label class="user-display">Contact:</label><br/>
                  <span>{phones}</span><br/><br/><br/>

                  <form onSubmit={this.handleSubmit}>
                  <Button type="submit" variant="success">Donate</Button>
                  </form>

                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                  

                </Col>
                <Col sm={9}>
                  <div class="airwave">
                    <br/><br/>
                    <center><h4><u>Offer / Request Area</u></h4>
                    <br/><br/><br/>
                    <div id="share">
                      <div id="heartbeat">
                       </div>
                    </div>
                    </center>
                  </div>
                </Col>
              </Row>
            </Container>
            </div>
      );
    }

}

class Beneficiary extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props);
    this.state = {
      limit : 'no',
      account: '',
      contracts : null,
      request: '',
      name : '',
      DonPhone : '',
      DonCont : '',
      Donoraccept : '',
      paid : '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.payEther = this.payEther.bind(this);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      const Baccount = await contract.methods.getBen().call()
      const accept = await contract.methods.getBenAccept().call()
      const dph = await contract.methods.getBenDp().call()
      const dcon = await contract.methods.getBenDc().call()


      this.setState({ Donoraccept: accept, contracts: contract, request : Baccount, DonCont: dcon, DonPhone: dph})
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }

    if(this.state.Donoraccept === '1'){
      var notify = document.getElementById('notify');
      notify.innerHTML = this.state.DonCont + " has accepted your Request. For More Details.. <br/> Contact: " + this.state.DonPhone;
    }

    if(this.state.request === '1'){

        var names = read_cookie('name');
        var addrs = read_cookie('address');
        insert(names,addrs);
    }
  }

   payEther(event){
    var notify = document.getElementById('confirm');
    if(this.state.paid !== 'yes'){
      const web3 = window.web3
      var send = web3.eth.sendTransaction({from: "Account Address 1" , to: "Account Address 2", value: web3.utils.toWei(this.title.value, "ether")});
      this.setState({ paid : 'yes' })
      notify.innerHTML = "Ethers has been transferred! ";
    }
    else{
      notify.innerHTML = "Transaction already done!!";
    }

    event.preventDefault();
  }


  handleSubmit(event){
    var names = read_cookie('name'),
     addrs = read_cookie('address');
     var phone = read_cookie('phone');
    if(this.state.limit === 'no'){
      this.setState({ limit: 'yes', });
      this.state.contracts.methods.setBen('1',names+"<br/> "+addrs,this.state.account,phone).send({ from: this.state.account }).then((r) => {
            this.setState({ request : '1' })
        })

      insert(names,addrs);
    }
      
    event.preventDefault();
  }

  render(){
    const names = read_cookie('name');
    const addrs = read_cookie('address');
    const phones = read_cookie('phone');
    const acc = read_cookie('acc_type');
    
    return(
            <div class="panel">
            <Container> 
              <Row>
                <Col sm={3}>
                  <img src='./acc1.png' width="150" alt="Logo"></img><br/><br/>
                  <label class="user-display">Type of Account:</label><br/>
                  <span>{acc}</span><br/><br/><br/>
                  <label class="user-display">Organisation:</label><br/>
                  <span>{names}</span><br/><br/>
                  <label class="user-display">Address:</label><br/>
                  <span>{addrs}</span><br/><br/>
                  <label class="user-display">Contact:</label><br/>
                  <span>{phones}</span><br/><br/><br/>

                  <form onSubmit={this.handleSubmit}>
                  <Button type="submit" variant="success">Request</Button>
                  </form>

                  
                  <br/>

                  <form onSubmit={this.payEther}>
                  <label> Enter Ether amount to pay: </label>
                  <input type="text" className="form-control" size="5" ref={(c) => this.title = c} name="title" /><br/>
                  <Button id="payTransaction" type="submit" variant="warning">Pay Ether</Button>
                  </form>

                  <br/><span id="confirm"></span><br/>

                </Col>
                <Col sm={9}>
                  <div class="airwave">
                    <br/><br/>
                    <center><h4><u>Offer / Request Area</u></h4>
                    <br/><br/><br/>
                    <div id="share">
                      <div id="heartbeat">
                       </div>
                       <span id="notify"></span>
                    </div>
                    </center>
                  </div>
                </Col>
              </Row>
            </Container>
            </div>
      );
    }
}

class GetInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      phone: '',
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange1(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleChange2(event) {
    this.setState({
      address: event.target.value,
    });
  }

  handleChange3(event) {
    this.setState({
      phone: event.target.value,
    });
  }

  handleSubmit(event) {
    bake_cookie('name',this.state.name);
    bake_cookie('address',this.state.address);
    bake_cookie('phone',this.state.phone);

    const acc = read_cookie('acc_type');
    if(acc === 'Beneficiary'){
      ReactDOM.render( <Beneficiary /> , document.getElementById('root'));
    }
    else if(acc === 'Donor'){
      ReactDOM.render( <Donor /> , document.getElementById('root'));
    }
    else{
      ReactDOM.render( <Other /> , document.getElementById('root'));  
    }

  }
  render(){
      return(
            <center><img src="./logo.png" width="400" alt="Logo"></img><br/><br/>
            <div class="Basic-details">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formGroupEmail">
                <Form.Control type="text" autoComplete="on" placeholder="Enter Organisation Name" value={this.state.name} onChange={this.handleChange1}/>
              </Form.Group>
              <Form.Group controlId="formGroupPassword">
                <Form.Control type="text" autoComplete="on" placeholder="Enter Organisation Address" value={this.state.address} onChange={this.handleChange2}/>
              </Form.Group>
              <Form.Group controlId="formGroupPassword">
                <Form.Control type="text" autoComplete="on" placeholder="Enter Mobile Number" value={this.state.phone} onChange={this.handleChange3}/>
              </Form.Group>
              <Button type="submit">Submit</Button>
            </Form>
            </div>
            </center>
          
        );
  }

}

class Other extends Component {

  render(){
    return (
      <div>
          <App/>
      </div>
    );
  }
}

class App extends Component {

  constructor(props) {
  super(props);
  this.state = {
    value: 'None',
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    bake_cookie('acc_type',this.state.value);
    //event.preventDefault();
    ReactDOM.render( <GetInfo /> , document.getElementById('root'));
  }

  render() {
    return (
      <div className="info-fetch">
        <center><img src="./logo.png" width="400" alt="Logo"></img>
      <form onSubmit={this.handleSubmit}>
        <label id="lab">
          Select the Type of Account:<br/> <br/> 
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="">Select Account</option>
            <option value="Donor">Donor Account</option>
            <option value="Beneficiary">Beneficiary Account</option>
          </select><br/><br/>
        <Button type="submit">Submit</Button>
        </label>
      </form>
        </center>
      </div>
    );
  }
}

/*
ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
*/
if(read_cookie('acc_type') === "Beneficiary"){
    ReactDOM.render(
    <Beneficiary />,
    document.getElementById('root')
  );
}
else if(read_cookie('acc_type') === "Donor"){
    ReactDOM.render(
    <Donor />,
    document.getElementById('root')
  );
}
else{
    ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}
