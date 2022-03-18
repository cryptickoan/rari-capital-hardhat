"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolAssetsWithData = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @param comptrollerAddress - Comptroller to look for.
 * @returns - Async function call to get all public pools.
 */
function getPoolAssetsWithData(provider, fuseLensAddress, comptrollerAddress) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function getPoolAssetsWithData(address comptroller) external returns ( tuple(address cToken, address underlyingToken, string underlyingName, string underlyingSymbol, uint256 underlyingDecimals, uint256 underlyingBalance, uint256 supplyRatePerBlock, uint256 borrowRatePerBlock, uint256 totalSupply, uint256 totalBorrow, uint256 supplyBalance, uint256 borrowBalance, uint256 liquidity, bool membership, uint256 exchangeRate, uint256 underlyingPrice, address oracle, uint256 collateralFactor, uint256 reserveFactor, uint256 adminFee, uint256 fuseFee, bool borrowGuardianPaused)[] )'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(fuseLensAddress, fusePoolDirectoryInterface, provider);
    return fusePoolDirectoryContract.callStatic.getPoolAssetsWithData(comptrollerAddress);
}
exports.getPoolAssetsWithData = getPoolAssetsWithData;
