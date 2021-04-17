const { response } = require('express')
const express = require('express')
const app = express()
const port = 3000
const transform1 = require('./smartcontract/smart')
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCrossDomain);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/smart',async (req, res) => {
	let smartc = transform1()
	smartc.then(resp=>{res.send(resp);console.log(resp)})
  .catch(err=>{console.log(err)})
	
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})