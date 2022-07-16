// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IBank {
    struct Account {
        address owner;
        uint256 balance;
        bool isExisted;
    }
    event CreateAccount(string indexed name, address indexed _owner);
    event Deposit(address indexed from, string indexed to, uint256 indexed amount);
    event Withdraw(string indexed from, address indexed to, uint256 indexed amount);
    event BankTransfer(string indexed from, string indexed to, uint256 indexed amount);

    function _CreateAccount(string memory _name) external;
    function deposit(string memory _to, uint256 _amount) external;
    function withdraw(string memory _to, uint256 _amousnt) external;

    function bankTransfer(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) external;

    function batchBankTransfer(
        string memory _from,
        string[] memory _to,
        uint256[] memory _amount
    ) external;

    function getOwnAccount(address _owner) external view returns (string[] memory);
    function getAccount(string memory _name) external view returns (Account memory);
}

contract Bank is ERC20, IBank, Ownable, ReentrancyGuard {


    mapping(string => Account) public accounts;
    mapping(address => string[]) public ownAccounts;

    constructor(uint256 initialSupply) ERC20("DAIToken", "DAI") {
        _mint(msg.sender, initialSupply);
    }


    function _isExisted(string memory name) internal view returns (bool) {
        return accounts[name].isExisted;
    }

    function _CreateAccount(string memory _name) external override {
        require(!_isExisted(_name), "Account already exists");
        accounts[_name].isExisted = true;
        accounts[_name].balance = 0;
        accounts[_name].owner = msg.sender;
        ownAccounts[msg.sender].push(_name);
        emit CreateAccount(_name, msg.sender);
    }

    function deposit(string memory _to, uint256 _amount) external override nonReentrant {
        require(_amount >= 0, "invalid _amount");
        require(_isExisted(_to), "Account does not exist");
        require(msg.sender == accounts[_to].owner, "You are not the owner of this account");
        accounts[_to].balance += _amount;
        emit Deposit(msg.sender, _to, _amount);
    }

    function withdraw(string memory _from, uint256 _amount) external override nonReentrant {
        require(_amount >= 0, "invalid _amount");
        require(_isExisted(_from), "Account does not exist");
        require(msg.sender == accounts[_from].owner, "You are not the owner of this account");
        require(accounts[_from].balance >= _amount, "You don't have enough tokens");
        accounts[_from].balance -= _amount;
        emit Withdraw(_from, msg.sender, _amount);
    }

    function bankTransfer(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) external override nonReentrant {
        _bankTransfer(_from, _to, _amount);
    }

    function _bankTransfer(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) internal {
        require(_amount >= 0, "invalid _amount");
        require(_isExisted(_from), "Account does not exist");
        require(_isExisted(_to), "Destination account does not exist");
        require(msg.sender == accounts[_from].owner, "You are not the owner of this account");
        require(accounts[_from].balance >= _amount, "You don't have enough tokens");

        uint256 estimateAmount;

        if (msg.sender != accounts[_to].owner) {
            uint256 fee = (_amount * 1) / 100;
            estimateAmount = _amount - fee;
        } else {
            estimateAmount = _amount;
        }

        accounts[_from].balance -= _amount;
        accounts[_to].balance += estimateAmount;
        emit BankTransfer(_from, _to, _amount);
    }

    function batchBankTransfer(
        string memory _from,
        string[] memory _to,
        uint256[] memory _amounts
    ) external override nonReentrant {
        require(_to.length == _amounts.length, "Arrays must have the same length");
        for (uint256 i = 0; i < _to.length; i++) {
            _bankTransfer(_from, _to[i], _amounts[i]);
        }
    }

    function getOwnAccount(address _owner) external view override returns (string[] memory) {
        return ownAccounts[_owner];
    }

    function getAccount(string memory _name) external view override returns (Account memory) {
        return accounts[_name];
    }
    receive() external payable {}
}