/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        console.log("c1");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    

    onDeviceReady: function() {
        QRScanner.prepare(onDone); // show the prompt
 
        function onDone(err, status){
          if (err) {
           // here we can handle errors and clean up any loose ends.
           console.error(err);
          }
          if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            // QRscanner.show() should feel very fast.
          } else if (status.denied) {
           // The video preview will remain black, and scanning is disabled. We can
           // try to ask the user to change their mind, but we'll have to send them
           // to their device settings with `QRScanner.openSettings()`.
          } else {
            // we didn't get permission, but we didn't get permanently denied. (On
            // Android, a denial isn't permanent unless the user checks the "Don't
            // ask again" box.) We can ask again at the next relevant opportunity.
          }
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();























// console.log("sgkljsdhjgsidfhsihff");
// alert("hii");
// //this.receivedEvent('deviceready');
// const fs = require('fs');
// alert("fddjhfjdhf");
// const HDWalletProvider = require('truffle-hdwallet-provider');
// alert("djdhf");        
// const provider =  new HDWalletProvider(fs.readFileSync('c:\\Users\\Ashish Ranjan\\Desktop\\blockchain-electronic-voting-master\\try1.env', 'utf-8'), "https://electioncomm.blockchain.azure.com:3200/Do6qs-JCQSH7Xtp71F2rjpsb");
// alert("hii2");
// Web3 = require('web3');
// alert("h3");

// // const HDWalletProvider = require('truffle-hdwallet-provider');
// // const fs = require('fs');
// // const provider =  new HDWalletProvider(fs.readFileSync('c:\\Users\\Ashish Ranjan\\Desktop\\blockchain-electronic-voting-master\\try1.env', 'utf-8'), "https://electioncomm.blockchain.azure.com:3200/Do6qs-JCQSH7Xtp71F2rjpsb");
// // alert("hii2");
// // var provider = new Web3.providers.HttpProvider("http://localhost:8545");
// var contract = require('truffle-contract');
// const web3 = new Web3(provider); 
// var json = JSON.parse(fs.readFileSync('c:\\Users\\Ashish Ranjan\\Desktop\\blockchain-electronic-voting-master\\build\\contracts\\Voting.json'));
// var MyContract = contract(json);
// MyContract.setProvider(provider);

// var deployed;
// var account;
// web3.eth.getAccounts().then((f) => {
// account = f[0];
// MyContract.deployed().then(function(instance) {
//     deployed = instance;
// }).then(function(result) {
//     console.log("success");
//     deployed.addCandidate("Guwahati","rahul",1234,{from:account}).then(function(f){
//     console.log(f);
//     deployed.candidateCount().then(function(f){
//         console.log(f);
//     })
//     })
//     // console.log(deployed.candidateCount());
// });
// });