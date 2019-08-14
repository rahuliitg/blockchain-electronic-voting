Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
    account = f[0];
    console.log(account);
    const fs = require('fs');
    let rawdata = fs.readFileSync('/home/mitanshu/projects/ElectionVoting/build/contracts/Voting.json');
    let votingJson = JSON.parse(rawdata);
    var abi = votingJson.abi;
    contract = new web3.eth.Contract(abi);
    contract.options.address = "0xf7b4876Fc97f53868F1982336998a1341d82b65C";
    contract.methods.addCandidate("Guwahati","sfdsdfs",16012454530).send({from:account}).then((f) => {
        console.log(f);
    })
    
})

// contract.methods.candidateCount().call().then((f) => {
//     console.log(f);
// })

