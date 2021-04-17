pragma solidity ^0.4.24;

contract Order_pvt{
    address UserID;      
    address DriverID;
    
    string UserPhoneNum;
    string DriverPhoneNum;
    string StartingPoint;
    string Destination;
    string CurrentLocation;
    string OrderStatus;
    
    uint256 OrderCreatedTime;
    uint256 StartingTime;
    uint256 DoneTime;
    uint256 OrderTime;
    uint256 OrderIndentifier;
    
    uint _length=10000;
    
    event Created(uint256 OrderIndentifier,uint256 OrderCreatedTime,string OrderStatus);
    event Done(uint256 OrderIndentifier,string CurrentLocation,uint256 OrderTime);
    
    function RandomNum(uint256 Length) public view returns(uint256){
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%Length;
    }
    
    function JudgeString(string a, string b) pure public returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function NewOrder(address User,address Driver,string UserNum,string DriverNum)public{
         UserID=User;
         DriverID=Driver;
         UserPhoneNum=UserNum;
         DriverPhoneNum=DriverNum;
         OrderIndentifier=RandomNum(_length);
         OrderStatus="CREATED";
         OrderTime=now;
         emit Created(OrderIndentifier,OrderCreatedTime,OrderStatus);
    }
    
    function Starting(string _from,string _to)public{
            StartingPoint=_from;
            CurrentLocation=_from;
            Destination=_to;
            OrderStatus="INPROGRESS";
            StartingTime=now;
    }
    
    function LocationUpdate(string UpdateLocation)public{
        CurrentLocation=UpdateLocation;
    }
    
    function Arrival()public{
        if(JudgeString(CurrentLocation,Destination))
        {
            DoneTime=now;
            OrderStatus="DONE";
            OrderTime=DoneTime-StartingTime;
            emit Done(OrderIndentifier,CurrentLocation,OrderTime);
        }
    }
}