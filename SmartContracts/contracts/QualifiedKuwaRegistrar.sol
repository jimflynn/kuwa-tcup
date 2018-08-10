// Contract that a Qualified Kuwa Registrar will deploy.
// Registrars are required to stake at least 100K Kuwa tokens 
// to be qualified to vote on the validity of a Kuwa client.
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

    /**
        To facilitate an anonymous voting process, registrars commit a vote by taking the 
        keccak256() of a vote and a salt.
        The vote is an unsigned integer of two allowed values: 0 (Invalid), 1 (Valid)
        The salt is a random 32-byte value in hex: "0x12ac34.."
        
        @param _registrantContract The address of the a client's Kuwa Registration contract
        @param _commit The hash of the vote and a salt
        @param _value the ante provided 
        @return Whether the vote was successful or not
    **/
    function vote(address _registrantContract, bytes32 _commit, uint _value) public onlyOwner returns(bool) {
        require(_value == 1);

        /* The Registrar must approve the Kuwa Registration contract to spend 1 Kuwa Token from its QKR contract
            balance in the Kuwa Token contract as required by the initial ante process. */
        KuwaToken kt = KuwaToken(kuwaTokenContract);
        if (kt.allowance(this, _registrantContract) < 1) {
            if (!kt.approve(_registrantContract, _value))
                return false;
        }

        KuwaRegistration kr = KuwaRegistration(_registrantContract);
        if (!kr.vote(_commit)) {
            if (!kt.approve(_registrantContract, 0))
                return false;
        }

        return true;
    }
    
    /**
        Registrars will reveal their votes after the voting process by providing the original
        vote and salt that were inputs to the keccak256().

        @param _registrantContract The address of the a client's Kuwa Registration contract
        @param _vote The original vote (0 for Invalid, 1 for Valid)
        @param _salt The random 32-byte value in hex
        @return Whether the reveal was successful or not
     */
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