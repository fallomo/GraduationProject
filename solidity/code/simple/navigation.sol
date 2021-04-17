// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
import 'owner.sol';
contract Navigation {

    address private owner;
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    
    function PointToLine(uint startlat,uint startlng,uint endlat,uint endlng,uint poilat,uint poilng) {
    // var DEF_PI = 3.14159265359;
    //点到直线的垂足
    uint Point = [poilng, poilat]; //所求点
    uint R = 6371;
    uint StrLonLat = [startlng, startlat];//StrLonLat EndLonLat表示直线的起止经纬度
    var EndLonLat = [endlng, endlat];
    var Pedal = this.pointtoline(Point, StrLonLat, EndLonLat); //Pedal表示垂足的经纬
    var PtoP = this.EDistance(Point, Pedal, R);//计算考虑了地球的弧度问题
    var PtoStr = this.EDistance(Point, StrLonLat, R);
    var PtoEnd = this.EDistance(Point, EndLonLat, R);
    var min = this.MIN(PtoP, PtoStr, PtoEnd);//要求的值
    return min
  }

    
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender; 
        emit OwnerSet(address(0), owner);
    }

    function changeOwner(address newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }
}