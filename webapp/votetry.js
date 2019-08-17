// Web3 = require('web3');
// web3 = new Web3(new Web3.providers.HttpProvider("https://electioncomm.blockchain.azure.com:3200/Do6qs-JCQSH7Xtp71F2rjpsb"))
// var account;
// //web3.personal.unlockAccount(web3.personal.listAccounts[0],"blockIITG@123", 15000);
// // web3.eth.getAccounts().then((f) => {
// //     account = f[0];
// //     console.log(account);
//     //web3.personal.unlockAccount(account,"blockIITG@123", 15000);
//     const fs = require('fs');
//    var abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"machineToBooth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"constituencyList","outputs":[{"name":"name","type":"string"},{"name":"id","type":"uint256"},{"name":"doesExist","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"officerCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"constituencyCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"boothCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"votersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"candidateCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"boothList","outputs":[{"name":"boothAddress","type":"string"},{"name":"id","type":"uint256"},{"name":"constituencyId","type":"uint256"},{"name":"doesExist","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"boothAddress","type":"string"},{"name":"constituencyId","type":"uint256"}],"name":"addBooth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"boothId","type":"uint256[]"}],"name":"addConstituency","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"aadharId","type":"uint256"},{"name":"boothId","type":"uint256"}],"name":"addOfficer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"constituencyName","type":"string"},{"name":"name","type":"string"},{"name":"aadharId","type":"uint256"}],"name":"addCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"constituencyName","type":"string"},{"name":"boothId","type":"uint256"},{"name":"name","type":"string"},{"name":"aadharId","type":"uint256"}],"name":"addVoter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"candidateId","type":"uint256"},{"name":"aadharId","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"boothId","type":"uint256"},{"name":"constituencyId","type":"uint256"},{"name":"aadharId","type":"uint256"}],"name":"verifyToVote","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"aadharId","type":"uint256"}],"name":"verifyOfficer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"constituencyId","type":"uint256"}],"name":"results","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
//    console.log("asdasdasdaSDsad"); 
//    contract = new web3.eth.Contract(abi);
//    console.log("asdasdasdaSDsad"); 

//     contract.options.address = "0xb255f55e8d600f09ebc1035dd2118acec1018912";
//    console.log("asdasdasdaSDsad"); 

// //     contract.methods.addCandidate("Guwahati","sfdsdfs",16012454530).send({from:account}).then((f) => {
// //    console.log("asdasdasdaSDsad"); 

// //         console.log(f);
// //     })
//     contract.methods.candidateCount().call().then((f) => {
//     console.log(f);
// // })
// // })


// // contract.methods.candidateCount().call().then((f) => {
// //     console.log(f);
// // })

// // var Voting = artifacts.require("Voting");

// // module.exports = function(done) {
// //   console.log("Getting the deployed version of the HelloBlockchain smart contract")
// //   var app;
// //   Voting.deployed().then(function(instance) {
// //       app = instance;
// //     console.log("Calling SendRequest function for contract ", instance.address);
// //     return instance.addCandidate("Guwahati","rahulgupta",11212);
// //   }).then(function(result) {
// //     console.log("Transaction hash: ", result.tx);
// //     console.log("Request complete");
// //     app.candidateCount().then(function(result){
// //         console.log(result);
// //         done();
// //     })
    
// //   }).catch(function(e) {
// //     console.log(e);
// //     done();
// //   });
// // };












Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const provider =  new HDWalletProvider(fs.readFileSync('c:\\Users\\Ashish Ranjan\\Desktop\\blockchain-electronic-voting-master\\try1.env', 'utf-8'), "https://electioncomm.blockchain.azure.com:3200/Do6qs-JCQSH7Xtp71F2rjpsb");

// var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
const web3 = new Web3(provider); 
var json = JSON.parse(fs.readFileSync('c:\\Users\\Ashish Ranjan\\Desktop\\blockchain-electronic-voting-master\\build\\contracts\\Voting.json'));
var MyContract = contract(json);
MyContract.setProvider(provider);

var deployed;
var account;
web3.eth.getAccounts().then((f) => {
  account = f[0];
  MyContract.deployed().then(function(instance) {
    deployed = instance;
  }).then(function(result) {
    console.log("success");
    deployed.addCandidate("Guwahati","rahul",1234,{from:account}).then(function(f){
      console.log(f);
      deployed.candidateCount().then(function(f){
        console.log(f);
      })
    })
    // console.log(deployed.candidateCount());
  });
});


