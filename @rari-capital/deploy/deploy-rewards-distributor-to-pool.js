"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployRdToPool = void 0;
// Colors
const colors_1 = __importDefault(require("colors"));
// Function
const comptroller_1 = require("../comptroller");
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param underlying - Address of token to distribute. i.e for DAI 0x6b175474e89094c44da98b954eedeac495271d0f.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 * @param address - Optional. If present it'll be used as the address that deploys the reward distributor.
 */
async function deployRdToPool(fuse, underlying, comptrollerAddress, comptrollerAdmin, address) {
    console.info(colors_1.default.green("Initiating rewards distributor deployment."));
    // 1. Deploy Rd
    const deployedDistributor = await fuse.deployRewardsDistributor(underlying, {
        from: address !== null && address !== void 0 ? address : comptrollerAdmin,
    });
    console.info(colors_1.default.green("Deployment successful!"));
    console.table({ contract: "Rewards distributor", address: deployedDistributor.address });
    // 2. Add to pool
    await (0, comptroller_1.addRdToPool)(fuse, deployedDistributor.address, comptrollerAddress, comptrollerAdmin);
}
exports.deployRdToPool = deployRdToPool;
