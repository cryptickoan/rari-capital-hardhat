"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecimals = void 0;
const abi_1 = require("@ethersproject/abi");
const contracts_1 = require("@ethersproject/contracts");
function getDecimals(tokenAddress, provider) {
    const erc20Interface = new abi_1.Interface([
        'function decimals() public view returns (uint8)'
    ]);
    const erc20Contract = new contracts_1.Contract(tokenAddress, erc20Interface, provider.getSigner());
    return erc20Contract.callStatic.decimals();
}
exports.getDecimals = getDecimals;
