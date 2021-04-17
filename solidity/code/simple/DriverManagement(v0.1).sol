pragma solidity ^0.4.21;
contract DriverManagement{
    struct Driver{
        address Address;
        string Name;
        string ID;
        string VehicleID;
        string PhoneNum;
        uint256 Credit;
        uint256 OrderNum;
    }
    
    address Manager;
    
    Driver[]public drivers;
    
    uint256 i=0;
    
    constructor()public{
        Manager=msg.sender;
    }
    
    function JudgeString(string a, string b) pure public returns (bool) {
        keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    function InitInfo(string name,string id,string phonenum,address add,string vehicleid)public{
        require(msg.sender==Manager,"Only manager can update the driver's infomation.");
        drivers[i].Address=add;
        drivers[i].Name=name;
        drivers[i].ID=id;
        drivers[i].PhoneNum=phonenum;
        drivers[i].Credit=0;
        drivers[i].OrderNum=0;
        drivers[i].VehicleID=vehicleid;
        i++;
    }
    
    function CreditCount(uint256 credit_per_order,uint256 driver_index)public{
        drivers[driver_index].Credit+=credit_per_order;
    }
    
    function ShowCredit(uint256 driver_index)public view returns(uint256){
        require(drivers[driver_index].OrderNum!=0,"A new driver, no order yet.");
        uint256 Grades;
        Grades=drivers[driver_index].Credit/drivers[driver_index].OrderNum;
        return Grades;
    }
    
    function NewOrder(uint256 driver_index,uint256 credit_per_order)public{
        drivers[driver_index].OrderNum+=1;
        CreditCount(credit_per_order,driver_index);
    }
    
    function GetDriverIndex(string id)public view returns(uint256){
        for(uint256 j=0;j<drivers.length;j++)
        {
            if(JudgeString(drivers[j].ID,id))
            {
                return j;
            }
        }
        revert();
    }
   
}