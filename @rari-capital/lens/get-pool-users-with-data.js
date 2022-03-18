"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolUsersWithData = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
const units_1 = require("@ethersproject/units");
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @param address - User address to look for.
 * @returns - Async function call to get all public pools.
 */
function getPoolUsersWithData(provider, fuse, comptrollerAddress, maxHealth) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function setPoolName(uint256 index, string calldata name) external'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS, fusePoolDirectoryInterface, provider);
    const bigMaxHealth = (0, units_1.parseEther)(maxHealth);
    return fuse.contracts.FusePoolLens.callStatic['getPoolUsersWithData(address,uint256)'](comptrollerAddress, bigMaxHealth);
}
exports.getPoolUsersWithData = getPoolUsersWithData;
