pragma solidity ^0.4.17;

import "./Owned.sol";

// Mortal adds a killswitch enabled only for the spawning user
contract Mortal is Owned {
    // kill destroys the running contract (limited to the owner)
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}
