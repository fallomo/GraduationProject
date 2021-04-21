var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
	if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        console.log("1")
    } else {
   		web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/18520ccfd2e848bea8e5b2431b64308c")); //Httpprovider
		wsweb3=new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/18520ccfd2e848bea8e5b2431b64308c"));  //WebsocketProvider
        console.log("2")
     }
    // web3.eth.defaultAccount = web3.eth.accounts[0];

const abi = require('../assets/OrderAbi')


const address = '0xE75a7f29f62C7B2D1f377E50A04817CaCe730793'

const contract = new web3.eth.Contract(abi,address)
const wscontract =new wsweb3.eth.Contract(abi,address)
const account1 = '0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e';
const pk1='2e4ee773a8e1bbba0e30896e758ea003b53991999d310434e07171abb8b11a31' ;
const privateKey1 = Buffer.from(pk1, 'hex');
// web3.eth.getBalance("0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e", (err, wei) => {
// balance = web3.utils.fromWei(wei, 'ether')
// console.log("balance: " + balance)
// })

// CryptoZombies.methods.createRandomZombie("Vitalik Nakamoto")
function sendOrderMethods(data){
	return new Promise((resolve, reject)=>{
		web3.eth.getTransactionCount(account1,"pending", (err, txCount) => {

			// 创建交易对象
			const txObject = {
			  nonce:    web3.utils.toHex(txCount),
			  gasLimit: web3.utils.toHex(8000000),
			  gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
			  to: address,
			  data: data
			}
		  
			// 签署交易
			const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
			tx.sign(privateKey1)
		  
			const serializedTx = tx.serialize()
			const raw = '0x' + serializedTx.toString('hex')
		  
			// 广播交易
			web3.eth.sendSignedTransaction(raw, (err, txHash) => {
			  console.log('txHash:', txHash)
			  if(!err) resolve(txHash)
			  else reject(err);
			  // 可以去ropsten.etherscan.io查看交易详情
			})
		  }
		  )}
		  )}
	


// function transform1() {  
// 	return new Promise((resolve, reject)=>{
// 		web3.eth.getTransactionCount(account1,"pending",(err, txCount) => {
// 			// 创建交易对象
// 			console.log(txCount)
// 			const txObject = {
// 			  nonce:    web3.utils.toHex(txCount),
// 			  gasLimit: web3.utils.toHex(77180),
// 			  gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
// 			  to: address,
// 			  data: contract.methods.addPosition(322,124).encodeABI()
// 			}
			
// 			// 签署交易
// 			const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
// 			tx.sign(privateKey1)
			
// 			const serializedTx = tx.serialize()
// 			const raw = '0x' + serializedTx.toString('hex')
			
// 			// 广播交易
// 			web3.eth.sendSignedTransaction(raw, (err, txHash) => {
// 			  console.log('txHash:', txHash)
// 			  // 可以去ropsten.etherscan.io查看交易详情
// 			})
// 			})
// 			let result = 0;
// 				contract.methods.getPosition().call((err, res) => { 
// 					if(res)
// 					{
// 					result =res
// 					resolve(result)
// 					}
// 					else reject(err)
// 				})
//     })

// }

// let test = transform1()
// test.then(res=>{console.log(res);})
// .catch(err=>{console.log(err)})
// contract.methods.CalcTest().call((err, res) => { 
// 	console.log(res)
// })

// contract.events.RouteOut(
//     "SomeEvent",
//     { fromBlock: "latest", toBlock: "latest" },
//     (errors, events) => {
//         if (!errors) {
//            console.log(events)
//         }
//     }
// );

//监听事件函数
wscontract.events.allEvents(function(error, event){
	console.log(event.event);
})
// .on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })
// .on('changed', function(event){
//     // remove event from local database
// })
// .on('error', console.error);
// contract.events.Created(function(error, event){
// 	console.log(event.event);
// 	});
// let Judge = contract.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI()

// web3.eth.getTransactionCount(account1,"pending", (err, txCount) => {

// 	// 创建交易对象
// 	const txObject = {
// 	  nonce:    web3.utils.toHex(txCount),
// 	  gasLimit: web3.utils.toHex(8000000),
// 	  gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
// 	  to: address,
// 	  data: contract.methods.NewOrder().encodeABI()
// 	}
  
// 	// 签署交易
// 	const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
// 	tx.sign(privateKey1)
  
// 	const serializedTx = tx.serialize()
// 	const raw = '0x' + serializedTx.toString('hex')
  
// 	// 广播交易
// 	web3.eth.sendSignedTransaction(raw, (err, txHash) => {
// 	  console.log('txHash:', txHash)
// 	  // 可以去ropsten.etherscan.io查看交易详情
// 	})
//   })
let neworder = contract.methods.NewOrder().encodeABI()
let start = contract.methods.Starting([113374599,23047508],[113374796,23047908]).encodeABI()
let cancal = contract.methods.CancalOrder().encodeABI();
let judge = contract.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI();
// contract.methods.NewOrder().send({from:account1})
// .then(function(receipt){
//     console.log(receipt)
// });
sendOrderMethods(judge)
.then(res=>console.log(res))
.catch(err=>console.log(err))
console.log("ok")

//  module.exports= transform1