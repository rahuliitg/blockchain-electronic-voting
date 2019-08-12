pragma solidity ^0.5.0;

contract Voting{
    // Candidate
    struct Person{
        string name;
        uint aadharId;
    }

    struct Candidate{
        Person person;
        uint voteCount;
        uint constituencyId;
        uint id;
        bool doesExist;
    }

    struct Voter{
        Person person;
        bool doesExist;
        bool isVoted;
        uint constituencyId;
        uint id;
        uint boothId;
    }

    //Booth
    struct Booth{
        string boothAddress;
        uint boothId;
    }

    // Constituency
    struct Constituency{
        string name;
        uint id;
        Booth[] boothList;
        bool doesExist;
    }

    struct Officer{
        Person person;
        uint id;    
        uint constituencyId;
        uint boothId;
        bool doesExist;
    }


    mapping(uint => Candidate) candidates;
    mapping(address => Officer) officersList;
    mapping(uint => Voter) voters;
    mapping(string => uint) constituencyNameToId;


    uint votersCount;
    uint candidateCount;
    uint constituencyCount;

    function addCandidate(string memory constituencyName,string memory name,uint aadharId) public {
        // verify candidate
        require(officersList[msg.sender].doesExist == true,"Officer Not Authorized");
        uint constituencyId = constituencyNameToId[constituencyName];
        require(constituencyId > 0 && constituencyId <= constituencyCount,"Invalid Constituenc");
        // check aadhar.
        Person storage person = Person(name,aadharId);
        candidateCount++;
        Candidate storage candidate = Candidate(person,0,constituencyId,candidateCount,true);
        candidates[candidate.id] = candidate;
    }

    // update candidate
    function updateCandidate(uint id) public {

    }

    function addVoter(string memory constituencyName,uint boothId,string memory name,uint aadharId) public {
        // verify voter age checking
        Person memory person = Person(name,aadharId);
        votersCount++;
        //error in below line,, what is id in voter
        Voter memory voter = Voter(person,false,constituencyId,votersCount,boothId);
       //changed aadharid from voter.id,,coz of problem while verfying user
        voters[aadharId] = voter;
    }
 
    // Fuction to get voter details. 

    // register msg.sender

    function vote (uint candidateId,uint voterId)public{
        candidates[candidateId].voteCount += 1;
    }

    function addOfficer (uint officerId, uint boothId)public{
        officerBoothList[boothId] = officerId;
    }

    function verifyVoterBeforeVoting(uint boothId, uint constituencyId,uint aadharId) public{
        require(voters[aadharId].doesExist == true,"Voter not added to the voters list!" );
        require(voters[aadharId].constituencyId == constituencyId, "Voter does not belong to this constituency: "  + constituencyId );
        require(voters[aadharId].boothId == boothId, "Voter does not belong to booth no.: "+boothId );
    }

}


// contract Election {
//     // Model a Candidate
//     struct Candidate {
//         uint id;
//         string name;
//         uint voteCount;
//     }

//     // Store accounts that have voted
//     mapping(address => bool) public voters;
//     // Store Candidates
//     // Fetch Candidate
//     mapping(uint => Candidate) public candidates;
//     // Store Candidates Count
//     uint public candidatesCount;

//     // voted event
//     event votedEvent (
//         uint indexed _candidateId
//     );

//     constructor() public {
//         addCandidate("Candidate 1");
//         addCandidate("Candidate 2");
//     }

//     function addCandidate (string memory _name) private {
//         candidatesCount ++;
//         candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
//     }

//     function vote (uint _candidateId) public {
//         // require that they haven't voted before
//         require(!voters[msg.sender],"You have already voted!");

//         // require a valid candidate
//         require(_candidateId > 0 && _candidateId <= candidatesCount,"Candidate is not valid!");

//         // record that voter has voted
//         voters[msg.sender] = true;

//         // update candidate vote Count
//         candidates[_candidateId].voteCount ++;

//         // trigger voted event
//         emit votedEvent(_candidateId);
//     }
// }


contract Voting {
    // an event that is called whenever a Candidate is added so the frontend could
    // appropriately display the candidate with the right element id (it is used
    // to vote for the candidate, since it is one of arguments for the function "vote")
    event AddedCandidate(uint candidateID);

    // describes a Voter, which has an id and the ID of the candidate they voted for
    address owner;
    function Voting()public {
        owner=msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    struct Voter {
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
    }
    // describes a Candidate
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        // "bool doesExist" is to check if this Struct exists
        // This is so we can keep track of the candidates 
        bool doesExist; 
    }

    // These state variables are used keep track of the number of Candidates/Voters 
    // and used to as a way to index them     
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;

    
    // Think of these as a hash table, with the key as a uint and value of 
    // the struct Candidate/Voter. These mappings will be used in the majority
    // of our transactions/calls
    // These mappings will hold all the candidates and Voters respectively
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  These functions perform transactions, editing the mappings *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    function addCandidate(bytes32 name, bytes32 party) onlyOwner public {
        // candidateID is the return variable
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
        AddedCandidate(candidateID);
    }

    function vote(bytes32 uid, uint candidateID) public {
        // checks if the struct exists for that candidate
        if (candidates[candidateID].doesExist == true) {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID);
        }
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * 
     *  Getter Functions, marked by the key word "view" *
     * * * * * * * * * * * * * * * * * * * * * * * * * */
    

    // finds the total amount of votes for a specific candidate by looping
    // through voters 
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }
    // returns candidate information, including its ID, name, and party
    function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }
}
