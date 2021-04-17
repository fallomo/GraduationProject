pragma solidity ^0.4.21;
contract UserManagement{
    struct User{
        address Address;
        string Name;
        string ID;
        string PhoneNum;
        uint256 Credit;
        uint256 OrderNum;
    }
    
    address Manager;
    
    User[]public users;
    
    uint256 i=0;
    
    constructor()public{
        Manager=msg.sender;
    }
    
    function JudgeString(string a, string b) pure public returns (bool) {
        keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    function InitInfo(string name,string id,string phonenum,address add)public{
        require(msg.sender==Manager,"Only manager can update the user's infomation.");
        users[i].Address=add;
        users[i].Name=name;
        users[i].ID=id;
        users[i].PhoneNum=phonenum;
        users[i].Credit=0;
        users[i].OrderNum=0;
        i++;
    }
    
    function CreditCount(uint256 credit_per_order,uint256 user_index)public{
        users[user_index].Credit+=credit_per_order;
    }
    
    function ShowCredit(uint256 user_index) public view returns(uint256){
        require(users[user_index].OrderNum!=0,"The user hasn't take taxi yet.");
        uint256 Grades;
        Grades=users[user_index].Credit/users[user_index].OrderNum;
        return Grades;
    }
    
    function NewOrder(uint256 user_index,uint256 credit_per_order)public{
        users[user_index].OrderNum+=1;
        CreditCount(credit_per_order,user_index);
    }
    
    function GetUserIndex(string id) public view returns(uint256){
        for(uint256 j=0;j<users.length;j++)
        {
            if(JudgeString(users[j].ID,id))
            {
                return j;
            }
        }
        revert();
    }
   
}