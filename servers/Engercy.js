let sendmail = require('./compoment/mail/mail')
const account = require('./compoment/assets/Account')
const abi = require('./compoment/assets/Abi')
const Address = require('./compoment/assets/Address')
let tool = require('./compoment/smartcontract/common')

let orderaddress = '0x59773f19cA1d12cD5695932D48A59B21BB8D4Abe';
let usertocontractaddress = Address.UserToContractAddress;
let userpageaddress = Address.UserPageAddress;

let orderevent = tool.getWsContract(abi.OrderAbi,orderaddress);
let order = tool.getHttpContract(abi.OrderAbi,orderaddress);
let usertocontract =tool.getHttpContract(abi.UserToConTractAbi,usertocontractaddress)
let userpage = tool.getHttpContract(abi.UserPageAbi,userpageaddress)


let start = order.methods.Starting([113374599,23047508],[113374796,23047908]).encodeABI();
let judge = order.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI();

let account1 = account.account1;
let privateKey1 = account.privateKey1;
// wscontract.events.allEvents(function(error, event){
// 	console.log(event.event);
//     if(event.event="RouteOut")
//     {
//         //调用邮件
//     }
// })
// Order.sendOrderMethods(judge);

function numFormat(num,bit) {
    let result = String(num).split("").reverse();
    let point = result.indexOf(".");

    // for (let i = point === -1 ? 3 : point + 4; i < result.length; i += 3) {
    //   result.splice(i, 0, ",");
    //   i++;
    // }
    let i = point === -1? bit : point + bit+1
    result.splice(i, 0, ".");
    return result.reverse().join("");
  }

let orderlistener=orderevent.events.allEvents(function(error, event){
    	console.log(event.event);
        if(event.event=="RouteOut")
        {
            let resp = event.returnValues;
            let message = '<p>您的紧急联系人在坐标('+numFormat(resp.poilat,6)+','+numFormat(resp.poilng,6)+') 脱离了路径，请尽快联系</p><br/><p>脱离目标地点('+numFormat(resp.endlat,6)+','+numFormat(resp.endlng,6)+')'+numFormat(resp.distance,6)+'米，<br/>脱离信息已在区块链 '+orderaddress+' 备份</p></br><p>前往 https://ropsten.etherscan.io/address/'+orderaddress+' 查看<p>'
            userpage.methods.GetUrgency().call((err,res)=>{sendmail(res[0],'您的紧急联系人:'+res[1]+' 在行程中脱离了路径',message)})
    
            // tool.sendTransaction(account1,privateKey1,account.account2,'test',100);
        }
    })

// tool.sendMethods(account.account1,account.privateKey1,orderaddress,judge)
// tool.sendMethods(account.account1,account.privateKey1,usertocontractaddress,usertocontract.methods.SetMyContract('0x874B070ECFAd6C6575FB85FB924Ce573b1f6ff98').encodeABI())
// tool.sendMethods(account1,privateKey1,usertocontractaddress,usertocontract.methods.GetMyContractAddress().encodeABI())
// tool.sendMethods(account1,privateKey1,usertocontractaddress,usertocontract.methods.GetMyContractAddress().encodeABI())
// usertocontract.methods.GetMyContractAddress().call((err,res)=>{console.log(res)})
//'812925285@qq.com','李诗云',0x88d8C29D6C1d048a08e426b0C3E56C6185e88e9C
// userpage.methods.GetUrgency().call((err,res)=>{sendmail(res[0],'您的紧急联系人:'+res[1]+' 在行程中脱离了路径','详情请见附件')})



// tool.sendMethods(account1,privateKey1,userpageaddress,userpage.methods.SetInformation('812925285@qq.com','李诗云').encodeABI())
//tool.sendMethods(account1,privateKey1,orderaddress,order.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI());
module.exports = orderlistener