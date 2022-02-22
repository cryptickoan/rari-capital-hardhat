"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = void 0;
// Ethers
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("@ethersproject/abi");
// Utils
const filterOnlyObjectProperties_1 = require("../fetch-data/utils/filterOnlyObjectProperties");
/**
 * @param provider - An initiated ethers provider.
 * @param id - The pool id.
 * @param directoryAddress - Fuse Directory address.
 * @returns - Object with following properties: name: string, creator: address, comptroller: address, blockPosted: bn, timestampPosted: bn.
 */
async function getPool(provider, id, directoryAddress) {
    const fusePoolDirectoryInterface = new abi_1.Interface([
        'function pools(uint256) view returns (string name, address creator, address comptroller, uint256 blockPosted, uint256 timestampPosted)'
    ]);
    const fusePoolDirectoryContract = new contracts_1.Contract(directoryAddress, fusePoolDirectoryInterface, provider);
    const poolInformation = await fusePoolDirectoryContract.callStatic.pools(id);
    const parsedPoolInformation = (0, filterOnlyObjectProperties_1.filterOnlyObjectProperties)(poolInformation);
    return parsedPoolInformation;
}
exports.getPool = getPool;
