pragma solidity ^0.4.2;

/**
 * The KuwaToken contract does this and that...
 */
contract KuwaRegistration {
    //name
    string public name = "KuwaToken";

    //symbol
    string public symbol = "Kuwa";

    //standard
    string public standard = "KuwaToken v1.0";//not ERC20

    uint256 public totalSupply; //making public eliminates use of the function returning total supply for ERC20

    address private clientAddress;
    address private sponsorAddress;

    uint256 private challenge;
    uint256 private challengeCreationTime;
    
    // May need to remove this
    mapping(address => uint256) public withdrawals;

    enum RegistrationStatus { ChallengeGenerated, ChallengeExpired, WaitingForValidation, Valid, Invalid }
    RegistrationStatus private registrationStatus;

    mapping (address => uint256) public balanceOf; //ERC 20 balanceOf
    mapping(address => mapping(address => uint256)) public allowance;

	//Transfer event
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

	// Approve event 
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event ChallengeValue (
        uint256 _challenge,
        RegistrationStatus _registrationStatus
    );

	//constructor
	//set the total number of tokens
	//read total number of tokens
    constructor (uint256 _initialSupply, address _clientAddress) public{
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        clientAddress = _clientAddress;
        sponsorAddress = msg.sender;
    }
    
	// Transfer
    function transfer(address _to, uint256 _value) public returns(bool success){
        // Exception if account doesnt have enough balance
        require(balanceOf[msg.sender] >= _value, "Revert balance to Sender");
        
        //Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //fire Transfer event according to ERC20
        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }

	//delegated transfers
	//approve
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
	
	//transferfrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Revert balance to sender");
        require(_value <= allowance[_from][msg.sender], "Revert balance to sender because he doesnt have enough allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    // fallback function for contract to receive ether
    function() payable public {
        withdrawals[msg.sender] = msg.value;
        require(withdrawals[msg.sender] == msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(_amount <= withdrawals[msg.sender], "Amount is exceeded");
        //require(msg.sender.send(_amount), "Revert withdrawal");
        msg.sender.transfer(_amount);
    }

    // Generates a 5-digit pseudorandom number
    function rand(address _publicKey) private view returns (uint256){
        // Generates random number
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(blockhash(lastBlockNumber));
        // This turns the input data into a 100-sided die
        // by dividing by ceil(2 ^ 256 / 100000).
        uint256 FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296;
        uint256 randNum = uint256(uint256(keccak256(abi.encodePacked(hashVal, _publicKey))) / FACTOR) + 1;
        // Sometimes the leading value is 0, so because we want the number always to
        // be 5 digits long, we just need to place it at the end of the challenge.
        while (randNum < 10000) {
            randNum = randNum * 10;
        }
        return randNum;
    }
	
    // Generates a challenge using the rand method and stores it in challenges
    function generateChallenge() public {
        challenge = rand(clientAddress);
        challengeCreationTime = block.timestamp;
        registrationStatus = RegistrationStatus.ChallengeGenerated;
    }

    // This was not part of the specification of the week but it makes sense to add it
    function getChallenge() public view returns(uint256) {
        uint256 timeElapsed = block.timestamp - challengeCreationTime;
        // timestamp is in seconds, therefore, 36000s == 10min.
        // We may need to change this later.
        if (timeElapsed < 36000) {
            return challenge;
        }
        return 0;
    }

    function getRegistrationStatus() public view returns(RegistrationStatus) {
        return registrationStatus;
    }

    function markAsValid() public returns(bool success) {
        registrationStatus = RegistrationStatus.Valid;
        return true;
    }

    function markAsInvalid() public returns(bool success) {
        registrationStatus = RegistrationStatus.Invalid;
        return true;
    }

    /* Kills this contract and refunds the balance to the Sponsor */
    function killContract() public {
        require(msg.sender == sponsorAddress);
        selfdestruct(sponsorAddress);
    }
}

