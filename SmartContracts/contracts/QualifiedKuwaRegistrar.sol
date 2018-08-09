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

    function vote(address _registrantContract, bytes32 commit, uint _value) public onlyOwner returns(bool) {
        require(_value == 1);

        KuwaToken kt = KuwaToken(kuwaTokenContract);
        if (kt.allowance(this, _registrantContract) < 1) {
            if (!kt.approve(_registrantContract, _value))
                return false;
        }

        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        if (!kr.vote(commit)) {
            if (!kt.approve(_registrantContract, 0))
                return false;
        }

        return true;
    }
    
    function reveal(address _registrantContract, uint _vote, bytes32 _salt) public onlyOwner returns(bool) {
        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        kr.reveal(_vote, _salt);
    }
    
    
    /* For debugging and testing */
    function approve(address _registrantContract, uint _value) public payable {
        KuwaToken kt = KuwaToken(kuwaTokenContract);
        kt.approve(_registrantContract, _value);
    }

    function transferTokens(address _registrantContract, uint _value) public {
        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        kr.transferTokens(_value);
    }
    
    function transferFromTokens(address _registrantContract, uint _value) public {
        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        kr.transferFromTokens(_value);
    }

    bytes32 public commit;
    function getHash(uint _vote, bytes32 _salt) public returns(bytes32) {
        commit = keccak256(_vote, _salt);
        return commit;
    }
}