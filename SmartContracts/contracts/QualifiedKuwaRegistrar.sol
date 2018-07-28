// Contract that a Qualified Kuwa Registrar will deploy.
// Registrars are required to stake at least 100K Kuwa tokens.
// Written by: Deh-Jun Tzou
pragma solidity ^0.4.24;

import "./Owned.sol";
import "./KuwaToken.sol";
import "./KuwaRegistration.sol";

contract QualifiedKuwaRegistrar is Owned {
    
    uint public _totalStake;
    address public kuwaTokenContract;
    //address public kuwaFoundation;

    constructor(address _kuwaTokenContract/*, address _kuwaFoundation*/) public {
        kuwaTokenContract = _kuwaTokenContract;
        //kuwaFoundation = _kuwaFoundation;
    }

    function myAddress() public view returns(address) {
        return this;
    }

    function vote(address _registrantContract, string status, uint _value) public onlyOwner returns(bool) {
        require(_value == 1);

        KuwaToken kt = KuwaToken(kuwaTokenContract);
        if (kt.allowance(myAddress(), _registrantContract) < 1) {
            if (!kt.approve(_registrantContract, _value))
                return;
        }
        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        return kr.vote(status);
    }
}