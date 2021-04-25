// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 contract UserToContract{
     address Manager;
     mapping(address => uint) UserContract; //用户地址到用户合约地址的映射，存在隐式转换
     constructor(){
         Manager=msg.sender;
     }
     function GetUserContractAddress (address useraddress)public view returns(uint) {
            return UserContract[useraddress];
     }
     function GetMyContractAddress ()public view returns(uint) {
            return UserContract[msg.sender];
     }
     function SetMyContract(uint256 contractaddress) public
     {
         require(UserContract[msg.sender]==0,"Already Set");
         UserContract[msg.sender]=contractaddress;
     }
     function SetMyContractHard(address useraddress,uint256 contractaddress) onlyOwner public
     {
         UserContract[useraddress]=contractaddress;
     }
        modifier onlyOwner {
        require(
            msg.sender == Manager,
            "Only owner can call this function."
        );
        _;
    }
 }
    
 contract UserPage{
     address Manager;
     string UrgencyMail;
     string Username;
     address UrgencyAddress;
     
     mapping(uint =>address) OrderList;
     uint OrderNumber;
     constructor(){
         Manager=msg.sender;
         OrderNumber=0;
         UrgencyAddress=0x88d8C29D6C1d048a08e426b0C3E56C6185e88e9C;
     }
     function AddOrder(address orderaddress)public{
         OrderList[OrderNumber]=orderaddress;
         OrderNumber++;
     }
     function GetOrderList()public view returns(address){
         return OrderList[OrderNumber];
     }
     function SetInformation(string memory mailaddress,string memory username)public
     {
         UrgencyMail = mailaddress;
         Username =username;
     }
     function GetUrgency()public view returns(string memory,string memory,address){
         return (UrgencyMail,Username,UrgencyAddress);
     }
    modifier onlyOwner {
        require(
            msg.sender == Manager,
            "Only owner can call this function."
        );
        _;
    }
 }