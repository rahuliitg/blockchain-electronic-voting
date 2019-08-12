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
    }

    struct Voter{
        Person person;
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
    }


    mapping(uint => Candidate) candidates;
    mapping(uint => uint)officerBoothList;
    mapping(uint => Voter) voters;    
    
    uint votersCount;
    uint candidateCount;

    function addCandidate(uint constituencyId,string memory name,uint aadharId) public {
        // verify candidate
        Person memory person = Person(name,aadharId);
        candidateCount++;
        Candidate memory candidate = Candidate(person,0,constituencyId,candidateCount);
        candidates[candidate.id] = candidate;
    }

    // update candidate
    function updateCandidate(uint id) public {

    }

    function addVoter(uint constituencyId,uint boothId,string memory name,uint aadharId) public {
        // verify voter
        Person memory person = Person(name,aadharId);
        votersCount++;
        //error in below line,, what is id in voter
        Voter memory voter = Voter(person,false,constituencyId,votersCount,boothId);
        voters[voter.id] = voter;
    }
 
    
    // Fuction to get voter details. 

    // register msg.sender

    function vote(uint candidateId,uint voterId,uint ){
        require(senders)
    }

    function addOfficer(uint officerId, uint boothId){
        officerBoothList[boothId] = officerId;
    }

    function verifyVoterBeforeVoting(uint boothId, uint constituencyId,uint aadharId){
        voters[]
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
//         require(_candidateId > 0 && _candidateId <= candidatesC  ount,"Candidate is not valid!");

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
