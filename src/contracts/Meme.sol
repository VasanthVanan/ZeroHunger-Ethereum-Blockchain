pragma solidity ^0.5.0;

contract Meme {
  string public benReq; 
  string public communication;
  string public phone; 
  string public account; string public accept; 

  string public donAcc;
  string public donCnct;
  string public donphn;

  function setBen(string memory _benReq,string memory _communication, string memory _account, string memory _phone) public {
    benReq = _benReq;
    communication = _communication;
    phone = _phone;
    account = _account;
  }

  function setAccept(string memory _accept, string memory _acc, string memory cont, string memory phn) public{
    accept = _accept;
    donAcc = _acc;
    donCnct = cont;
    donphn = phn;
  } 

  function getBen() public view returns (string memory) {
    return benReq;
  }
  function getBenC() public view returns (string memory) {
    return communication;
  }

  function getBenAccept() public view returns (string memory) {
    return accept;
  }

  function getBenA() public view returns (string memory) {
    return account;
  }

  function getBenP() public view returns (string memory) {
    return phone;
  }
  function getBenDp() public view returns (string memory) {
    return donphn;
  }
  function getBenDc() public view returns (string memory) {
    return donCnct;
  }
  function getBenDa() public view returns (string memory) {
    return donAcc;
  }
}
