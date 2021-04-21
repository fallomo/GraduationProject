var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/08c765c31c264e60be1253c6492c6245')
const account = require('../assets/Account')

const account1 = '0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e' // Your account address 1
const account2 = '0xff96B8B43ECd6C49805747F94747bFfa3A960b69' // Your account address 2

const pk1 = '2e4ee773a8e1bbba0e30896e758ea003b53991999d310434e07171abb8b11a31' // 实际项目中应该从process.env.PRIVATE_KEY_1中读取
const pk2 = 'ac0adfdbaeb0770a479e79aac78779d82fdc2f9262e0c8f751ae70fb63ef6196' // 实际项目中应该从process.env.PRIVATE_KEY_2中读取

const privateKey1 = Buffer.from(pk1, 'hex')
const privateKey2 = Buffer.from(pk2, 'hex')

// 读取已部署的契约 -- 从Etherscan获取地址
const contractAddress = '0x30951343d6d80d2c94897f1a81c53cc030aef879'
const contractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
]

const contract = new web3.eth.Contract(contractABI, contractAddress)

web3.eth.getTransactionCount(account1, (err, txCount) => {

  // 创建交易对象
  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    to: contractAddress,
    data: contract.methods.set("test4").encodeABI()
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
  .on('receipt', function(receipt){
    console.log(receipt)
})

})
