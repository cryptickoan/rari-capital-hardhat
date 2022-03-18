"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCTokenData = void 0;
const abi_1 = require("@ethersproject/abi");
const contracts_1 = require("@ethersproject/contracts");
/**
 * @param cTokenAddress - The CToken address to look for.
 * @param comptrollerAddress - The comptroller address that the cToken is managed by.
 * @param provider - An initiated ethers provider.
 * @returns
 */
const fetchCTokenData = async (cTokenAddress, comptrollerAddress, provider) => {
    const cTokenDataInterface = new abi_1.Interface([
        'function adminFeeMantissa() external view returns (uint256)',
        'function reserveFactorMantissa() external view returns (uint256)',
        'function interestRateModel() external view returns (address)'
    ]);
    const comptrollerInterface = new abi_1.Interface([
        'function markets(address cToken) external view returns (bool, uint)',
        'function borrowGuardianPaused(address cToken) external view returns (bool)'
    ]);
    const cToken = new contracts_1.Contract(cTokenAddress, cTokenDataInterface, provider);
    const comptroller = new contracts_1.Contract(comptrollerAddress, comptrollerInterface, provider);
    const [adminFeeMantissa, reserveFactorMantissa, interestRateModelAddress, answer, isPaused,] = await Promise.all([
        cToken.callStatic.adminFeeMantissa(),
        cToken.callStatic.reserveFactorMantissa(),
        cToken.callStatic.interestRateModel(),
        comptroller.callStatic.markets(cTokenAddress),
        comptroller.callStatic.borrowGuardianPaused(cTokenAddress),
    ]);
    const obj = {
        reserveFactorMantissa,
        adminFeeMantissa,
        collateralFactorMantissa: answer[1],
        interestRateModelAddress,
        cTokenAddress,
        isPaused,
    };
    return obj;
};
exports.fetchCTokenData = fetchCTokenData;
