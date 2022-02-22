"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicPoolsByVerification = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @returns - Async function call to get al available pools.
 */
async function getPublicPoolsByVerification(provider, fuse) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function getAllPools(address) view returns (uint256[], tuple[])'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryInterface, provider);
    return fuse.contracts.FusePoolDirectory.getPublicPoolsByVerification(false);
}
exports.getPublicPoolsByVerification = getPublicPoolsByVerification;
