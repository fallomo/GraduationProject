// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    


    contract Position{
        address Manager;
        
        uint[] Latitude;
        uint[] Longitude;
        uint[] PositionTime;
        
        uint256 OrderCreatedTime;
        uint256 OrderTime;
        uint256 OrderIndentifier;
        uint16 OrderStatus;
        
        uint[2]  StartingPoint;
        uint256 StartingTime;
        uint DoneTime;
        uint[2] Destination;
        uint _length=100;
        //测试网络下地址
        // address CalcAddress=0x6E3BC20F19f8B6012Be72551701930FC32512994;
        //虚拟机下地址
        address CalcAddress=0xf8e81D47203A594245E36C48e151709F0C19fBe8;
        Calc calc=Calc(CalcAddress);
         struct ErrorReport
         {
             uint startlat;
             uint startlng;
             uint endlat;
             uint endlng;
             uint poilat;
             uint poilng;
             uint errorTime;
         }
         
         ErrorReport[] report;
         
         constructor(){
             Manager =msg.sender;
         }
        
        event Created(uint256 OrderIndentifier,uint256 OrderCreatedTime,uint16 OrderStatus);
        event Done(uint256 OrderIndentifier,uint256 OrderTime);
        event GetPosition(uint[] latitude,uint[] Longitude);
        event RouteOut(uint endlat,uint endlng,uint poilat,uint poilng,uint distance);
        
        
        function RandomNum(uint256 Length) public view returns(uint256){
            uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
            return random%Length;
        }
        
        function JudgeString(string memory a, string memory b) pure public returns (bool) {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    
        function NewOrder() onlyOwner  orderWillCreated  public{
             OrderIndentifier=RandomNum(_length);
             OrderStatus=1;
             OrderTime=block.timestamp;
             emit Created(OrderIndentifier,OrderCreatedTime,OrderStatus);
        }
        
        function Starting(uint[2] memory _from,uint[2] memory _to)public orderCreated onlyOwner{
                StartingPoint=_from;
                Destination=_to;
                OrderStatus=2;
                StartingTime=block.timestamp;
        }
        
    
        function addPosition(uint latitude,uint longitude)public onlyOwner orderStarted{
            Latitude.push(latitude);
            Longitude.push(longitude);
            PositionTime.push(block.timestamp);
        }
        
        function JudgeOut( uint startlat,uint startlng,uint endlat,uint endlng,uint poilat,uint poilng)public onlyOwner orderStarted returns(uint)
        {
           uint distance = calc.FlatPointToLine(startlat,startlng,endlat,endlng,poilat,poilng);
           if(distance > 200)
           {
               ErrorReport memory temp = ErrorReport(startlat,startlng,endlat,endlng,poilat,poilng,block.timestamp);
               report.push(temp);
                emit RouteOut(endlat,endlng,poilat,poilng,distance);
                return 1;
           }
           else return 0;
        }
        
        function getPosition()public view returns(uint[]memory,uint[]memory){
           return (Latitude,Longitude);
        }
        
        function getErrorReport()public view returns(ErrorReport[] memory)
        {
            return(report);
        }
        
     function CalcTest()public view returns (uint){
        return calc.getPointToPointDistance(0,0,0,1);
     }
     
      function Arrival()public orderStarted returns(uint){
        uint distance =  calc.getPointToPointDistance(Latitude[Latitude.length-1],Longitude[Longitude.length-1],Destination[0],Destination[1]);
        if(distance<200)
        {
             DoneTime=block.timestamp;
             OrderStatus=3;
             OrderTime=DoneTime-StartingTime;
             emit Done(OrderIndentifier,OrderTime);
             return 1;
         }
         else return 0;
        }  
     
        modifier orderWillCreated {
        require(OrderStatus == 0,"Staues error");     
        _;
        }
        modifier orderCreated {
        require(OrderStatus == 1,"Staues error");     
        _;
        }
        modifier orderStarted {
        require(OrderStatus == 2,"Staues error");     
        _;
        }
         modifier onlyOwner {
        require(
            msg.sender == Manager,
            "Only owner can call this function."
        );
        _;
    }
    }
    
    interface Calc{
     function getPointToPointDistance (uint startlat,uint startlng,uint endlat,uint endlng) external view returns(uint distance);
     function FlatPointToLine(uint startlat,uint startlng,uint endlat,uint endlng,uint poilat,uint poilng) external view returns(uint);
}
