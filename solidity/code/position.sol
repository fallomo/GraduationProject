pragma solidity ^0.4.24; 

contract Position {

   struct OrderForm {
        string id;
        
        uint256 OrderCreatedTime;
        uint256 OrderIndentifier;
        
        uint[] latitude;
        uint[] langitude;
    }
    
    OrderForm[] public orderforms;
    
    event Created(string _id,uint256 OrderCreatedTime);
    event GetPosition(uint[] latitude,uint[] langitude);
    event AddPosition(bool);
    // event Done(uint256 OrderIndentifier,string CurrentLocation,uint256 OrderTime);
    uint i=0;
    // constructor(string ,uint a,uint b)public{
    // }

    function RandomNum(uint256 Length) public view returns(uint256){
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%Length;
    }
    uint _length = 100;
    
    function JudgeString(string a, string b) pure public returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // function Create(string _id,uint _latitude,uint _langitude) public 
    // {
    //     orderforms[i].id=_id;
    //     orderforms[i].latitude.push(_latitude);
    //     orderforms[i]. langitude.push(_langitude);
    //     emit Created(uint256 OrderID,uint256 OrderCreatedTime,string OrderStatus);
    // }
     function createOrder(string _id, uint _latitude,uint _langitude) public 
     {
         uint[] memory temp = new uint[](1);
         uint time =now;
         orderforms[i].latitude.push(_latitude);
         orderforms[i].langitude.push(_latitude);
         emit Created(_id,time);
         i++;
    }
    function addPosition(string _id,uint _latitude,uint _langitude) public  returns (bool) 
    {
        for(uint k=0;k<orderforms.length;k++)
        {
            if(JudgeString(orderforms[k].id,_id))
            {
              orderforms[k].latitude.push(_latitude);
              orderforms[k].langitude.push(_langitude);
              emit AddPosition(true);
              return true;
            }
        }
         emit AddPosition(false);
        return false;
    }
    function getLength() public returns (uint){
        return i;
    }
    
    function getPosition(string _id)
    {
        for(uint k=0;k<orderforms.length;k++)
        {
             if(JudgeString(orderforms[k].id,_id))
             {
                 emit GetPosition(orderforms[k].latitude,orderforms[k].langitude);
             }
             else {
                 uint[] memory temp;
                 emit GetPosition(temp,temp);
                 
             }
        }

    }
    
}
