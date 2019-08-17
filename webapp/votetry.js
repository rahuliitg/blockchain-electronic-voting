
Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
var version = web3.version.api;
// web3.eth.getAccounts().then(e => console.log(e));

// console.log("version " + version); // "0.2.0"
// var account;
web3.eth.getAccounts().then((f) => {
    //console.log(f);
    account = f[1];
    const fs = require('fs');
    let rawdata = fs.readFileSync('/home/mitanshu/projects/ElectionVoting/build/contracts/Voting.json');
    let votingJson = JSON.parse(rawdata);
    var abi = votingJson.abi;
    // contract = new web3.eth.Contract(abi);
    contract = TruffleContract(votingJson);
    contract.options.address = "0x7D1Dfe3DDE4637d40B93E864c114Ee070a2E482D";
    contract.methods.addCandidate("Guwahati","sfdsdfs",16012454530).send({from:account}).then((f) => {
        console.log(f);
    })
    contract.methods.constituencyCount().call().then((f) => {
         console.log(f);
    })
})

// // contract.methods.candidateCount().call().then((f) => {
// //     console.log(f);
// // })

