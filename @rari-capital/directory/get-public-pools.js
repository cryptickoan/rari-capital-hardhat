"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicPools = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @returns - Async function call to get all public pools.
 */
function getPublicPools(provider, fuse) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function getPoolsByAccount(address) view returns (uint256[], tuple(string name, address creator, address comptroller, uint256 blockPosted, uint256 timePosted) FusePool)'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryInterface, provider);
    // return fusePoolDirectoryContract.callStatic.getPoolsByAccount(address)
    return fuse.contracts.FusePoolDirectory.getPublicPools();
}
exports.getPublicPools = getPublicPools;
