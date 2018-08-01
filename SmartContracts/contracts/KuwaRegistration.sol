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
    address kuwaTokenContract;
    //----------------------

	//constructor
	//set the total number of tokens
	//read total number of tokens
    constructor (address _clientAddress, address _kuwaTokenContract) public payable {
        clientAddress = _clientAddress;
        sponsorAddress = msg.sender;
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
        registrationStatus = newStatus;
    }

    /* Kills this contract and refunds the balance to the Sponsor */
    function killContract() public {
        require(msg.sender == sponsorAddress);
        selfdestruct(sponsorAddress);
    }

    /** ---------------------- Poker Protocol ------------------------- */
    struct Vote {
        bytes32 commit;
        bool voted;
        uint vote;
        bytes32 salt;
        bool valid;
    }

    uint timeOfFirstVote = 0;
    mapping(address => Vote) votes;
    address[] public voters;
    function vote(bytes32 _commit) public returns(bool) {
                                                            // How to revert registrar's approve for transfer tokens?
        require(kt.allowance(sponsorAddress, this) == 1);   // Sponsor must provide ante before voting round for incentive
        require(timeOfFirstVote == 0 || block.timestamp - timeOfFirstVote <= 3600);     // Registrars have one hour to vote after the first vote is cast
        require(kt.balanceOf(msg.sender) >= 100001);   // Qualified registrars must possess at least 100,000 Kuwa tokens 
        require(kt.allowance(msg.sender, this) == 1);   // Registrars must provide the required ante to vote
        require(!votes[msg.sender].voted);    // Registrars cannot vote more than once

        if (timeOfFirstVote == 0) {
            timeOfFirstVote = block.timestamp;
        }
        
        kt.transferFrom(msg.sender, this, 1);
        voters.push(msg.sender);
        votes[msg.sender].commit = _commit;
        votes[msg.sender].voted = true;
        return true;
    }

    function reveal(uint _vote, bytes32 _salt) public {
        uint timestamp = block.timestamp;
        require(_vote == 0 || _vote == 1);
        require(timestamp - timeOfFirstVote > 3600 && timestamp - timeOfFirstVote <= 7200);
        votes[msg.sender].vote = _vote;
        votes[msg.sender].salt = _salt;
        votes[msg.sender].valid = keccak256(_vote, _salt) == votes[msg.sender] ? true : false;
    }

    function decide() public returns(bool) {
        require(msg.sender == sponsorAddress);
        require(block.timestamp - timeOfFirstVote > 7200);
        
        uint valid = 0;
        uint invalid = 0;
        uint finalStatus = 0;
        uint finalPot = kt.balanceOf(this);
        uint dividend;
        for (uint i = 0; i < voters.length; i++) {
            Vote vote = votes[voters[i]];
            if (vote.valid) {
                if (vote.vote == 1) {
                    valid++;
                }
                else {
                    invalid++;
                }
            }
        }

        if (invalid > valid) {
            finalStatus = 0;
            dividend = finalPot / valid;
        }
        else if (valid > invalid) {
            finalStatus = 1;
            dividend = finalPot / invalid;
        }
        else {
            finalStatus = 2;
            dividend = finalPot / (valid + invalid);
        }

        return payout(finalStatus, dividend);
    }

    function payout(uint _finalStatus, uint _dividend) private returns(bool) {
        for (uint j = 0; j < voters.length; j++) {
            Vote vote = votes[voters[j]];
            if (vote.valid) {
                if (_finalStatus == 2 || vote.vote == _finalStatus) {
                    kt.transfer(voters[j], _dividend);
                }
            }
        }
        return true;
    }

    /*function sponsorAnte() public payable returns(bool) {
        require(msg.sender == sponsorAddress);
        
    }*/

    /** --------------------------------------------------------------- */
}