"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRdToPool = void 0;
// Colors
const colors_1 = __importDefault(require("colors"));
const contracts_1 = require("@ethersproject/contracts");
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment passed from task.
 * @param RdAddress - Rewards distributor's address.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 */
async function addRdToPool(fuse, rdAddress, comptrollerAddress, comptrollerAdmin) {
    // 1. Initiate comptroller contract.
    const functionInterface = [
        'function _addRewardsDistributor(address RdAddress)'
    ];
    const comptrollerContract = new contracts_1.Contract(comptrollerAddress, functionInterface, fuse.provider.getSigner(comptrollerAdmin));
    // 2. Add rd to comptroller.
    await comptrollerContract._addRewardsDistributor(rdAddress);
    console.info(colors_1.default.green("Comptroller configuration successful. Rewards distributor was added to your pool"));
}
exports.addRdToPool = addRdToPool;
