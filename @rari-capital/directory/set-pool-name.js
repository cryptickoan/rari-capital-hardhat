"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPoolName = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @param id - Id of pool to update.
 * @param name - New name for the pool.
 * @returns - Async function call to get all public pools.
 */
function setPoolName(provider, fuse, id, name) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function setPoolName(uint256 index, string calldata name) external'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryInterface, provider.getSigner());
    return fusePoolDirectoryContract.setPoolName(id, name);
}
exports.setPoolName = setPoolName;
