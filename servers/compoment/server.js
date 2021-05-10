const { response } = require('express')
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded())
const port = 3000
const orderlistener = require('../Engercy')
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentixals','true');
  next();
};
app.use(allowCrossDomain);
orderlistener()
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

const succ = {status:1}

app.post('/api/AddPosition',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.addPosition(req.body.latitude,req.body.longitude).encodeABI())
  .then(res.send(succ))
  console.log('AddPosition')
})
app.post('/api/JudgeOut',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.JudgeOut(req.body.startlat,req.body.startlng,req.body.endlat,req.body.endlng,req.body.poilat,req.body.poilng).encodeABI())
  .then(res.send(succ))
  console.log('JudgeOut')
})
app.post('/api/NewOrder',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.NewOrder().encodeABI())
  .then(res.send(succ))
  console.log('NewOrder')
})

app.post('/api/Starting',async (req, res) => {
	tool.sendMethods(account1,privateKey1,orderaddress,order.methods.Starting([req.body.startlat,req.body.startlng],[req.body.endlat,req.body.endlng]).encodeABI())
  .then(res.send(succ))
  console.log('Staring')
})
app.get('/api/GetAllMessage',async (req, res) => {
	order.methods.getAllMessage().call((err,resp)=>{
    console.log(resp)
    res.send(resp)
  })
  console.log('GetAllMessage')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)  
})

// let judge = order.methods.JudgeOut(113374599,23047508,113374796,23047908,113381323,23051234).encodeABI();
// tool.sendMethods(account1,privateKey1,orderaddress,judge);
