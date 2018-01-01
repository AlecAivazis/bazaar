pragma solidity ^0.4.17;

import './KillableByServer.sol';

contract TestKillable is KillableByServer {

  function TestKillable(address _server) KillableByServer(_server) public {}

  function test() onlyTrusted view public {}
}
