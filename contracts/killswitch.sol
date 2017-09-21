pragma solidity ^0.4.11;

contract Owned {
    // when the contract is created save the spawning user as the owner
    function Owned() { owner = msg.sender; }
    address owner;

    // onlyOwner modifier limits a method to only be executed by the owner
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}


// Mortal adds a killswitch enabled only for the spawning user
contract Mortal is Owned {
    // kill destroys the running contract (limited to the owner)
    function kill() onlyOwner {
        selfdestruct(owner);
    }
}
