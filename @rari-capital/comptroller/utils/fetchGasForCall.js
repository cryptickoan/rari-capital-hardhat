"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGasForCall = void 0;
// Ethers
const bignumber_1 = require("@ethersproject/bignumber");
const constants_1 = require("@ethersproject/constants");
/**
 *
 * @param call - Function call to calculate gas for.
 * @param amountBN - Amount of ETH to send.
 * @param fuse - An initiated Fuse instance.
 * @param address - User's address
 * @returns - { Estimated gas needed for transaction, gasPrice per gas, gasWei total gas in wei. }
 */
const fetchGasForCall = async (call, amountBN, fuse, address) => {
    var _a;
    console.log("HJERE", amountBN.div(2).toString());
    const estimatedGas = bignumber_1.BigNumber.from(((await call({
        from: address,
        // Cut amountBN in half in case it screws up the gas estimation by causing a fail in the event that it accounts for gasPrice > 0 which means there will not be enough ETH (after paying gas)
        value: amountBN.div(2),
    })) *
        // 50% more gas for limit:
        5).toFixed(0));
    console.log("EST");
    const gasInfo = await fuse.provider.getFeeData();
    const gasPrice = gasInfo.maxFeePerGas;
    const gasWEI = gasPrice
        ? estimatedGas
            .mul(gasPrice)
            .add((_a = gasInfo.maxPriorityFeePerGas) !== null && _a !== void 0 ? _a : constants_1.Zero)
        : null;
    return { gasWEI, gasPrice, estimatedGas };
};
exports.fetchGasForCall = fetchGasForCall;
