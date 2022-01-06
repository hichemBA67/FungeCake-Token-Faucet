pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FungeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("FungeCake Token", "FGC") {
        _mint(msg.sender, initialSupply);
    }
}