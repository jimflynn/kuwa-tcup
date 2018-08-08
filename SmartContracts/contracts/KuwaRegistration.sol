pragma solidity ^0.4.24;


import "./KuwaToken.sol";

/**
 * The Kuwa Registration contract does this and that...
 */
contract KuwaRegistration {
    address private clientAddress;
    address private sponsorAddress;

    uint256 private challenge;
    uint256 private challengeCreationTime;

    bytes32 private registrationStatus;

    address[] private kuwaNetwork;

    // For Poker Protocol 
    // ---------------------
    KuwaToken kt;
    address kuwaTokenContract;  //"0x2140eFD7Ba31169c69dfff6CDC66C542f0211825"
    //----------------------

	//constructor
	//set the total number of tokens
	//read total number of tokens
    constructor (address _clientAddress, address _kuwaTokenContract) public payable {
        clientAddress = _clientAddress;
        sponsorAddress = msg.sender;
        owner = msg.sender;
        kuwaTokenContract = _kuwaTokenContract;
        kt = KuwaToken(_kuwaTokenContract);
        generateChallenge();
        setRegistrationStatusTo("Credentials Provided");
        //sponsorAnte();
    }

    // Generates a 5-digit pseudorandom number
    function rand(address _publicKey) private view returns (uint256){
        // Generates random number
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(blockhash(lastBlockNumber));
        // This turns the input data into a 100-sided die
        // by dividing by ceil(2 ^ 256 / 10000).
        uint256 FACTOR = 11579208923731619542357098500868790785326998466564056403945758400791312963;
        uint256 randNum = uint256(uint256(keccak256(abi.encodePacked(hashVal, _publicKey))) / FACTOR) + 1;
        // Sometimes the leading value is 0, so because we want the number always to
        // be 4 digits long, we just need to place it at the end of the challenge.
        while (randNum < 1000) {
            randNum = randNum * 10;
        }
        return randNum;
    }
	
    // Generates a challenge using the rand method and stores it in challenges
    function generateChallenge() private {
        challenge = rand(clientAddress);
        challengeCreationTime = block.timestamp;
        registrationStatus = "Challenge Generated";
    }

    // This was not part of the specification of the week but it makes sense to add it
    function getChallenge() public view returns(uint256) {
        uint256 timeElapsed = block.timestamp - challengeCreationTime;
        // timestamp is in seconds, therefore, 36000s == 10hours.
        // We may need to change this later.
        if (timeElapsed < 36000) {
            return challenge;
        }
        return 0;
    }

    function addScannedKuwaId(address kuwaId) public {
        kuwaNetwork.push(kuwaId);
    }

    function getKuwaNetwork() public view returns(address[]) {
        return kuwaNetwork;
    }

    function getRegistrationStatus() public view returns(bytes32) {
        return registrationStatus;
    }

    // Possible values for newStatus are:
    // Credentials Provided, Challenge Expired, Video Uploaded, QR Code Scanned, Valid, Invalid
    function setRegistrationStatusTo(bytes32 newStatus) public {
        bool validInputA = newStatus == "Credentials Provided" || newStatus == "Challenge Expired";
        bool validInputB = newStatus == "Video Uploaded" || newStatus == "QR Code Scanned";
        bool validInputC = newStatus == "Valid" || newStatus == "Invalid";
        require(validInputA || validInputB || validInputC);
        require( (newStatus == "Valid" || newStatus == "Invalid")
                 || !((registrationStatus == "Valid" || registrationStatus == "Invalid")
                 && (newStatus != "Valid" && newStatus != "Invalid")) );
        registrationStatus = newStatus;
    }

/*if newStatus is valid or invalid, update
if currStatus is valid or invalid and (newStatus is not (valid or invalid)) do not update*/


    /** ---------------------- Poker Protocol ------------------------- */
    struct Vote {
        bytes32 commit;
        bool voted;
        uint vote;
        bytes32 salt;
        bool valid;
        bool isPaid;
    }

    uint public timeOfFirstVote = 0;
    mapping(address => Vote) public votes;
    address[] public voters;
    function vote(bytes32 _commit) public returns(bool) {
        require(kt.allowance(sponsorAddress, this) == 1);   // Sponsor must provide ante before voting round for incentive
        //require(timeOfFirstVote == 0 || block.timestamp - timeOfFirstVote <= 3600); // Registrars have one hour to vote after the first vote is cast
        require(kt.balanceOf(msg.sender) >= 100001);   // Qualified registrars must possess at least 100,000 Kuwa tokens 
        require(kt.allowance(msg.sender, this) == 1);   // Registrars must provide the required ante to vote
        require(!votes[msg.sender].voted);    // Registrars cannot vote more than once

        if (timeOfFirstVote == 0) {
            timeOfFirstVote = block.timestamp;
        }
        
        if (!kt.transferFrom(msg.sender, this, 1))
            return false;
        voters.push(msg.sender);
        votes[msg.sender] = Vote({commit: _commit, voted: true, vote: 2, salt: 0x0, valid: false, isPaid: false});
        return true;
    }
    
    /*unction getVote(address voter) public view returns(bytes32, bool) {
        return (votes[voter].commit, votes[voter].voted);
    }*/

    function transferTokens(uint _value) public {
        kt.transfer(address(this), _value);
    }
    
    function transferFromTokens(uint _value) public {
        kt.transferFrom(msg.sender, this, _value);
    }
    
    
    function dummy(uint _value) public returns(address, address, uint) {
        return (msg.sender, this, _value);
    }
    
    function dummy2() public {
        kt.dummy();
    }

    function remainingTime() public view returns(uint) {
        return block.timestamp - timeOfFirstVote;
    }

    function reveal(uint _vote, bytes32 _salt) public {
        uint timestamp = block.timestamp;
        //require(timestamp - timeOfFirstVote > 3600 && timestamp - timeOfFirstVote <= 7200);
        require(votes[msg.sender].voted);
        require(_vote == 0 || _vote == 1);
        
        votes[msg.sender].vote = _vote;
        votes[msg.sender].salt = _salt;
        votes[msg.sender].valid = keccak256(_vote, _salt) == votes[msg.sender].commit ? true : false;
    }
    
    address public owner;
    uint public finalStatus = 3;
    uint public dividend = 0;
    uint public bp = 0;
    uint public finalPot;
    uint public valid = 0;
    uint public invalid = 0;
    function decide() public returns(uint) {
        require(msg.sender == sponsorAddress);
        //require(block.timestamp - timeOfFirstVote > 7200);
        
        
        if (!kt.transferFrom(msg.sender, this, 1))
            return 0;
        bp = 1;
        finalPot = kt.balanceOf(this);
        for (uint i = 0; i < voters.length; i++) {
            Vote storage vote = votes[voters[i]];
            if (vote.valid) {
                if (vote.vote == 1) {
                    valid++;
                }
                else {
                    invalid++;
                }
            }
        }
        bp = 2;

        if (invalid + valid == 0) {
            dividend = finalPot;
        }
        else if (invalid > valid) {
            finalStatus = 0;
            dividend = finalPot / valid;
            setRegistrationStatusTo("invalid");
        }
        else if (valid > invalid) {
            finalStatus = 1;
            dividend = finalPot / invalid;
            setRegistrationStatusTo("valid");
        }
        else {
            finalStatus = 2;
            dividend = finalPot / (valid + invalid);
        }
        bp = 3;
        return 1;
        //return true;
    }

    function payout() public returns(bool) {
        require(finalStatus != 3);
        require(msg.sender == sponsorAddress);

        for (uint j = 0; j < voters.length; j++) {
            Vote storage vote = votes[voters[j]];
            if (!vote.isPaid && vote.valid && (finalStatus == 2 || vote.vote == finalStatus)) {
                if (!kt.transfer(voters[j], dividend)) {
                    return false;
                }
                vote.isPaid = true;
            }
        }
        return true;
    }

    /*function sponsorAnte() public payable returns(bool) {
        require(msg.sender == sponsorAddress);
    }*/

    /** --------------------------------------------------------------- */
}