// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    
    contract Calc{
        
       uint [91] distanceMapLat  =[
    110604, 110587, 110537, 110452, 110335, 110183, 109998,
    109779, 109528, 109242, 108924, 108572, 108187, 107769,
    107318, 106835, 106319, 105771, 105190, 104578, 103934,
    103258, 102550, 101811, 101042, 100241,  99410,  98549,
     97657,  96736,  95786,  94806,  93797,  92760,  91694,
     90601,  89480,  88332,  87157,  85955,  84727,  83473,
     82194,  80890,  79561,  78208,  76831,  75431,  74008,
     72562,  71094,  69605,  68094,  66563,  65011,  63439,
     61848,  60239,  58611,  56965,  55301,  53621,  51925,
     50213,  48485,  46743,  44986,  43216,  41433,  39636,
     37828,  36009,  34178,  32337,  30486,  28626,  26757,
     24880,  22996,  21104,  19206,  17302,  15393,  13479,
     11561,   9640,   7715,   5788,   3860,   1930,      0
  ];
  uint distanceLng =110603;
  function round(uint number,uint32 bit) pure private returns(uint)
  {
      uint temp = 10**bit;
      return (number+temp/2)/temp;
  }
  
  //牛顿迭代法求平方根
    function sqrtu (uint256 x) private pure returns (uint128) {
    unchecked {
      if (x == 0) return 0;
      else {
        uint256 xx = x;
        uint256 r = 1;
        if (xx >= 0x100000000000000000000000000000000) { xx >>= 128; r <<= 64; }
        if (xx >= 0x10000000000000000) { xx >>= 64; r <<= 32; }
        if (xx >= 0x100000000) { xx >>= 32; r <<= 16; }
        if (xx >= 0x10000) { xx >>= 16; r <<= 8; }
        if (xx >= 0x100) { xx >>= 8; r <<= 4; }
        if (xx >= 0x10) { xx >>= 4; r <<= 2; }
        if (xx >= 0x8) { r <<= 1; }
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1;
        r = (r + x / r) >> 1; // Seven iterations should be enough
        uint256 r1 = x / r;
        return uint128 (r < r1 ? r : r1);
                 }
             }
         }
    function PointToPointDistance (uint startlat,uint startlng,uint endlat,uint endlng) public view returns(uint distance)
    {
        uint x;uint y;uint index;
        if(startlat>endlat){
            y = startlat - endlat;
            index = endlat/1e6;
        } 
        else
        {
            y = endlat-startlat;
            index = startlat/1e6;
        }
        if(startlng>endlng){
            x =startlng - endlng;
        }
        else {
            x =endlng-startlng;
        }
        uint res = sqrtu(x*x*(distanceMapLat[index]**2)+y*y*(distanceLng**2));
        if((x!=0)&&(y!=0))
        {
            return res;
        }
        return res*1e6;
    }
         
    function getPointToPointDistance (uint startlat,uint startlng,uint endlat,uint endlng) public view returns(uint distance)
    {
        uint x;uint y;uint index;
        if(startlat>endlat){
            y = startlat - endlat;
            index = endlat/1e6;
        } 
        else
        {
            y = endlat-startlat;
            index = startlat/1e6;
        }
        if(startlng>endlng){
            x =startlng - endlng;
        }
        else {
            x =endlng-startlng;
        }
        uint res = sqrtu(x*x*(distanceMapLat[index]**2)+y*y*(distanceLng**2));
        if((x!=0)&&(y!=0))
        {
            return round(res,6);
        }
        return res*1e6;
    }
    function FlatPointToLine(uint startlat,uint startlng,uint endlat,uint endlng,uint poilat,uint poilng) public view returns(uint)
    {
    uint a;uint b;uint c;
    a = PointToPointDistance(startlat, startlng, endlat, endlng);//经纬坐标系中求两点的距离
    b = PointToPointDistance(endlat, endlng, poilat, poilng);
    c = PointToPointDistance(startlat, startlng, poilat, poilng);
    if (b * b >= c * c + a * a) return c;
    if (c * c >= b * b + a * a) return b;
    uint l = (a + b + c) / 2;     //周长的一半   
    uint s = sqrtu(l * (l - a) * (l - b) * (l - c));  //海伦公式求面积 
    uint res = 2 * s / a;
    return res;
    }
    
     function pointtoline(uint startlat,uint startlng,uint endlat,uint endlng,uint poilat,uint poilng)public pure returns (uint,uint){
    uint A = endlat - startlat;
    uint B = startlng - endlng;
    uint C =startlat * endlng - startlng * endlat;
    uint ans1 = (poilng * B * B - poilat * A * B - A * C) / (A * A + B * B);
    uint ans2 = (poilat * A * A - A * B * poilng - B * C) / (A * A + B * B);
   //("垂足经度:"+Pedal[0]+"垂足纬度:"+Pedal[1]);
    return (ans1,ans2) ;
  }
}

