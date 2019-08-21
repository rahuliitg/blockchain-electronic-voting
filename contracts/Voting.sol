pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Voting{
    // Candidate
    struct Person{
        string name;
        uint aadharId;
    }

    struct Candidate{
        string name;
        uint aadharId;
        uint voteCount;
        uint constituencyId;
        uint id;
        bool doesExist;
    }

    struct Voter{
        Person person;
        bool isVoted;
        uint constituencyId;
        uint id;
        uint boothId;
        bool doesExist;
    }

    //Booth
    struct Booth{
        string boothAddress;
        uint id;
        uint constituencyId;
        bool doesExist;
    }

    // Constituency
    struct Constituency{
        string name;
        uint id;
        uint boothCount;
        bool doesExist;
        uint candidateCount;
    }

    struct Officer{
        string name;
        uint aadharId;
        uint id;
        uint boothId;
        bool doesExist;
    }


    mapping(uint => Candidate) public candidates;
    mapping(uint => Officer) public officersList; // aadhar
    mapping(uint => Voter)  public voters; //aadhar
    mapping(uint => Constituency) public constituencyList;
    mapping(uint => Booth) public boothList;
    mapping(string => uint)  constituencyNameToId;
    mapping(address => uint) public machineToBooth;
    mapping(uint => Booth[]) public constituencyToBooth;
    mapping(uint => Constituency) public pinToConstituency;
    mapping (uint => Candidate[]) constituencyToCandidate;
    enum StateType { PreVoting, Voting, Result}

    //List of properties
    StateType public  State;
    uint public boothCount;
    uint public votersCount;
    uint public candidateCount;
    uint public constituencyCount;
    uint public officerCount;

    event voteCast(address sender);

    constructor() public
    {
        addConstituency("Guwahati");
        addConstituency("Sheoganj");
        addBooth("GS-Road",1);
        addBooth("Paltan Bazar",1);
        addBooth("Nagar Palika",2);
        addOfficer("Kartikey Kant",732449600739,1);
        addOfficer("Ashish Ranjan", 575848571904, 2);
        addOfficer("Mitanshu Mittal", 293274081107, 3);
        State = StateType.PreVoting;
        pinToConstituency[301001] = constituencyList[1];
        pinToConstituency[456789] = constituencyList[1];
        pinToConstituency[827004] = constituencyList[1];
        pinToConstituency[307027] = constituencyList[1];
        pinToConstituency[132105] = constituencyList[1];
        
    }

    function addBooth(string memory boothAddress,uint constituencyId)public {
        boothCount++;
        boothList[boothCount] = Booth(boothAddress,boothCount,constituencyId,true);
        constituencyList[constituencyId].boothCount++;
        constituencyToBooth[constituencyId].push(boothList[boothCount]);
    }

    function addConstituency(string memory name) public {
        constituencyCount++;
        constituencyList[constituencyCount] = Constituency(name,constituencyCount,0,true,0);
        constituencyNameToId[name] = constituencyCount;
    //    for(uint i = 0;i < boothId.length;++i){
    //        constituencyToBooth[constituencyCount].push(boothId[i]);
    //    }
    }

    function addOfficer(string memory name,uint aadharId,uint boothId) public{
        officerCount++;
        officersList[aadharId] = Officer(name,aadharId,officerCount,boothId,true);
    }

    function addCandidate(string memory constituencyName,string memory name,uint aadharId) public {
        require(State==StateType.PreVoting,"Invalid State");
        // emit voteCast(msg.sender);
        // verify candidate
        //require(officersList[msg.sender].doesExist == true,"Officer Not Authorized");
        uint constituencyId = constituencyNameToId[constituencyName];
        require(constituencyId > 0 && constituencyId <= constituencyCount,"Invalid Constituency");
        // check aadhar.
        // Person memory person = Person(name,aadharId);
        candidateCount++;
        candidates[candidateCount] = Candidate(name,aadharId,0,constituencyId,candidateCount,true);
        constituencyToCandidate[constituencyId].push(candidates[candidateCount]);
        constituencyList[constituencyId].candidateCount++;
    }

    // // update candidate
    // function updateCandidate(uint id) public {

    // }

    function addVoter(string memory constituencyName,uint boothId,string memory name,uint aadharId) public {
        uint constituencyId = constituencyNameToId[constituencyName];
        require(State==StateType.PreVoting,"Invalid State");
        require(constituencyId > 0 && constituencyId <= constituencyCount,"Invalid Constituency");
        require(boothId > 0 && boothId <= constituencyList[constituencyId].boothCount, "Invalid Booth");
        require(voters[aadharId].doesExist == false,"You have already been registerd");
        // verify aadhar.
        // verify voter age checking
        Person memory person = Person(name,aadharId);
        votersCount++;
        //error in below line,, what is id in voter
        Voter memory voter = Voter(person,false,constituencyId,votersCount,boothId,true);
        //changed aadharid from voter.id,,coz of problem while verfying user
        voters[aadharId] = voter;
    }
    // Fuction to get voter details.

    // register msg.sender
    function StartVoting() public{
        require(State==StateType.PreVoting,"Invalid State");
        State = StateType.Voting;
    }

    function vote(uint candidateId,uint aadharId)public {
        require(State==StateType.Voting,"Invalid State");
        require(machineToBooth[msg.sender] > 0 && machineToBooth[msg.sender] <= boothCount,"Invalid booth");
        require(voters[aadharId].doesExist == true,"voter not registerd");
        require(voters[aadharId].isVoted == false,"Already voted");
        candidates[candidateId].voteCount += 1;
        voters[aadharId].isVoted = true;
        // emit ()
    }

    function verifyToVote(uint boothId, uint aadharId) public view returns (bool)  {
        require(State==StateType.Voting,"Invalid State");
        require(machineToBooth[msg.sender] > 0 && machineToBooth[msg.sender] <= boothCount,"Invalid booth");
        require(machineToBooth[msg.sender] == boothId, "Action should be done at different Constituency or booth");
        require(voters[aadharId].doesExist == true,"Voter not added to the voters list!");
        require(voters[aadharId].boothId == boothId, "Voter does not belong to this booth ");
        return true;
    }

    function verifyOfficer(uint aadharId) public returns (bool){
        require(State==StateType.PreVoting,"Invalid State");
        require(officersList[aadharId].doesExist == true,"Invalid Officer");
        machineToBooth[msg.sender] = officersList[aadharId].boothId;
        return true;
    }

    function finishVoting() public{
        require(State==StateType.Voting,"Invalid State");
        State = StateType.Result;
    }



        // mapping (uint => Candidate[]) result;
        // Candidate[] result;

    event Result(
        Candidate[] result
    );

    function getResults(uint constituencyId) public {
        require(State == StateType.Result,"Invalid State");
        require(constituencyId > 0 && constituencyId <= constituencyCount,"Invalid Constituency");
            uint size = constituencyToCandidate[constituencyId].length;
            uint count = 0 ;
            while(size > 1 ){
                uint maxVotes=0;
                uint maxId = 0;
                for(uint j=0;j<size-count;++j){
                    if(maxVotes <= constituencyToCandidate[constituencyId][j].voteCount){
                        maxVotes = constituencyToCandidate[constituencyId][j].voteCount;
                        maxId = j;
                    }
                }
                Candidate memory temp = constituencyToCandidate[constituencyId][count];
                constituencyToCandidate[constituencyId][count] = constituencyToCandidate[constituencyId][maxId];
                constituencyToCandidate[constituencyId][maxId] = temp;
                count++;
            }
        
        emit Result(constituencyToCandidate[constituencyId]);
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


// contract Voting {
//     // an event that is called whenever a Candidate is added so the frontend could
//     // appropriately display the candidate with the right element id (it is used
//     // to vote for the candidate, since it is one of arguments for the function "vote")
//     event AddedCandidate(uint candidateID);

//     // describes a Voter, which has an id and the ID of the candidate they voted for
//     address owner;
//     function Voting()public {
//         owner=msg.sender;
//     }
//     modifier onlyOwner {
//         require(msg.sender == owner);
//         _;
//     }
//     struct Voter {
//         bytes32 uid; // bytes32 type are basically strings
//         uint candidateIDVote;
//     }
//     // describes a Candidate
//     struct Candidate {
//         bytes32 name;
//         bytes32 party;
//         // "bool doesExist" is to check if this Struct exists
//         // This is so we can keep track of the candidates
//         bool doesExist;
//     }

//     // These state variables are used keep track of the number of Candidates/Voters
//     // and used to as a way to index them    
//     uint numCandidates; // declares a state variable - number Of Candidates
//     uint numVoters;


//     // Think of these as a hash table, with the key as a uint and value of
//     // the struct Candidate/Voter. These mappings will be used in the majority
//     // of our transactions/calls
//     // These mappings will hold all the candidates and Voters respectively
//     mapping (uint => Candidate) candidates;
//     mapping (uint => Voter) voters;

//     /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//      *  These functions perform transactions, editing the mappings *
//      * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//     function addCandidate(bytes32 name, bytes32 party) onlyOwner public {
//         // candidateID is the return variable
//         uint candidateID = numCandidates++;
//         // Create new Candidate Struct with name and saves it to storage.
//         candidates[candidateID] = Candidate(name,party,true);
//         AddedCandidate(candidateID);
//     }

//     function vote(bytes32 uid, uint candidateID) public {
//         // checks if the struct exists for that candidate
//         if (candidates[candidateID].doesExist == true) {
//             uint voterID = numVoters++; //voterID is the return variable
//             voters[voterID] = Voter(uid,candidateID);
//         }
//     }

//     /* * * * * * * * * * * * * * * * * * * * * * * * * *
//      *  Getter Functions, marked by the key word "view" *
//      * * * * * * * * * * * * * * * * * * * * * * * * * */


//     // finds the total amount of votes for a specific candidate by looping
//     // through voters
//     function totalVotes(uint candidateID) view public returns (uint) {
//         uint numOfVotes = 0; // we will return this
//         for (uint i = 0; i < numVoters; i++) {
//             // if the voter votes for this specific candidate, we increment the number
//             if (voters[i].candidateIDVote == candidateID) {
//                 numOfVotes++;
//             }
//         }
//         return numOfVotes;
//     }

//     function getNumOfCandidates() public view returns(uint) {
//         return numCandidates;
//     }

//     function getNumOfVoters() public view returns(uint) {
//         return numVoters;
//     }
//     // returns candidate information, including its ID, name, and party
//     function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
//         return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
//     }
// }