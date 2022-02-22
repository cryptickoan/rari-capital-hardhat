"use strict";
/**
 * This is a class that will hold all necessary calls to load and interact with your fuse pool.
 *  - Get Fuse Pool information
 *      - Available rewards distributors.
 *      - Users summary
 *      - Name,
 *      - comptroller address,
 *      - admin address,
 *      - close factor
 *      - liquidation incentive.
 *      - Available markets.
 *      - Master Price Oracle address
 *  - Get data for available markets.
 *      - Market's oracle address, and model.
 *      - CToken address
 *      - Totals (supply, borrow) tailored to the incoming user.
 *      - Market's irm model
 *
 *  - Interact with market
 *      - Supply/borrow/repay/withdraw.
 *
 *
 */
const __1 = require("..");
const MyPool = function (provider, comptroller) {
    const addresses = getAddresses("1");
    const instance = {
        _provider: provider,
        comptroller,
        addresses,
    };
    return instance;
};
MyPool.fetchFusePoolData = { fetchFusePoolData: __1.fetchFusePoolData };
function getAddresses(id) {
    const FUSE_POOL_DIRECTORY_ADDRESS = id === "1" ? "0x835482FE0532f169024d5E9410199369aAD5C77E" : "0xc201b8c8dd22c779025e16f1825c90e1e6dd6a08";
    return FUSE_POOL_DIRECTORY_ADDRESS;
}
module.exports = MyPool;
