var constiName;
var boothId;
var voterName;
var aadharId;
var pincode;
var yob;
var json;
var officerConstituencyId;
var officerBoothId;
provider = new Web3.providers.HttpProvider('https://rahul.blockchain.azure.com:3200/z_-OS0Fjm8ArG7BO_9eIY4Ye');
web3 = new Web3(provider);

// $(document).ready(function(e) {
//   $.getJSON( "js\\Voting.json" , function( result ){
//       json = (result);
//   });
// })
// var MyContract = TruffleContract(json);
// MyContract.setProvider(provider);
// console.log(MyContract);

// /var path = OS.Path.join(__dirname,"votery.js")
var MyContract;
var Election;
var account;
var accounts;
$(document).ready(function(e) {
  // console.log(__dirname);
  console.log("path");
  $.getJSON( "js/Voting2.json" , function( result ){
    json=result;
    MyContract = TruffleContract(json);
    console.log("contract " + MyContract);
    MyContract.setProvider(provider);
    Election;
    account;
    var constCount=0;
    accounts = web3.eth.getAccounts((error,result) => {
      if (error) {
          console.log(error);
      } else {
          web3.personal.unlockAccount(result[0],"Rahulgupta@12345", 15000);
          account = result[0];
          console.log(account);
      }
    });

    MyContract.deployed().then(function(instance) {
        Election = instance;
        return Election.constituencyCount();
      }).then(function(constCount){
        // var select = document.getElementById("candidateConstituency");
        // // Election.constituencyToBooth(1,0).then(function(f){
        // //   alert(f);
        // //   // var option = document.createElement("option");
        // //   // option.text = f[0];
        // //   // var select = document.getElementById("boothList");
        // //   // select.appendChild(option);
        // // }).catch(error=>{
        // //   alert("sd");
        // //   alert(error);
        // var x = "121212";
        // Election.addCandidate("Guwahati","gahul",x, {from:account, gas:3000000}).then(function(f){
        //   alert("success candidate add .. redirect to home page");
          // Election.candidateCount().then(function(f){console.log(f)});
        // }).catch(error => {console.log(error)});
        // //})
        // // var x = "301001";
        // // Election.pinToConstituency(x).then(function(f){
        // //   alert("hola peeps");
        // //   alert(f[0]);
        // // })
        // var aadharId = "910611041461";
        // Election.officersList(910611041461).then(function(f){
        //   console.log(f);
        // }).catch(error => {
        //   console.log(error);
        // });
        Election.boothList(1).then(function(f){console.log(f)}).catch(error=>{console.log(error)});
        for(i = 1 ;i <= constCount; i++){
          Election.constituencyList(i).then(function(f){
            var select  = document.getElementById("candidateConstituency");
            var option = document.createElement("option");
            option.value = f[1];
            option.text = f[0];
            select.appendChild(option);
          })
        }
      
    })
  })
})


function gotoAddVoterPage(){
  (document.getElementsByClassName("introPage")[0]).style.display = "none";
  (document.getElementById("id01")).style.display = "block";
  
}

function voterAdd(){
  voterName = document.getElementById("voterName").value;
  aadharId = document.getElementById("voterAadhar").value;
  constiName = document.getElementById("constituency").value;
  boothId = document.getElementById("boothList").value;
  alert(boothId);
  alert(voterName);
  Election.addVoter(constiName, boothId, voterName, aadharId, {from:account, gas:3000000}).then(function(f){
    alert("Voter added successfully... redirect to home page");
    (document.getElementsByClassName("introPage")[0]).style.display = "block";
    (document.getElementById("id01")).style.display = "none";
    document.getElementById("voterName").value = "";
    document.getElementById("voterAadhar").value = "";
    document.getElementById("constituency").value = "";
    document.getElementById("boothList").innerHTML = "";
  }).catch(error=>{
    alert(error);
  })
}

function voterScan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
                        var value = result.text;
                        value = value.split("\"");
                        aadharId = value[5];
                        name = value[7];
                        yob = value[11];
                        for(var i=value.length-1;i>=0;--i){
                            if(value[i]==" pc="){
                                pincode = value[i+1];
                                break;
                            }
                        }
                        alert(aadharId);alert(name);alert(yob);alert(pincode);alert(parseInt(pincode));
                        // alert(Election.address);
                        Election.pinToConstituency(pincode).then(function(f){
                          alert("hola peeps");
                          alert(f[0]);
                          // alert(f[1]);
                          // alert(f[2]);
                          document.getElementById("voterName").value = name;
                          document.getElementById("voterAadhar").value = aadharId;
                          document.getElementById("constituency").value = f[0];
                          loadBoothList(f[1],f[2]);
                        }).catch(error=>{
                          alert(error);
                          alert("hoa peeps error");
                        })
                }
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
  );
}

function loadBoothList(id,boothCount){
  // var boothCount = x.options[x.selectedIndex].getAttribute('boothcount');
  // constiName = x.options[x.selectedIndex].innerText;
  // console.log(Election.address);
  document.getElementById("boothList").innerHTML = "";
  var option = document.createElement("option");
  option.text = "None";
  var select = document.getElementById("boothList");
  select.appendChild(option);

  for(i = 1; i<=boothCount; i++){
    Election.constituencyToBooth(parseInt(id),i-1).then(function(f){
      alert(f);
      var option = document.createElement("option");
      option.text = f[0];
      option.value = f[1];
      var select = document.getElementById("boothList");
      select.appendChild(option);
    }).catch(error=>{
      alert("sd");
      alert(error);
    })
  }
}

function showOfficerPage(){
  (document.getElementsByClassName("introPage")[0]).style.display = "none";
  (document.getElementById("id02")).style.display = "block";
}

function officerScan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
                        var value = result.text;
                        value = value.split("\"");
                        var aadharId = value[5];
                        var name = value[7];
                        document.getElementById("officerName").value = name;
                        document.getElementById("officerAadhar").value = aadharId;
                        alert("dsfs");
                        alert(Election.address);
                        alert(aadharId);
                        Election.officersList(aadharId).then(function(f){
                          alert("aadd");
                          alert(f[3]);
                          var boothId = f[3];
                          var boothName;
                          var constituencyId;
                          var constituencyName;
                          Election.boothList(parseInt(boothId)).then(function(f){
                            alert("boo");
                            alert(f[0]);
                            alert(f[2]);
                            boothName = f[0];
                            constituencyId = f[2];
                            officerConstituencyId = f[2];
                            officerBoothId = f[3];
                            document.getElementById("officerBooth").value = boothName;
                            Election.constituencyList(parseInt(constituencyId)).then(function(f){
                              alert(f[0]);
                              constituencyName = f[0];
                              document.getElementById("officerConstituency").value = constituencyName;
                            }).catch(error=>{
                                alert(error);
                              })
                            }).catch(error=>{
                              alert("booth");
                              alert(error);
                            })
                        }).catch(error=>{
                          alert(error);
                        })
                }
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
  );
}

function gotoAddCandidatePage(){
  (document.getElementsByClassName("introPage")[0]).style.display = "none";
  (document.getElementById("id03")).style.display = "block";
}

function candidateAdd(x){
  var candName = document.getElementById("candidateName").value;
  var candAadhar = document.getElementById("candidateAadhar").value;
  var x = document.getElementById("candidateConstituency");
  var candConstituency = x.options[x.selectedIndex].text;
  alert(candConstituency);
  alert(candAadhar);
  alert(candName);
  Election.addCandidate(candConstituency,candName,parseInt(candAadhar), {from:account, gas:30000000}).then(function(f){
    alert("success candidate add .. redirect to home page");
    // Election.candidateCount().then(function(f){
    //   alert(f);
      (document.getElementsByClassName("introPage")[0]).style.display = "block";
      (document.getElementById("id03")).style.display = "none"; 
      document.getElementById("candidateName").value = "";   
      document.getElementById("candidateAadhar").value = "";   
      document.getElementById("candidateConstituency").value = "";  
    // })
     
  }).catch(error=>{
    alert(error);
  })
}

function showVotingPage(){
  var candidateCount;
  document.getElementById("votingPage").style.display = "block";
  document.getElementById("id02").style.display = "none";
  document.getElementById("constDetails").innerHTML = "constituency: "+document.getElementById("officeConstituency").innerHTML;
  document.getElementById("boothDetails").innerHTML = "booth: "+document.getElementById("officeBooth").innerHTML;
  Election.constituencyList(officerConstituencyId).then(function(f){
    candidateCount = f[4];
    for(i = 0; i< candidateCount; i++){
      var select = document.getElementById("candidateList");
      Election.constituencyToCandidate(officerConstituencyId, i).then(function(f){
        var option = document.createElement("option");
        option.value = f[1];
        option.text = f[0];
        option.setAttribute("candId", f[4]);
        select.appendChild(option);
      })
    }
  })
}


var currVoterName;
var currVoterAadhar;
function scanToVote(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
        if(!result.cancelled)
        {
            if(result.format == "QR_CODE")
            {
                    var value = result.text;
                    value = value.split("\"");
                    var aadharId = value[5];
                    var name = value[7];
                    currVoterName = name;
                    currVoterAadhar = aadharId;
                    Election.verifyToVote(officerBoothId, aadharId).then(function(f){
                      castVotePage();
                    }).catch(error=>{
                      alert("you are not allowed to vote on this booth");
                    })
            }
        }
    },
    function (error) {
        alert("Scanning failed: " + error);
    }
  )}


  function castVotePage(){
    document.getElementById("votingPage").style.display = "none";
    document.getElementById("castVotePage").style.display = "block";
    document.getElementById("constDetails2").innerHTML = "constituency: "+document.getElementById("officeConstituency").innerHTML;
    document.getElementById("boothDetails2").innerHTML = "booth: "+document.getElementById("officeBooth").innerHTML;
    document.getElementById("nameOfVoter").innerHTML = "Voter Name : "+ currVoterName;
    document.getElementById("aadharOfVoter").innerHTML = "Voter Aadhar : "+ currVoterAadhar;
    
  }

  function castVote(){
    var x = document.getElementById("candidateList");
    var candidateId = x.options[x.selectedIndex].candId;
    var candidateAadharId = x.options[x.selectedIndex].value;
    Election.vote(candidateId, candidateAadharId, {from:account, gas:30000000}).then(function(f){
      alert("You Voted for: "+x.options[x.selectedIndex].text);
      document.getElementById("votingPage").style.display = "block";
      document.getElementById("castVotePage").style.display = "none";
      document.getElementById("constDetails2").innerHTML = "";
      document.getElementById("boothDetails2").innerHTML = "";
      document.getElementById("nameOfVoter").innerHTML = "";
      document.getElementById("aadharOfVoter").innerHTML = "";
    }).catch(error=>{
      alert("Error in Voting... Please try again");
    })
  }