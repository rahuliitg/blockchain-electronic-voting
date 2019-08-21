
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
var MyContract;
var Election;
var account;
var accounts;
$(document).ready(function(e) {
  console.log("path");
  $.getJSON( "js/Voting.json" , function( result ){
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
          document.getElementById("beforeLoading").style.display = "none";
          document.getElementById("mainApp").style.display = "block";
      }
    });

    MyContract.deployed().then(function(instance) {
        Election = instance;
        return Election.constituencyCount();
      }).then(function(constCount){
        // alert("adasd");
        Election.verifyOfficer(732449600739,{from:account,gas:30000000}).then(function(f){
          console.log(f);
        });
        // Election.verifyToVote(1, 575848571904,{from:account, gas:30000000}).then(function(f){
        //   console.log(f);
        // });
          for(i = 1 ;i <= constCount; i++){
            Election.constituencyList(i).then(function(f){
              var select1  = document.getElementById("candidateConstituency");
              var option = document.createElement("option");
              var select2  = document.getElementById("resConstituencyList");
              var option2 = document.createElement("option");
              option.value = f[1];
              option.text = f[0];
              option2.value = f[1];
              option2.text = f[0];
              select1.appendChild(option);
              select2.appendChild(option2);
            }).catch(error=>{
              alert(error);
            });
        }
        // Election.verifyOfficer(732449600739, {from:account,gas:30000000}).then(function(f){
        //   console.log(f);
        //   Election.verifyToVote(1, 575848571904,{from:account, gas:30000000}).then(function(f){
        //     console.log(account);
        //     console.log(f);
        //     f = parseInt(f);
        //     if(f==1)
        //       alert("Invalid State");
        //     if(f==2)
        //       alert("Invalid booth")
        //     if(f==3)
        //       alert("Action should be done at different Constituency or booth")
        //     if(f==4)
        //       alert("Voter not added to the voters list!");
        //     if(f==5)
        //       alert("Voter does not belong to this booth ");                      
        //     if(f==0){
        //       castVotePage(); 
        //     }
        //   }).catch(error=>{
        //     alert(error);
        //     alert("you are not allowed to vote on this booth");
        //   })
        // }).catch(error=>{
        //   alert(error);
        // });
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
  //alert(voterName);
  if(voterName == "" || boothId ==""){
    alert("Scan Voter aadhar card to proceed")
  }
  else{
    var a = document.getElementById("voterSubmit");
    a.innerHTML = "";
    var i = document.createElement('i');
    i.setAttribute("class", "fa fa-spinner fa-spin");
    i.style.marginLeft = "20%";
    i.style.fontSize = "40px";
    a.append(i);
    Election.addVoter(constiName, parseInt(boothId), voterName, parseInt(aadharId), {from:account, gas:3000000}).then(function(f){
      document.getElementById("voterSubmit").innerHTML = "Submit";
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
                        Election.pinToConstituency(pincode).then(function(f){
                          if(f[3]=="False" || f[3]=="false")
                            alert("Pincode not recognised by a constituency");
                          document.getElementById("voterName").value = name;
                          document.getElementById("voterAadhar").value = aadharId;
                          document.getElementById("constituency").value = f[0];
                          var d = new Date();
                          var n = d.getFullYear();
                          if(n-yob<18){
                            alert("Your age is less!");
                          }
                          else {
                            loadBoothList(f[1],f[2]);
                          }
                        }).catch(error=>{
                            alert(error);
                          })
                }
            }
        },
        function (error) {
            // alert("Scanning failed: " + error);
        }
  );
}

function loadBoothList(id,boothCount){
  document.getElementById("boothList").innerHTML = "";
  var option = document.createElement("option");
  option.text = "None";
  var select = document.getElementById("boothList");
  select.appendChild(option);

  for(i = 1; i<=boothCount; i++){
    Election.constituencyToBooth(parseInt(id),i-1).then(function(f){
      var option = document.createElement("option");
      option.text = f[0];
      option.value = f[1];
      var select = document.getElementById("boothList");
      select.appendChild(option);
    }).catch(error=>{
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
                        
                        Election.verifyOfficer(parseInt(aadharId), {from:account,gas:30000000}).then(function(f){
                          
                        //alert("fi");
                        
                          f = parseInt(f);
                          //alert(f);
                          if(f==1){
                            alert("Voting has not started");
                          }
                          if(f==2){
                            alert("Not an authorized officer");
                          }
                          if(f==0){
                            Election.officersList(parseInt(aadharId)).then(function(f){
                              var boothId = f[3];
                              var boothName;
                              var constituencyId;
                              var constituencyName;
                              Election.boothList(parseInt(boothId)).then(function(f){
                                boothName = f[0];
                                constituencyId = f[2];
                                officerConstituencyId = f[2];
                                officerBoothId = f[1];
                                document.getElementById("officerName").value = name;
                                document.getElementById("officerAadhar").value = aadharId;
                                document.getElementById("officerBooth").value = boothName;
                                Election.constituencyList(parseInt(constituencyId)).then(function(f){
                                  constituencyName = f[0];
                                  document.getElementById("officerConstituency").value = constituencyName;
                                  }).catch(error=>{
                                    alert(error);
                                  })
                                }).catch(error=>{
                                    alert(error);
                                  })
                                }).catch(error=>{
                                  alert(error);
                                }) 
                          }
                        }).catch(error=>{
                          alert(error);
                        })
                }
            }
        },
        function (error) {
            // alert("Scanning failed: " + error);
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
  if(candName == "" || candAadhar =="" || candConstituency == "" || candConstituency == "None"){
    alert("Fill all details of candidate properly");
  }
  else{
    var a = document.getElementById("candidateSubmit");
    a.innerHTML = "";
    var i = document.createElement('i');
    i.setAttribute("class", "fa fa-spinner fa-spin");
    i.style.marginLeft = "20%";
    i.style.fontSize = "40px";
    a.append(i);
    Election.addCandidate(candConstituency,candName,parseInt(candAadhar), {from:account, gas:30000000}).then(function(f){
      a.innerHTML = "Add Candidate";
      alert("success candidate add .. redirect to home page");
      // Election.candidateCount().then(function(f){
      //   alert(f);
        (document.getElementsByClassName("introPage")[0]).style.display = "block";
        (document.getElementById("id03")).style.display = "none"; 
        document.getElementById("candidateName").value = "";   
        document.getElementById("candidateAadhar").value = ""; 
      // })
      
    }).catch(error=>{
      alert(error);
    })
  }

}

function showVotingPage(){
  var x = document.getElementById("officerName").value;
  if(x == ""){
    alert("Scan officer's aadhar card to proceed");
  }
  else{
    var a = document.getElementById("officerSubmit");
    a.innerHTML = "";
    var i = document.createElement('i');
    i.setAttribute("class", "fa fa-spinner fa-spin");
    i.style.marginLeft = "20%";
    i.style.fontSize = "40px";
    a.append(i);
    Election.StartVoting({from:account,gas:30000000}).then(function(f)
    {
      a.innerHTML = "Submit";
      var candidateCount;
      document.getElementById("votingPage").style.display = "block";
      document.getElementById("id02").style.display = "none";
      document.getElementById("constDetails").innerHTML = "constituency: "+document.getElementById("officerConstituency").value;
      document.getElementById("boothDetails").innerHTML = "booth: "+document.getElementById("officerBooth").value;
      Election.constituencyList(parseInt(officerConstituencyId)).then(function(f){
        candidateCount = f[4];
        alert(candidateCount);
        alert(officerConstituencyId);
        for(i = 0; i< candidateCount; i++){
          var select = document.getElementById("candidateList");
          Election.constituencyToCandidate(parseInt(officerConstituencyId), i).then(function(f){
            Election.candidates(parseInt(f)).then(function(f){
              var option = document.createElement("option");
              option.value = f[1];
              option.text = f[0];
              option.setAttribute("candId", f[4]);
              select.appendChild(option);
            }).catch(error => {alert(error)});
          }).catch(error=>{alert(error)});
        }
      }).catch(error => {alert(error)});
    }).catch(error => {alert(error)});
  }
}


var currVoterName;
var currVoterAadhar;
var officerBoothId;
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
                    alert(officerBoothId);
                    Election.verifyToVote(parseInt(officerBoothId), parseInt(aadharId),{from:account, gas:30000000}).then(function(f){
                     // alert(f);
                      f = parseInt(f);
                      if(f==1)
                        alert("Invalid State");
                      if(f==2)
                        alert("Invalid booth")
                      if(f==3)
                        alert("Action should be done at different Constituency or booth")
                      if(f==4)
                        alert("Voter not added to the voters list!");
                      if(f==5)
                        alert("Voter does not belong to this booth ");                      
                      if(f==0){
                        castVotePage(); 
                      }
                    }).catch(error=>{
                      alert(error);
                      alert("you are not allowed to vote on this booth");
                    })
            }
        }
    },
    function (error) {
       // alert("Scanning failed: " + error);
    }
  )}


  function castVotePage(){
    document.getElementById("votingPage").style.display = "none";
    document.getElementById("castVotePage").style.display = "block";
    document.getElementById("constDetails2").innerHTML = "constituency: "+document.getElementById("officerConstituency").value;
    document.getElementById("boothDetails2").innerHTML = "booth: "+document.getElementById("officerBooth").value;
    document.getElementById("nameOfVoter").innerHTML = "Voter Name : "+ currVoterName;
    document.getElementById("aadharOfVoter").innerHTML = "Voter Aadhar : "+ currVoterAadhar;
  }

  function castVote(){
    var x = document.getElementById("candidateList");
    var candidateId = x.options[x.selectedIndex].candId;
    var a = x.options[x.selectedIndex].text;
    if(a == "Select Candidate" || a == ""){
      alert("select candidate");
    }
    else{
      Election.vote(parseInt(candidateId), parseInt(currVoterAadhar), {from:account, gas:30000000}).then(function(f){
        f = parseInt(f);
        alert(f);
        if(f==1)
          alert("Invalid State");
        if(f==2)
          alert("Invalid booth");
        if(f==3)
          alert("voter not registerd");
        if(f==4)
          alert("Already voted");
        if(f==0)
          alert("You Voted for: "+x.options[x.selectedIndex].text);
        document.getElementById("votingPage").style.display = "block";
        document.getElementById("castVotePage").style.display = "none";
        document.getElementById("constDetails2").innerHTML = "";
        document.getElementById("boothDetails2").innerHTML = "";
        document.getElementById("nameOfVoter").innerHTML = "";
        document.getElementById("aadharOfVoter").innerHTML = "";
      }).catch(error=>{
        alert(error);
        alert("Error in Voting... Please try again");
      });
    }
    
  }
 function showResultPage(){
  (document.getElementsByClassName("introPage")[0]).style.display = "none";
  (document.getElementById("resultPage")).style.display = "block";
  (document.getElementById("res01")).style.display = "block";
  (document.getElementById("res02")).style.display = "none";
  Election.changeState(3, {from:account,gas:30000000}).then(function(f){
    (document.getElementById("res01")).style.display = "none";
    (document.getElementById("res02")).style.display = "block";
  })
 }
 var result = [] ;
  function getResults(){
    var a = document.getElementById("str1ResultPage");
    a.innerHTML = "";
    var i = document.createElement('i');
    i.setAttribute("class", "fa fa-spinner fa-spin");
    i.style.marginLeft = "20%";
    i.style.fontSize = "40px";
    a.append(i);
      var x = document.getElementById("resConstituencyList");
      var constituencySelected = parseInt(x.options[x.selectedIndex].value);
      Election.constituencyList(parseInt(constituencySelected)).then(function(f){
          var candidateCount = parseInt(f[4]);
          for(i = 0; i< candidateCount; i++){
            Election.constituencyToCandidate(constituencySelected,i).then(function(f){
              Election.candidates(parseInt(f)).then(function(f){
                result.push({"x":f[0], "value":f[2]});
                if(result.length == (candidateCount)){
                  var temp = new Array(candidateCount);
                  for(j = 0; j < candidateCount; j++){
                    temp[j] = result[j];
                  }
                  anychart.onDocumentReady(function() {
                    // create the chart
                    var chart = anychart.pie();
                    // set the chart title
                     chart.title("Election results");
                    // add the data
                    chart.data(temp);
                    // display the chart in the container
                    chart.container('pieChart');
                    chart.draw();
                    var a = document.getElementById("str1ResultPage");
                    a.innerHTML = "";
                    a.innerHTML = "Generate Result"
                  });
                }
              }).catch(error => {alert(error)});
            }).catch(error => {alert(error)});
          }
          
      })
  }



  function gotoHome1(){
    document.getElementById("officerName").innerHTML = "";
    document.getElementById("officerAadhar").innerHTML = "";
    document.getElementById("officerConstituency").innerHTML = "";
    document.getElementById("officerBooth").innerHTML = "";
    document.getElementById("id02").style.display = "none"; 
   (document.getElementsByClassName("introPage")[0]).style.display = "block";
  }

  function gotoHome2(){
    document.getElementById("candidateName").innerHTML = "";
    document.getElementById("candidateAadhar").innerHTML = "";
    document.getElementById("id03").style.display = "none"; 
   (document.getElementsByClassName("introPage")[0]).style.display = "block";
  }

  function startVoting(){
    
    Election.StartVoting({from:account,gas:30000000}).then(function(f)
    {
      document.getElementById("startVotingMsg").innerHTML = "Voting Started";
    });
  }

  function finishVoting(){
    
    Election.finishVoting({from:account,gas:30000000}).then(function(f){
      document.getElementById("finishVotingMsg").innerHTML = "Voting Finished";
    });
  }

  function gotoHome3(){
    document.getElementById("voterName").innerHTML = "";
    document.getElementById("voterAadhar").innerHTML = "";
    document.getElementById("constituency").innerHTML = "";
    document.getElementById("boothList").innerHTML = "";
    document,getElementById("voterSubmit").innerHTML = "Submit";
    var option = document.createElement("option");
    option.text = "None";
    var select = document.getElementById("boothList");
    select.appendChild(option);
    document.getElementById("id01").style.display = "none"; 
   (document.getElementsByClassName("introPage")[0]).style.display = "block";
  }