pragma solidity ^0.4.17;

// this contract is used for testing purposes. It excersises all of the infrastructure necessary
// for developing the Fund contract
contract Counter {
    uint public state;

    event Deposit(uint amount);

    function Counter() public payable {
      state = state + msg.value;
      Deposit(msg.value);
    }

    function deposit() public payable {
      state = state + msg.value;
      Deposit(msg.value);
    }
}