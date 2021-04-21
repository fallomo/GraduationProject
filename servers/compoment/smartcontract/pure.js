var Tx     = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/18520ccfd2e848bea8e5b2431b64308c')

const account1 = '0x4BCA8987e713b882553b5eAD3d1CF85afBDF001e' // Your account address 1

const pk1 = '2e4ee773a8e1bbba0e30896e758ea003b53991999d310434e07171abb8b11a31' // 实际项目中应该从process.env.PRIVATE_KEY_1中读取


const privateKey1 = Buffer.from(pk1, 'hex')

// 读取已部署的契约 -- 从Etherscan获取地址
const contractAddress = '0x59773f19cA1d12cD5695932D48A59B21BB8D4Abe'
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "OrderIndentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "OrderCreatedTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "OrderStatus",
				"type": "uint16"
			}
		],
		"name": "Created",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "OrderIndentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "OrderTime",
				"type": "uint256"
			}
		],
		"name": "Done",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "latitude",
				"type": "uint256[]"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "Longitude",
				"type": "uint256[]"
			}
		],
		"name": "GetPosition",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endlat",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endlng",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "poilat",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "poilng",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "distance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "Manager",
				"type": "address"
			}
		],
		"name": "RouteOut",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "latitude",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "longitude",
				"type": "uint256"
			}
		],
		"name": "addPosition",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Arrival",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CancalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startlat",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startlng",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endlat",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endlng",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poilat",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poilng",
				"type": "uint256"
			}
		],
		"name": "JudgeOut",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "NewOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[2]",
				"name": "_from",
				"type": "uint256[2]"
			},
			{
				"internalType": "uint256[2]",
				"name": "_to",
				"type": "uint256[2]"
			}
		],
		"name": "Starting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "CalcTest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllMessage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			},
			{
				"internalType": "uint256[2]",
				"name": "",
				"type": "uint256[2]"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256[2]",
				"name": "",
				"type": "uint256[2]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getErrorReport",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "startlat",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "startlng",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endlat",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endlng",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "poilat",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "poilng",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "errorTime",
						"type": "uint256"
					}
				],
				"internalType": "struct Order.ErrorReport[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPosition",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

console.log(contractAddress);
const contract = new web3.eth.Contract(contractABI, contractAddress)

web3.eth.getTransactionCount(account1, (err, txCount) => {

  // 创建交易对象
  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
    to: contractAddress,
    data: contract.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI()
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
  })//
})

contract.methods.getAllMessage().call((err,res)=>{console.log(res)})

// // 读取val值
// contract.methods.get().call((err, val) => {
//   console.log({ err, val })
// })
