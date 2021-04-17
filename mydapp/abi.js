let abi=
[
	{
		"constant": true,
		"inputs": [
			{
				"name": "a",
				"type": "string"
			},
			{
				"name": "b",
				"type": "string"
			}
		],
		"name": "JudgeString",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "NewOrder",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "Length",
				"type": "uint256"
			}
		],
		"name": "RandomNum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getPosition",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			},
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "string"
			},
			{
				"name": "_to",
				"type": "string"
			}
		],
		"name": "Starting",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "latitude",
				"type": "uint256"
			},
			{
				"name": "langitude",
				"type": "uint256"
			}
		],
		"name": "addPosition",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "OrderIndentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "OrderCreatedTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "OrderStatus",
				"type": "string"
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
				"name": "OrderIndentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "CurrentLocation",
				"type": "string"
			},
			{
				"indexed": false,
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
				"name": "latitude",
				"type": "uint256[]"
			},
			{
				"indexed": false,
				"name": "langitude",
				"type": "uint256[]"
			}
		],
		"name": "GetPosition",
		"type": "event"
	}
]

module.exports=abi