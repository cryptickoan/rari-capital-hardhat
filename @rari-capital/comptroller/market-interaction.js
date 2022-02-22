"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketInteraction = void 0;
// Ethers
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
const units_1 = require("@ethersproject/units");
// Fuse SDK
const testForCTokenErrorAndSend_1 = require("./utils/testForCTokenErrorAndSend");
const getDecimals_1 = require("./utils/getDecimals");
/**
 * @param action - Type of action to perform. i.e borrow, withdraw, repay.
 * @param cTokenAddress - Address of market to withdraw from.
 * @param amount - The amount to withdraw.
 * @param provider - An initiated ethers provider.
 * @param tokenAddress - Address of the market's underlying asset.
 * @param decimals - Underlying token's decimals. i.e DAI = 18.
 */
async function marketInteraction(action, cTokenAddress, amount, provider, tokenAddress, decimals) {
    // 1. Initiate market/ctoken contract.
    const cTokenInterface = new abi_1.Interface([
        'function redeemUnderlying(uint redeemAmount) external returns (uint)',
        'function borrow(uint borrowAmount) returns (uint)',
        'function repayBorrow(uint repayAmount) returns (uint)',
        'function repayBorrow() payable',
        'function mint() payable',
        'function mint(uint mintAmount) returns (uint)'
    ]);
    const cTokenContract = new contracts_1.Contract(cTokenAddress, cTokenInterface, provider.getSigner());
    // 2. Parse given amount to the underlying asset's notation.
    // Fetch decimals if not given.
    if (!decimals && tokenAddress != '0') {
        decimals = await (0, getDecimals_1.getDecimals)(tokenAddress, provider);
    }
    const parsedAmount = decimals === 18 || tokenAddress === '0'
        ? (0, units_1.parseEther)(amount)
        : (0, units_1.parseUnits)(amount, decimals);
    switch (action) {
        case 'withdraw':
            await (0, testForCTokenErrorAndSend_1.testForCTokenErrorAndSend)(cTokenContract.callStatic.redeemUnderlying, parsedAmount, cTokenContract.redeemUnderlying, "Cannot withdraw this amount right now!");
            break;
        case 'borrow':
            await (0, testForCTokenErrorAndSend_1.testForCTokenErrorAndSend)(cTokenContract.callStatic['borrow(uint256)'], parsedAmount, cTokenContract['borrow(uint256)'], "Cannot borrow this amount right now!");
            break;
        case 'repay':
            if (tokenAddress !== '0') {
                await (0, testForCTokenErrorAndSend_1.testForCTokenErrorAndSend)(cTokenContract.callStatic['repayBorrow(uint256)'], parsedAmount, cTokenContract['repayBorrow(uint256)'], "Cannot repay this amount right now!");
            }
            else {
                await cTokenContract['repayBorrow()']({
                    value: parsedAmount,
                });
            }
            break;
        case 'supply':
            if (tokenAddress !== '0') {
                await (0, testForCTokenErrorAndSend_1.testForCTokenErrorAndSend)(cTokenContract.callStatic['mint(uint256)'], parsedAmount, cTokenContract['mint(uint256)'], "Cannot deposit this amount right now!");
            }
            else {
                await cTokenContract['mint()']({
                    value: parsedAmount
                });
            }
            break;
        default:
            break;
    }
}
exports.marketInteraction = marketInteraction;
