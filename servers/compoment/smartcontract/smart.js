var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
	if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        console.log("1")
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/18520ccfd2e848bea8e5b2431b64308c"));
        console.log("2")
     }
    web3.eth.defaultAccount = web3.eth.accounts[0];

const abi = require('../assets/abi')
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

const address = '0xFf1b9c0cb249DE1bffCA13B690Ad1D896834a82B'

const contract = new web3.eth.Contract(abi, address)
const account1 = '0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e';
const pk1='2e4ee773a8e1bbba0e30896e758ea003b53991999d310434e07171abb8b11a31' 
const privateKey1 = Buffer.from(pk1, 'hex')
web3.eth.getBalance("0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e", (err, wei) => {
balance = web3.utils.fromWei(wei, 'ether')
console.log("balance: " + balance)
})

// CryptoZombies.methods.createRandomZombie("Vitalik Nakamoto")
function transform1() {  
	return new Promise((resolve, reject)=>{
		web3.eth.getTransactionCount(account1,"pending",(err, txCount) => {
			// 创建交易对象
			console.log(txCount)
			const txObject = {
			  nonce:    web3.utils.toHex(txCount),
			  gasLimit: web3.utils.toHex(77180),
			  gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
			  to: address,
			  data: contract.methods.addPosition(322,124).encodeABI()
			}
			
			// 签署交易
			const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
			tx.sign(privateKey1)
			
			const serializedTx = tx.serialize()
			const raw = '0x' + serializedTx.toString('hex')
			
			// 广播交易
			web3.eth.sendSignedTransaction(raw, (err, txHash) => {
			  console.log('txHash:', txHash)
			  // 可以去ropsten.etherscan.io查看交易详情
			})
			}).then(console.log("oversending"))
			let result = 0;
				contract.methods.getPosition().call((err, res) => { 
					if(res)
					{
					result =res
					resolve(result)
					}
					else reject(err)
				})
    })

}

// let test = transform1()
// test.then(res=>{console.log(res);})
// .catch(err=>{console.log(err)})


 module.exports= transform1