 //实现的功能：给出某一个点的经纬度和某一条道路的
  // 起止经纬度，计算出点到道路上的垂直距离，
  // 如果垂足不在道路上，则返回点与道路起止点的最小距离


  function PointToLine(startlat, startlng, endlat, endlng, poilat, poilng) {
    // let DEF_PI = 3.14159265359;
    //点到直线的垂足
    let Point = [poilng, poilat] //所求点
    let R = 6371
    let StrLonLat = [startlng, startlat]//StrLonLat EndLonLat表示直线的起止经纬度
    let EndLonLat = [endlng, endlat]
    let Pedal = pointtoline(Point, StrLonLat, EndLonLat) //Pedal表示垂足的经纬
    let PtoP = EDistance(Point, Pedal, R)//计算考虑了地球的弧度问题
    let PtoStr = EDistance(Point, StrLonLat, R)
    let PtoEnd = EDistance(Point, EndLonLat, R)
    let min = MIN(PtoP, PtoStr, PtoEnd)//要求的值
    return min
  }

  function FlatPointToLine(startlat, startlng, endlat, endlng, poilat, poilng) {
    var a, b, c;
    a = getGreatCircleDistance(startlat, startlng, endlat, endlng);//经纬坐标系中求两点的距离公式
    b = getGreatCircleDistance(endlat, endlng, poilat, poilng);//经纬坐标系中求两点的距离公式
    c = getGreatCircleDistance(startlat, startlng, poilat, poilng);//经纬坐标系中求两点的距离公式
    // a =EDistance([startlat, startlng], [endlat, endlng],6371);//经纬坐标系中求两点的距离公式
    // b = EDistance([endlat, endlng], [poilat, poilng],6371);//经纬坐标系中求两点的距离公式
    // c = EDistance([startlat, startlng], [poilat, poilng],6371);//经纬坐标系中求两点的距离公式
    if (b * b >= c * c + a * a) return c;
    if (c * c >= b * b + a * a) return b;
    var l = (a + b + c) / 2;     //周长的一半   
    var s = Math.sqrt(l * (l - a) * (l - b) * (l - c));  //海伦公式求面积 
    return 2 * s / a;
  }
  
  function EDistance(LonLat1, LonLat2, R) {
    //将两点经纬度转换为三维直角坐标
    let DEF_PI = 3.14159265359
    let x1 = Math.cos(getRad(LonLat1[0] * 1))
    let y1 = Math.sin(getRad(LonLat1[0] * 1))
    let z1 = Math.tan(getRad(LonLat1[1] * 1))
    let x2 = Math.cos(getRad(LonLat2[0] * 1))
    let y2 = Math.sin(getRad(LonLat2[0] * 1))
    let z2 = Math.tan(getRad(LonLat2[1] * 1))
    //根据直角坐标求两点间的直线距离（即弦长）
    let L = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2))
    //根据弦长求两点间的距离（即弧长）
    let Eudis = 2 * getRad(Math.asin(0.5 * L / R))
    return Eudis;
  }
  //使用的数学计算方法，计算两个坐标的直线距离(弧长)
  function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = getRad(lat1)
    let radLat2 = getRad(lat2);

    let a = radLat1 - radLat2;
    let b = getRad(lng1) - getRad(lng2);

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6337139.0;
    s = Math.round(s * 10000) / 10000.0;
    return s;
  }

  function pointtoline(point, strlonlat, endlonlat) {
    let A = endlonlat[1] - strlonlat[1]
    let B = strlonlat[0] - endlonlat[0]
    let C = strlonlat[1] * endlonlat[0] - strlonlat[0] * endlonlat[1];
    let Pedal = []
    Pedal[0] = (point[0] * B * B - point[1] * A * B - A * C) / (A * A + B * B)
    Pedal[1] = (point[1] * A * A - A * B * point[0] - B * C) / (A * A + B * B)
    // alert("垂足经度:"+Pedal[0]+"垂足纬度:"+Pedal[1]);
    return Pedal;
  }
  function MIN(pp, ps, pe) {
    let mindis;
    if (pp < ps && pp < pe)
      mindis = pp;
    else if (ps < pe)
      mindis = ps;
    else
      mindis = pe;

    return mindis;
  }


  function getRad(d) {
    return d * 3.1415926 / 180.0;
  }
  
  let stringtoHex = function (str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    val += "0a"
    return val
}

  //保留n位小数，不够的用0补齐
  function  changeDecimal(number, bitNum) {
    let f_x = parseFloat(number);
    if (isNaN(f_x)) {
      return 0;
    }
    let s_x = number.toString();
    let pos_decimal = s_x.indexOf('.');
    //没有小数点的加上小数点
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      if(bitNum!=0){
        s_x += '.';
      }else{
        //没有小数点还要保留0位小数
        return s_x;
      }
    }
    if(s_x.length <= pos_decimal + bitNum ) {
      //eg:122 保留2位小数
      //return 122.00
      while (s_x.length <= pos_decimal + bitNum) {
        s_x += '0';
      }
    }else{
      //eg:1.222222  保留2位小数
      //return 1.22
      s_x=s_x.substring(0, pos_decimal + bitNum+1)
    }
    return s_x;
  }

  let red = 6378.137;
  let longitude1= 113.37459961711058;
  let latitude1= 23.047508654381208;
  let longitude2= 113.3747961711058;
  let latitude2= 23.047908654381208;
  //113374599,23047508,113374796,23047908
  let longtitude3=113.3813231234556;
  let latitude3=23.051234123213;
  //113374599,23047508,113374796,23047908,113381323,23051234
  let res =[]
  // for(let i = 0;i<=90;i++)
  // {
  //   res.push(Math.round(getGreatCircleDistance(i,0,i,1)))
  // }
  // console.log(res)
  // console.log(EDistance([0,0],[0,1],red))
  // console.log(getGreatCircleDistance(0,1,0,0))
// console.log(EDistance([179,0],[180,1],red))
function deleteDot(num){
    let str = num.toString()
    let dot = "."
    let pos =str.indexOf(dot)
    let arr =str.split("")
    arr.splice(pos,1)
    return arr.join('')

}

for(let i =0;i<40;i++)
{
  let a =Math.random()*90;
  let b =Math.random()*180;
  let c = a + Math.random();
  let d = b +Math.random();
  a=changeDecimal(a, 6)
  b=changeDecimal(b, 6)
  c=changeDecimal(c, 6)
  d=changeDecimal(d, 6)
  console.log(`${a.toString()},${b},${c},${d}`)
  console.log(getGreatCircleDistance(a,b,c,d))
  console.log(" ")
}

let a =Math.random()*90;
let b =Math.random()*180;
// console.log(FlatPointToLine(60047508,113374599,60047908,113604796,60601234,113601323))
23047508,113374599,23047908,113374796,23051234,113381323
// console.log(getGreatCircleDistance(latitude1,longitude1,latitude2,longitude2))

// 110604, 110587, 110537, 110452, 110335, 110183, 109998,
// 109779, 109528, 109242, 108924, 108572, 108187, 107769,
// 107318, 106835, 106319, 105771, 105190, 104578, 103934,
// 103258, 102550, 101811, 101042, 100241,  99410,  98549,
//  97657,  96736,  95786,  94806,  93797,  92760,  91694,
//  90601,  89480,  88332,  87157,  85955,  84727,  83473,
//  82194,  80890,  79561,  78208,  76831,  75431,  74008,
//  72562,  71094,  69605,  68094,  66563,  65011,  63439,
//  61848,  60239,  58611,  56965,  55301,  53621,  51925,
//  50213,  48485,  46743,  44986,  43216,  41433,  39636,
//  37828,  36009,  34178,  32337,  30486,  28626,  26757,
//  24880,  22996,  21104,  19206,  17302,  15393,  13479,
//  11561,   9640,   7715,   5788,   3860,   1930,      0