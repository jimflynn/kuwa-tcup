// Contract that a Qualified Kuwa Registrar will deploy.
// Registrars are required to stake at least 100K Kuwa tokens.
// Written by: Deh-Jun Tzou
pragma solidity ^0.4.21;

import "./Owned.sol";

contract QualifiedKuwaRegistrar is Owned {
    
    uint public _totalStake;

    constructor() public {
        
    }

    function requestTokens(address _tokenContract, uint _value) public onlyOwner returns (bool success) {
        
    }
    
    function totalStake() public view returns (uint) {
        return _totalStake;
    }

    function vote(address _registrant, string _status) public {
        
    }
}