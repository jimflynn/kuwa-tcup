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

	function KuwaToken (uint256 _initialSupply) public{
		// allocate the initial supply
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;

	}

	
	// Transfer
	function transfer(address _to, uint256 _value) public returns(bool success){



		// Exception if account doesnt have enough balance
		require(balanceOf[msg.sender] >= _value, 'Revert balance to Sender');
		
		//Transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		//fire Transfer event according to ERC20
		Transfer(msg.sender, _to, _value);

		//return a boolean	
		return true;
	}

	//delegated transfers
	//approve
	function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);

        return true;
    }
	
	//transferfrom

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], 'Revert balance to sencer');
        require(_value <= allowance[_from][msg.sender], 'Revert balance to sender because he doesnt have enough allowance');

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);

        return true;
    }

	//allowance	
	
}

