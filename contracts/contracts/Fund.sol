pragma solidity ^0.4.17;

import "./KillableByServer.sol";

// Fund is the primary storage contract for ether originating from users
contract Fund is KillableByServer {
    // the direction of a deposit (deposit vs withdrawl)
    enum TransactionDirection { Deposit, Withdraw }

    // Deposit is a record kept of a deposit by a particular github user
    struct Transaction {
        address account; // references the github account name
        string projectName; // the name of the project associated with the transaction (nullable)
        TransactionDirection direction; // wether the user put money into the fund or took it out
        uint amount; // the amount of ether moved by the transaction
        uint time; // the time that the transaction took place
        uint balance; // the balance of the contract after the transaction
    }

    // an event to get notified of new deposits/withdrawls
    event NewContractTransaction (
        address account,
        string project,
        TransactionDirection direction,
        uint amount,
        uint time,
        uint balance
    );

    // the list of Deposits that this fund has recieved (singular name is to accomodate auto generated methods by compiler)
    Transaction[] public transaction;
    // we can't use the automatically generated getters because we need the full list
    function numberOfTransactions() public view returns (uint256) {
        return transaction.length;
    }

    // make sure we bubble up the constructors
    function Fund(address _server) KillableByServer(_server) public payable {
        // register a deposit to the fund
        _onTransaction(TransactionDirection.Deposit, msg.sender, msg.value, "");
    }

    // invoked when the fund recieves a deposit
    function deposit() public payable {
        // register a deposit to the fund
        _onTransaction(TransactionDirection.Deposit, msg.sender, msg.value, "");
    }

    // invoked by the server to transfer ether from the fund to the recipient
    // after they have provided proof of work
    function transferReward(address recipient, string project, uint amount) public onlyTrusted {
        // transfer the designated amount to the recipient
        recipient.transfer(amount);

        // withdraw from the fund and transfer it to the recipient
        _onTransaction(TransactionDirection.Withdraw, recipient, amount, project);
    }

    // internally invoked every time a transaction occurs
    function _onTransaction(TransactionDirection direction, address account, uint amount, string project ) private {
        // the time of the transaction
        uint time = now;

        // add a record of the transfer to the transaction history
        transaction.push(Transaction({
          account: account,
          projectName: project,
          direction: direction,
          amount: amount,
          time: time,
          balance: this.balance
        }));

        // trigger the events
        NewContractTransaction(
            account,
            project,
            direction,
            amount,
            time,
            this.balance
        );
    }
}
