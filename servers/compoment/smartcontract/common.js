var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
	if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        wsweb3=new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/18520ccfd2e848bea8e5b2431b64308c"));  //WebsocketProvider
        console.log("costum provider")
    } else {
   		web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/18520ccfd2e848bea8e5b2431b64308c")); //Httpprovider
		wsweb3=new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/18520ccfd2e848bea8e5b2431b64308c"));  //WebsocketProvider
        console.log("default provider")
     }

function getHttpContract(abi,address){
    return new web3.eth.Contract(abi,address)
} 

function getWsContract(abi,address){
    return new wsweb3.eth.Contract(abi,address)
} 

function sendTransaction(account,privateKey,address,data,value=0){
    let dat ;
    if(typeof data =="string" || typeof data =="number")
         dat = Buffer.from(data)
    else dat = data;
	return new Promise((resolve, reject)=>{
		web3.eth.getTransactionCount(account,"pending", (err, txCount) => {

			// 创建交易对象
			const txObject = {
			  nonce:    web3.utils.toHex(txCount),
			  gasLimit: web3.utils.toHex(80000000),
			  gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
			  to: address,
			  data: dat,
              value:web3.utils.toHex(web3.utils.toWei(value.toString(), 'gwei'))
			}
		  
			// 签署交易
			const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
			tx.sign(privateKey)
		  
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
        function sendMethods(account,privateKey,address,method){
            return new Promise((resolve, reject)=>{
                web3.eth.getTransactionCount(account,"pending", (err, txCount) => {
        
                    // 创建交易对象
                    const txObject = {
                      nonce:    web3.utils.toHex(txCount),
                      gasLimit: web3.utils.toHex(8000000),
                      gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
                      to: address,
                      data: method
                    }
                    // 签署交易
                    const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
                    tx.sign(privateKey)
                    const serializedTx = tx.serialize()
                    const raw = '0x' + serializedTx.toString('hex')
                    // 广播交易
                    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                      console.log('txHash:', txHash)
                      if(!err) resolve(txHash)
                      else reject(err);
                    })
                  }).catch()
                }
                  )}

module.exports={sendTransaction,sendMethods,getHttpContract,getWsContract,web3,wsweb3};