var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
	if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        console.log("costum provider")
    } else {
   		web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/18520ccfd2e848bea8e5b2431b64308c")); //Httpprovider
		wsweb3=new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/18520ccfd2e848bea8e5b2431b64308c"));  //WebsocketProvider
        console.log("default provider")
     }

const abi = require('../assets/Abi')


const address = '0xE75a7f29f62C7B2D1f377E50A04817CaCe730793'

const contract = new web3.eth.Contract(abi,address)
const wscontract =new wsweb3.eth.Contract(abi,address)
const account1 = '0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e';
const pk1='2e4ee773a8e1bbba0e30896e758ea003b53991999d310434e07171abb8b11a31' ;
const privateKey1 = Buffer.from(pk1, 'hex');


// CryptoZombies.methods.createRandomZombie("Vitalik Nakamoto")

	

//监听事件函数
// wscontract.events.allEvents(function(error, event){
// 	console.log(event.event);
// })
// let start = contract.methods.Starting([113374599,23047508],[113374796,23047908]).encodeABI()
// let cancal = contract.methods.CancalOrder().encodeABI();
// let judge = contract.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI();
// let addPosition =  contract.methods.addPosition().encodeABI()
// sendOrderMethods(judge)
// .then(res=>console.log(res))
// .catch(err=>console.log(err))
// console.log("ok")

module.exports= {contract,wscontract,sendOrderMethods}
