pragma solidity ^0.4.24;

import "./KuwaToken.sol";
import "./Owned.sol";

/**
 * The Kuwa Registration contract is deployed when a person registers for a Kuwa identity.
 * It contains state and functions for verifying the identity of the Kuwa client.
 */
contract KuwaRegistration is Owned {
    address private clientAddress;
    address public sponsorAddress;

    uint256 private challenge;
    uint256 private challengeCreationTime;

    bytes32 private registrationStatus;

    address[] private kuwaNetwork;

    // For Poker Protocol 
    // ---------------------
    KuwaToken kt;
    address kuwaTokenContract;
    //----------------------

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

    /** 
     * Possible values for newStatus are:
     * Credentials Provided, Challenge Expired, Video Uploaded, QR Code Scanned, Valid, Invalid
     */
    function setRegistrationStatusTo(bytes32 newStatus) public {
        bool validInputA = newStatus == "Credentials Provided" || newStatus == "Challenge Expired";
        bool validInputB = newStatus == "Video Uploaded" || newStatus == "QR Code Scanned";
        bool validInputC = newStatus == "Valid" || newStatus == "Invalid";
        require(validInputA || validInputB || validInputC); // Validate input
        /* 
         * If `newStatus` is "Valid" or "Invalid", always update
         * If `registrationStatus` is "Valid" or "Invalid" and `newStatus` is not "Valid"
         * or "Invalid", revert the transaction (do not update!) 
         */
        require( (newStatus == "Valid" || newStatus == "Invalid") || !((registrationStatus == "Valid" || registrationStatus == "Invalid") && (newStatus != "Valid" && newStatus != "Invalid")) );
        registrationStatus = newStatus;
    }


    /** ---------------------- Poker Protocol ------------------------- */
    // NOTE:
    // - In the vote(), reveal(), decide() functions, the require() statement for enforcing a time constraint is commented out for testing purposes.
    //   To simulate the real poker protocol, in which there are time constraints for voting, revealing and deciding the
    //   final status, feel free to uncomment the require() statements.

    // Concerns:
    // - Is the 1-hour voting process long enough? How do registrars know if voting has started? What if registrars are validating millions of clients at once?
    // - How do registrars dispute a status? How to introduce an incentive for this scenario?
    // - When splitting the pot, will tokens be equally divisible to a float value? Test this...

    // Information about a voter's actions
    struct Voter {
        bytes32 commit;
        bool voted;
        uint vote;
        bytes32 salt;
        bool honest;
        bool isPaid;
    }

    // Important state variables
    uint public timeOfFirstVote = 0;    // Record the time of the first vote, to serve as a yardstick
    mapping(address => Voter) public votersMap; // Maintain a mapping of a voter's address to its voting information
    address[] public votersList;    // Maintain a list of a voters for iteration
    //Dummy client address for testing: "0x2140eFD7Ba31169c69dfff6CDC66C542f0211825"
    
    /**
        This function will record a Registrar's commited vote in the contract.
        Registrars vote through their deployed QualifiedKuwaRegistrar contract.

        @param _commit A voter's commited vote (a hash of the vote and a salt)
        @return Whether the vote was successful or not
     */
    function vote(bytes32 _commit) public returns(bool) {
        require(kt.allowance(sponsorAddress, this) == 1, "The Sponsor did not provide the incentive ante");   // Sponsor must provide ante before the voting round as an incentive for the registrars
        //require(timeOfFirstVote == 0 || block.timestamp - timeOfFirstVote <= 3600, "Voting period has ended"); // Registrars have one hour to vote after the first vote is cast
        require(kt.balanceOf(msg.sender) >= 100001, "The Registrar has not staked the required number of tokens to be qualified to vote");   // Qualified registrars must possess at least 100,001 Kuwa tokens 
        require(kt.allowance(msg.sender, this) == 1, "The Registrar did not provide the required ante");   // Registrars must provide the required ante to vote
        require(!votersMap[msg.sender].voted, "The Registrar has already voted");    // Registrars cannot vote more than once

        if (timeOfFirstVote == 0) {
            timeOfFirstVote = block.timestamp;
        }
        
        if (!kt.transferFrom(msg.sender, this, 1))
            return false;

        votersList.push(msg.sender);
        votersMap[msg.sender] = Voter({commit: _commit, voted: true, vote: 2, salt: 0x0, honest: false, isPaid: false});
        return true;
    }

    /**
        @return The remaining time for the voting process
     */
    function remainingTime() public view returns(uint) {
        return block.timestamp - timeOfFirstVote;
    }

    /**
        Registrars will reveal their votes by providing the original vote and salt.
        This function should be called through the deployed QualifiedKuwaRegistrar contract.
        It should only be called after the anonymous voting process has ended.
        If the provided vote and salt matches the previously commited vote, the voter is marked
        as valid.

        @param _vote The original vote
        @param _salt The original salt
     */
    bytes32 public hashDigest;
    function reveal(uint _vote, bytes32 _salt) public {
        uint timestamp = block.timestamp;
        //require(timestamp - timeOfFirstVote > 3600 && timestamp - timeOfFirstVote <= 7200, "Reveal period has either not begun or has ended");   // Voters are given 1 hour to reveal after the anonymous voting process has ended
        require(votersMap[msg.sender].voted, "The Registrar never voted during the voting process");   // Registrars must have voted
        require(_vote == 0 || _vote == 1, "The Registrar has provided an unrecognized vote");      // The vote must be a valid one: 0 or 1
        
        //hashDigest = keccak256(_vote, _salt);
        votersMap[msg.sender].vote = _vote;
        votersMap[msg.sender].salt = _salt;
        votersMap[msg.sender].honest = keccak256(_vote, _salt) == votersMap[msg.sender].commit;
    }
    
    /**
        This function counts the votes after the reveal process has ended and determines
        the final status of the Kuwa client (registrant) by majority vote.
        It then splits the final pot among those who casted the majority vote (the winners)
        and distributes an equal dividend to each of the winners as a reward. 
        As of now, the minority automatically "fold" and lose their Kuwa Token ante.
        In the case of a tie, the pot is split equally among all the honest voters with
        the Sponsor's ante providing the small reward.

        This function should only be called by the Sponsor. It also sets the registration status
        of the Kuwa client based on the decision.

        @return Whether the decision has successfully been made
     */
    uint public finalStatus = 3;    // The final status after tallying the votes
                                    // 0 = Invalid, 1 = Valid, 2 = Tie, 3 = No status decided yet
    uint public dividend = 0;   // The number of tokens awarded to each winner
    function decide() public onlyOwner returns(bool) {
        require(finalStatus == 3, "The final status of the Kuwa client has already been decided");
        //require(block.timestamp - timeOfFirstVote > 7200, "The reveal process has not ended yet");    // The decision can only be made after the reveal process has ended
        
        /* Transfer the Sponsor's ante to this Kuwa Registration contract's token balance */
        if (!kt.transferFrom(msg.sender, this, 1))
            return false;
            
        uint finalPot = kt.balanceOf(this);
        uint valid = 0;
        uint invalid = 0;
        for (uint i = 0; i < votersList.length; i++) {
            Voter storage voter = votersMap[votersList[i]];
            if (voter.honest) {
                if (voter.vote == 1) {
                    valid++;
                }
                else {
                    invalid++;
                }
            }
        }

        if ((invalid + valid) == 0) {
            dividend = finalPot;
        }
        else if (invalid > valid) {
            finalStatus = 0;
            dividend = finalPot / invalid;
            setRegistrationStatusTo("Invalid");
        }
        else if (valid > invalid) {
            finalStatus = 1;
            dividend = finalPot / valid;
            setRegistrationStatusTo("Valid");
        }
        else {
            finalStatus = 2;
            dividend = finalPot / (valid + invalid);
        }

        return true;
    }

    /**
        This function will allow those who voted in the majority (winners) to
        receive their reward from the voting process in Kuwa Tokens.

        @return Whether or not the payout was successful
     */
    function payout() public returns(bool) {
        require(finalStatus != 3, "The final status must be decided before voters can claim reward");  // The final status must have been decided for tokens to be rewarded correctly to voters
        Voter storage voter = votersMap[msg.sender];
        require(!voter.isPaid, "The voter has already claimed the reward");
        require(voter.honest, "The voter is not honest. The committed vote does not match the original vote provided during the reveal process");
        require(finalStatus == 2 || voter.vote == finalStatus, "The voter's vote does not match the winning vote (final status) according to the decision");

        if (!kt.transfer(msg.sender, dividend)) {
            return false;
        }
        voter.isPaid = true;
        return true;
    }
    
    
    /* For debugging and testing*/
    function getVoter() public view returns(bytes32, bool) {
        return (votersMap[msg.sender].commit, votersMap[msg.sender].voted);
    }

    function getVotersList() public view returns(address[]) {
        return votersList;
    }

    function getHashDigest() public view returns(bytes32) {
        return hashDigest;
    }

    function isVoterHonest() public view returns(bool) {
        return votersMap[msg.sender].honest;
    }

    function getFinalStatus() public view returns(uint) {
        return finalStatus;
    }

    function getDividend() public view returns(uint) {
        return dividend;
    }

    function transferTokens(uint _value) public {
        kt.transfer(address(this), _value);
    }
    
    function transferFromTokens(uint _value) public {
        kt.transferFrom(msg.sender, this, _value);
    }
    
    function balanceOf(address addr) public view returns(uint) {
        return kt.balanceOf(addr);
    }
    
    function dummy(uint _value) public view returns(address, address, uint) {
        return (msg.sender, this, _value);
    }
    
    function dummy2() public {
        kt.dummy();
    }

    /*function sponsorAnte() public payable returns(bool) {
        require(msg.sender == sponsorAddress);
    }*/

    /** --------------------------------------------------------------- */
}