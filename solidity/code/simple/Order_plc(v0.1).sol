pragma solidity ^0.4.21;

contract Order_plc{
    address UserID;      
    address DriverID;
    
    string UserPhoneNum;
    string DriverPhoneNum;
    string StartingPoint;
    string Destination;
    
    uint256 OrderCreatedTime;
    uint256 OrderTime;
    uint256 OrderIndentifier;
    address Manager;
    
    constructor()public{
        Manager=msg.sender;
    }
    
    function OrderRecord(address user_id,address driver_id,string user_pnum,string driver_pnum,
    string start_point,string destination,uint256 order_ctime,uint256 order_time,uint256 order_indentifier)public{
        require(msg.sender==Manager,"Only manager can record the order.");
        
        UserID=user_id;
        DriverID=driver_id;
    
        UserPhoneNum=user_pnum;
        DriverPhoneNum=driver_pnum;
        StartingPoint=start_point;
        Destination=destination;
    
        OrderCreatedTime=order_ctime;
        OrderTime=order_time;
        OrderIndentifier=order_indentifier;
    }
}