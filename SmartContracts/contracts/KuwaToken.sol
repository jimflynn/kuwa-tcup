pragma solidity ^0.4.2;

/**
 * The KuwaToken contract does this and that...
 */
contract KuwaToken {
    //name
    string public name = "KuwaToken";

    //symbol
    string public symbol = "Kuwa";

    //standard
    string public standard = "KuwaToken v1.0";//not ERC20

    uint256 public totalSupply; //making public eliminates use of the function returning total supply for ERC20

    // Challenges are stored here in an array. In the index 0 of the array the timestamp is
    // recorded of the moment in which the challenge is generated in order to check for
    // expiration. Index 1 contains the challenge.
    // Challenges can be found with the publicKey
    mapping(string => uint256[2]) private challenges;

    // Unknown is set first as the default value. We do this in case a key is looked for and
    // it is not found in the mapping
    enum RegistrationStatus { Unknown, Funded, Waiting, Valid, Invalid }
    mapping(string => RegistrationStatus) private registrationStatus;

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

	//constructor
	//set the total number of tokens
	//read total number of tokens
    constructor (uint256 _initialSupply) public{
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

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

    // Still don't know what you were doing here Manush hahaha
    function storeRequest (uint256 _gas) payable public {
        require (msg.value == _gas, "Revert balance to sender");
    }

    // Generates a 5-digit pseudorandom number
    function rand(string _publicKey) private view returns (uint256){
        // Generates random number
        uint256 lastBlockNumber = block.number - 1;
        uint256 hashVal = uint256(blockhash(lastBlockNumber));
        // This turns the input data into a 100-sided die
        // by dividing by ceil(2 ^ 256 / 100000).
        uint256 FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296;
        uint256 randNum = uint256(uint256(keccak256(abi.encodePacked(hashVal, _publicKey))) / FACTOR) + 1;
        // Sometimes the leading value is 0, so because we want the number always to
        // be 5 digits long, we just need to place it at the end of the challenge.
        if (randNum < 10000) {
            randNum = randNum * 10;
        }
        return randNum;
    }
	
    // Generates a challenge using the rand method and stores it in challenges
    function generateChallenge(string _publicKey) public {
        uint256 challenge = rand(_publicKey);
        challenges[_publicKey][0] = block.timestamp;
        challenges[_publicKey][1] = challenge;
        // TODO: change registration status
        // registrationStatus[_publicKey] = RegistrationStatus.Waiting; <- Not sure
    }

    // This was not part of the specification of the week but it makes sense to add it
    function getChallenge(string _publicKey) public view returns(uint256) {
        uint256 timeElapsed = block.timestamp - challenges[_publicKey][0];
        // timestamp is in seconds, therefore, 36000s == 10min.
        // We may need to change this later.
        if (timeElapsed < 36000) {
            return challenges[_publicKey][1];
        }
        // TODO: Maybe change the Registration Status here as well? Like RegistrationStatus.Expired
        return 0;
    }

    function getRegistrationStatus(string _publicKey) public view returns(RegistrationStatus) {
        return registrationStatus[_publicKey];
    }

    function markAsValid(string _publicKey) public returns(bool) {
        registrationStatus[_publicKey] = RegistrationStatus.Valid;
        return true;
    }

    function markAsInvalid(string _publicKey) public returns(bool) {
        registrationStatus[_publicKey] = RegistrationStatus.Invalid;
        return true;
    }
}

