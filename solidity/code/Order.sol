// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    


    contract Order{
        address Manager;
        
        uint[] Latitude;
        uint[] Longitude;
        uint[] PositionTime;
        
        uint256 OrderCreatedTime;
        uint256 OrderTime;
        uint256 OrderIndentifier;
        uint16 OrderStatus; //0 init 1 Created 2 Started 3 Arrival 4 Cancal
        
        uint[2]  StartingPoint;
        uint256 StartingTime;
        uint DoneTime;
        uint[2] Destination;
        uint _length=1e6;
        //测试网络下地址
        address CalcAddress=0x6673fCf9E2C75790A86a3332ae9b9C4a4e010927;
        //虚拟机下地址
        // address CalcAddress=0xf8e81D47203A594245E36C48e151709F0C19fBe8;
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
        event RouteOut(uint endlat,uint endlng,uint poilat,uint poilng,uint distance,address Manager);
        
        
        function RandomNum(uint256 Length) private view returns(uint256){
            uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
            return random%Length;
        }
        
        function JudgeString(string memory a, string memory b) pure private returns (bool) {
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
                emit RouteOut(endlat,endlng,poilat,poilng,distance,Manager);
                return 1;
           }
           else return 0;
        }
        

        function getPosition()public view returns(uint[]memory,uint[]memory,uint[]memory){
           return (Latitude,Longitude,PositionTime);
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
        function CancalOrder()public orderNotEnd returns(uint){
             DoneTime=block.timestamp;
             OrderStatus=4;
             OrderTime=DoneTime-StartingTime;
             emit Done(OrderIndentifier,OrderTime);
             return 1;
        }  
        function getAllMessage()public view returns(uint,uint,uint,uint16,uint[2] memory,uint,uint,uint[2] memory){
            return (OrderCreatedTime,OrderTime,OrderIndentifier,OrderStatus,StartingPoint,StartingTime,DoneTime,Destination);
        }
        modifier orderWillCreated {
        require(OrderStatus == 0,"Status error");     
        _;
        }
        modifier orderCreated {
        require(OrderStatus == 1,"Status error");     
        _;
        }
        modifier orderStarted {
        require(OrderStatus == 2,"Status error");     
        _;
        }
         modifier orderNotEnd {
        require((OrderStatus !=3)&&(OrderStatus!=4) ,"Status error");     
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

contract UserPage
{
     address Manager;  //记录所有者地址
     string UrgencyMail;  //记录紧急联系人电子邮箱
     string Username;   //记录所有者姓名昵称
     address UrgencyAddress; //记录紧急联系人地址

        struct ErrorReport
         {
             uint startlat;	//用于记录出发位置
             uint startlng;
             uint endlat;  //用于记录原定目标
             uint endlng;
             uint poilat;   //用于记录现在位置
             uint poilng;
             uint errorTime;  //用于记录事件发生的时间
         }
         
         ErrorReport[] report;  //结构体数组，用于容纳复数的错误报告

}
