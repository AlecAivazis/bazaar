pragma solidity ^0.4.17;


// Mortal adds a killswitch enabled only for the spawning user
contract KillableByServer {

    // the address to accept withdrawl requests from (implicitly trusted)
    address _trustedAddress;

    // we must be passed an address when contstructed so we know who to accept
    // commands from
    function KillableByServer(address server) public {
        _trustedAddress = server;
    }

    // restrict actions to only trusted actors
    modifier onlyTrusted {
        require(msg.sender == _trustedAddress);
        _;
    }

    // kill destroys the running contract (limited to the owner)
    function kill() public onlyTrusted {
        selfdestruct(_trustedAddress);
    }
}
