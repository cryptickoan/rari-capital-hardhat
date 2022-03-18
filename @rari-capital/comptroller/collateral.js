"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collateral = void 0;
// Ethers
const abi_1 = require("@ethersproject/abi");
const contracts_1 = require("@ethersproject/contracts");
/**
 * @param comptrollerAddress - Address of the comptroller where the market is listed.
 * @param marketAddress - Address of market to interact with.
 * @param actionType - Enter or exit.
 * @param provider - An initiated ethers provider.
 */
async function collateral(comptrollerAddress, marketAddress, action, provider) {
    const comptrollerInterface = new abi_1.Interface([
        'function enterMarkets(address[] calldata cTokens) external returns (uint[] memory)',
        'function exitMarket(address cTokenAddress) external returns (uint) '
    ]);
    const comptrollerContract = new contracts_1.Contract(comptrollerAddress, comptrollerInterface, provider.getSigner());
    // Don't await this, we don't care if it gets executed first!
    if (action === "enter") {
        await comptrollerContract.enterMarkets(marketAddress);
    }
    else {
        await comptrollerContract.exitMarket(marketAddress);
    }
}
exports.collateral = collateral;
