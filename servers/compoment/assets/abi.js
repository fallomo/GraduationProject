let OrderAbi=
[
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

let UserToConTractAbi =
[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "GetMyContractAddress",
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
				"internalType": "address",
				"name": "useraddress",
				"type": "address"
			}
		],
		"name": "GetUserContractAddress",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "contractaddress",
				"type": "uint256"
			}
		],
		"name": "SetMyContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "useraddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "contractaddress",
				"type": "uint256"
			}
		],
		"name": "SetMyContractHard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

let UserPageAbi =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "orderaddress",
				"type": "address"
			}
		],
		"name": "AddOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetOrderList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetUrgency",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "mailaddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			}
		],
		"name": "SetInformation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
module.exports={OrderAbi,UserToConTractAbi,UserPageAbi}