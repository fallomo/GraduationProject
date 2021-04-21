const account = require('./compoment/assets/Account')
const abi = require('./compoment/assets/Abi')
const Address = require('./compoment/assets/Address')
let tool = require('./compoment/smartcontract/common')
let orderaddress = Address.orderaddress;

let order = tool.getHttpContract(abi.OrderAbi,orderaddress);
let account1 = account.account1;
let privateKey1 = account.privateKey1;
