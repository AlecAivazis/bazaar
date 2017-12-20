pragma solidity ^0.4.17;

contract Owned {
    // when the contract is created save the spawning user as the owner
    function Owned() public { owner = msg.sender; }
    address owner;

    // onlyOwner modifier limits a method to only be executed by the owner
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}