Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[1];
 console.log(account)
})

var text = '{ "name":"John", "birth":"1986-12-14", "city":"New York"}';

var obj = JSON.parse(text);

var request = new XMLHttpRequest();
request.open("GET", "build/contracts/Voting.json", false);
request.send(null)
var my_JSON_object = JSON.parse(request.responseText);
