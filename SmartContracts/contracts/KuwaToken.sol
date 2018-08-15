// ----------------------------------------------------------------------------
// 'Kuwa Token' token contract
//
// Symbol      : KUWA
// Name        : Kuwa Token
// Total supply: 1,000,000.000000000000000000
// Decimals    : 18
//
//
// Template originally by: (c) BokkyPooBah / Bok Consulting Pty Ltd 2018. The MIT License.
// ERC20 Standard reference: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
// Modified by Deh-Jun Tzou
// ----------------------------------------------------------------------------
pragma solidity ^0.4.24;

import "./ERC20Interface.sol";
import "./SafeMath.sol";
import "./Owned.sol";

// ----------------------------------------------------------------------------
// Contract function to receive approval and execute function in one call
//
// Borrowed from MiniMeToken
// ----------------------------------------------------------------------------
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}


// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a
// fixed supply
// ----------------------------------------------------------------------------
contract KuwaToken is ERC20Interface, Owned {
    using SafeMath for uint;

    string public symbol;
    string public  name;
    uint8 public decimals;
    uint _totalSupply;
    //uint _minStake;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() public {
        symbol = "KWA";
        name = "Kuwa Token";
        decimals = 18;
        _totalSupply = 1000000 * 10**uint(decimals);
        balances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
        //_minStake = 100000 * 10**uint(decimals);
    }


    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public view returns (uint) {
        return _totalSupply.sub(balances[address(0)]);
    }


    // ------------------------------------------------------------------------
    // Get the token balance for account `_owner`
    // ------------------------------------------------------------------------
    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }


    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to `_to` account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address _to, uint _value) public returns (bool success) {
        require(_value <= balances[msg.sender]);
        require(_to != address(0));

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }


    // ------------------------------------------------------------------------
    // Transfer `_value` tokens from the `_from` account to the `_to` account
    // 
    // The calling account must already have sufficient _value approve(...)-d
    // for spending from the `_from` account and
    // - `_from` account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        require(_to != address(0));

        balances[_from] = balances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `_spender` to transferFrom(...) `_value` 
    // tokens from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces 
    // ------------------------------------------------------------------------
    function approve(address _spender, uint _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address _owner, address _spender) public view returns (uint remaining) {
        return allowed[_owner][_spender];
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `_spender` to transferFrom(...) `_value`
    // tokens from the token owner's account. The `_spender` contract function
    // `receiveApproval(...)` is then executed
    // TODO: Understand this!
    // ------------------------------------------------------------------------
    function approveAndCall(address _spender, uint _value, bytes _data) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        ApproveAndCallFallBack(_spender).receiveApproval(msg.sender, _value, this, _data);
        return true;
    }


    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () public payable {
        revert();
    }


    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // TODO: Understand this!
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address _tokenAddress, uint _tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(_tokenAddress).transfer(owner, _tokens);
    }
    
    
    /* For debugging and testing */
    address public sender;
    function dummy() public {
        sender = msg.sender;
    }
}