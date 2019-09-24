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
    mapping (uint => uint[]) public constituencyToCandidate;
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
        addConstituency("Hyderabad");
        addConstituency("Bangalore");
        addBooth("Gachibowli",1);
        addBooth("Indira Nagar",2);
        addBooth("Kormangla",2);
        addOfficer("Kartikey Kant",732449600739,1);
        addOfficer("Ashish Ranjan", 575848571904, 2);
        addOfficer("Mitanshu Mittal", 293274081107, 3);
        State = StateType.PreVoting;
        pinToConstituency[301001] = constituencyList[1];
        pinToConstituency[456789] = constituencyList[1];
        pinToConstituency[827004] = constituencyList[1];
        pinToConstituency[307027] = constituencyList[1];
        pinToConstituency[132105] = constituencyList[2];
        pinToConstituency[282005] = constituencyList[2];
        pinToConstituency[210204] = constituencyList[2];
        pinToConstituency[482001] = constituencyList[2];
    }
    function changeState(uint stateNo) public {
        if(stateNo==1){
            State = StateType.PreVoting;
        }else if(stateNo == 2){
            State = StateType.Voting;
        }else{
            State = StateType.Result;
        }
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
        uint constituencyId = constituencyNameToId[constituencyName];
        require(constituencyId > 0 && constituencyId <= constituencyCount,"Invalid Constituency");
        // check aadhar.
        // Person memory person = Person(name,aadharId);
        candidateCount++;
        candidates[candidateCount] = Candidate(name,aadharId,0,constituencyId,candidateCount,true);
        constituencyToCandidate[constituencyId].push(candidateCount);
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

    function vote(uint candidateId,uint aadharId) public  {
        require((State==StateType.Voting),"Invalid State");
        require(voters[aadharId].doesExist==true,"voter not registerd");
        require(voters[aadharId].isVoted == true,"Already voted");
        candidates[candidateId].voteCount++;
        voters[aadharId].isVoted = true;
    }

    function verifyToVote(uint boothId, uint aadharId) public view returns (uint)  {
        if(!(State==StateType.Voting))
            return 1;
        if(!(voters[aadharId].doesExist == true))
            return 4;
        if(!(voters[aadharId].boothId == boothId))
            return 5;
        return 0;
    }

    function verifyOfficer(uint aadharId) public view returns (uint){
        if(!(State==StateType.Voting))
            return 1;
        if(!(officersList[aadharId].doesExist))
            return 2;
        return 0;
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

    function finishElectionCheck() public {
        require(State == StateType.Result,"Invalid State");
    }
}
