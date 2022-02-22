"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployPrivatePool = void 0;
const units_1 = require("@ethersproject/units");
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment, passed from task.
 * @param address - User's address.
 */
async function deployPrivatePool(fuse, address) {
    // 1. Deploy Price Oracle
    const priceOracleAddress = await fuse.deployPriceOracle("MasterPriceOracle", {
        underlyings: [],
        oracles: [],
        canAdminOverwrite: true,
        defaultOracle: fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES
            .MasterPriceOracle, // We give the MasterPriceOracle a default "fallback" oracle of the Rari MasterPriceOracle
    }, { from: address });
    // 2. Construct arguments needed for deployment.
    const closeFactor = 50;
    const liquidationIncentive = 8;
    // 50% -> 0.5 * 1e18
    const bigCloseFactor = (0, units_1.parseUnits)((closeFactor / 100).toString());
    // 8% -> 1.08 * 1e8
    const bigLiquidationIncentive = (0, units_1.parseUnits)((liquidationIncentive / 100 + 1).toString());
    const isWhitelisted = false;
    // 3. Deploy Pool
    const [_poolAddress] = await fuse.deployPool("Test Pool", true, bigCloseFactor, bigLiquidationIncentive, priceOracleAddress, {}, {
        from: address
    }, [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0xfff826d97AC92459975bE8FcE9cE91fF850fe045"
    ]);
    return _poolAddress;
}
exports.deployPrivatePool = deployPrivatePool;
