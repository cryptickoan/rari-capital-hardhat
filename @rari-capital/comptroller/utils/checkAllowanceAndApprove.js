"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowanceAndApprove = void 0;
// Ethers
const constants_1 = require("@ethersproject/constants");
const bignumber_1 = require("@ethersproject/bignumber");
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
/**
 * @param userAddress - Address of user to check allowance for.
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
async function checkAllowanceAndApprove(userAddress, marketAddress, underlyingAddress, amount, provider) {
    const erc20Interface = new abi_1.Interface([
        'function allowance(address owner, address spender) public view returns (uint256 remaining)',
        'function approve(address spender, uint256 value) public returns (bool success)',
    ]);
    const erc20Contract = new contracts_1.Contract(underlyingAddress, erc20Interface, provider.getSigner(userAddress));
    const hasApprovedEnough = (await erc20Contract.callStatic.allowance(userAddress, marketAddress)).gte(amount);
    if (!hasApprovedEnough) {
        const max = bignumber_1.BigNumber.from(2).pow(bignumber_1.BigNumber.from(256)).sub(constants_1.One); //big fucking #
        await erc20Contract.approve(marketAddress, max);
    }
}
exports.checkAllowanceAndApprove = checkAllowanceAndApprove;
