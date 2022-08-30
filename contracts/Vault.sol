// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    address tokenAddress;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }
     
    event tokenDepositComplete(address tokenAddress, uint256 amount);

    function depositToken( uint256 amount) public  {
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= amount, "Your token amount must be greater then you are trying to deposit");
        require(IERC20(tokenAddress).approve(address(this), amount), "Approval failed");
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount), "Transaction failed");
        emit tokenDepositComplete(tokenAddress, amount);
    }

    event tokenWithdrawalComplete(address tokenAddress, uint256 amount);

    function withDrawAmount(uint256 amount) public onlyOwner{
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount, "The vault does not have enough token to withdraw");
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "the transfer failed");
        emit tokenWithdrawalComplete(tokenAddress, amount);
    }

    function retrieve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

}