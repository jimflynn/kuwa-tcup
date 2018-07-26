// Contract that a Qualified Kuwa Registrar will deploy.
// Registrars are required to stake at least 100K Kuwa tokens.
// Written by: Deh-Jun Tzou
pragma solidity ^0.4.21;

import "./Owned.sol";
import "./KuwaToken.sol";
import "../contracts/KuwaRegistration.sol";

contract QualifiedKuwaRegistrar is Owned {
    
    uint public _totalStake;
    address public kuwaTokenContract;
    address public kuwaFoundation;

    constructor(address _kuwaTokenContract, address _kuwaFoundation) public {
        kuwaTokenContract = _kuwaTokenContract;
        kuwaFoundation = _kuwaFoundation;
    }

    function myAddress() public view returns(address) {
        return this;
    }

    function vote(address _registrantContract, string status, uint _value) public onlyOwner {
        require(_value == 1);

        KuwaToken kt = KuwaToken(kuwaTokenContract);
        if (!kt.approve(_registrantContract, _value))
            return;
        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        kr.vote(status);
    }
}