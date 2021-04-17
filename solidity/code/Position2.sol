pragma solidity ^0.4.24;

contract Position{
    address Manager;
    uint[] Latitude;
    uint[] Langitude;
    uint256 OrderCreatedTime;
    uint256 OrderTime;
    uint256 OrderIndentifier;
    string OrderStatus;
    string StartingPoint;
    uint256 StartingTime;
    string Destination;
    uint _length=100;
    
    constructor()public{
        Manager=msg.sender;
    }
    
    event Created(uint256 OrderIndentifier,uint256 OrderCreatedTime,string OrderStatus);
    event Done(uint256 OrderIndentifier,string CurrentLocation,uint256 OrderTime);
    event GetPosition(uint[] latitude,uint[] langitude);
    function RandomNum(uint256 Length) public view returns(uint256){
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%Length;
    }
    
    function JudgeString(string a, string b) pure public returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function NewOrder()public{
         OrderIndentifier=RandomNum(_length);
         OrderStatus="CREATED";
         OrderTime=now;
         emit Created(OrderIndentifier,OrderCreatedTime,OrderStatus);
    }
    
    function Starting(string _from,string _to)public{
            StartingPoint=_from;
            Destination=_to;
            OrderStatus="INPROGRESS";
            StartingTime=now;
    }
    
    // function LocationUpdate(string UpdateLocation)public{
    //     CurrentLocation=UpdateLocation;
    // }

    function addPosition(uint latitude,uint langitude){
        Latitude.push(latitude);
        Langitude.push(langitude);
    }
    
    function getPosition(){
        emit GetPosition(Latitude,Langitude);
        
    }
 
    // function Arrival()public{
    //     if(JudgeString(CurrentLocation,Destination))
    //     {
    //         DoneTime=now;
    //         OrderStatus="DONE";
    //         OrderTime=DoneTime-StartingTime;
    //         emit Done(OrderIndentifier,CurrentLocation,OrderTime);
    //     }
    // }
}