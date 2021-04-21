const { response } = require('express')
const express = require('express')
const app = express()
const port = 3000
const orderlistener = require('../Engercy')
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCrossDomain);

const account = require('../compoment/assets/Account')
const abi = require('../compoment/assets/Abi')
const Address = require('../compoment/assets/Address')
let tool = require('../compoment/smartcontract/common')
let orderaddress = Address.OrderAddress;
let order = tool.getHttpContract(abi.OrderAbi,orderaddress);
let account1 = account.account1;
let privateKey1 = account.privateKey1;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/AddPosition',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.addPosition(req.juery.latitude,req.juery.longitude).encodeABI())
  .then(res.send(1))
  .catch(res.send(0))
})
app.post('/JudgeOut',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.JudgeOut(req.juery.startlat,req.juery.startlng,req.juery.endlat,req.juery.endlng,req.juery.poilat,req.juery.poilng).encodeABI())
  .then(res.send(1))
  .catch(res.send(0))
})
app.post('/NewOrder',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.NewOrder().encodeABI())
  .then(res.send(1))
  .catch(res.send(0))
})

app.post('/Starting',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.Starting([req.juery.startlat,req.juery.startlng],[req.juery.endlat,req.juery.endlng]).encodeABI())
  .then(res.send(1))
  .catch(res.send(0))
})
app.get('/GetAllMessage',async (req, res) => {
	order.methods.getAllMessage().call((err,resp)=>{
    console.log(resp)
    res.send(resp)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// let judge = order.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI();
// tool.sendMethods(account1,privateKey1,orderaddress,judge);
