"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFusePoolData = void 0;
const getUSDPriceBN_1 = require("../../cjs/utils/getUSDPriceBN");
// Rari Utils
const constants_1 = require("../constants");
const filterPoolName_1 = require("./utils/filterPoolName");
const filterOnlyObjectProperties_1 = require("./utils/filterOnlyObjectProperties");
// Ethers
const ethers_1 = require("ethers");
const constants_2 = require("@ethersproject/constants");
const abi_1 = require("@ethersproject/abi");
const __1 = require("..");
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param poolId - The pool's assigned ID.
 * @param address - User's address.
 * @returns data of given pool.
 */
async function fetchFusePoolData(fuse, poolId, address) {
    if (!poolId)
        return undefined;
    const addressToUse = address === constants_1.EmptyAddress ? "" : address;
    const { comptroller, name: _unfiliteredName, } = await (0, __1.getPool)(this.provider, poolId, fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS);
    // Remove any profanity from the pool name
    let name = (0, filterPoolName_1.filterPoolName)(_unfiliteredName);
    let assets = (await (0, __1.getPoolAssetsWithData)(this.provider, fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS, comptroller)).map(filterOnlyObjectProperties_1.filterOnlyObjectProperties);
    let totalLiquidityUSD = constants_2.Zero;
    let totalSupplyBalanceUSD = constants_2.Zero;
    let totalBorrowBalanceUSD = constants_2.Zero;
    let totalSuppliedUSD = constants_2.Zero;
    let totalBorrowedUSD = constants_2.Zero;
    const ethPrice = 
    // prefer rari because it has caching
    await (0, getUSDPriceBN_1.getEthUsdPriceBN)();
    const comptrollerInterface = new abi_1.Interface([
        'function oracle() returns (address)',
        'function admin() returns (address)',
    ]);
    const comptrollerContract = new ethers_1.Contract(comptroller, comptrollerInterface, fuse.provider);
    let oracle = await comptrollerContract.callStatic.oracle();
    let oracleModel = await fuse.getPriceOracle(oracle);
    const admin = await comptrollerContract.callStatic.admin();
    for (let i = 0; i < assets.length; i++) {
        let asset = assets[i];
        asset.supplyBalanceUSD = asset.supplyBalance
            .mul(asset.underlyingPrice)
            .mul(ethPrice)
            .div(constants_2.WeiPerEther.pow(3));
        asset.borrowBalanceUSD = asset.borrowBalance
            .mul(asset.underlyingPrice)
            .mul(ethPrice)
            .div(constants_2.WeiPerEther.pow(3));
        totalSupplyBalanceUSD = totalSupplyBalanceUSD.add(asset.supplyBalanceUSD);
        totalBorrowBalanceUSD = totalBorrowBalanceUSD.add(asset.borrowBalanceUSD);
        asset.totalSupplyUSD = asset.totalSupply
            .mul(asset.underlyingPrice)
            .mul(ethPrice)
            .div(constants_2.WeiPerEther.pow(3));
        asset.totalBorrowUSD = asset.totalBorrow
            .mul(asset.underlyingPrice)
            .mul(ethPrice)
            .div(constants_2.WeiPerEther.pow(3));
        totalSuppliedUSD = totalSuppliedUSD.add(asset.totalSupplyUSD);
        totalBorrowedUSD = totalBorrowedUSD.add(asset.totalBorrowUSD);
        asset.liquidityUSD = asset.liquidity
            .mul(asset.underlyingPrice)
            .mul(ethPrice)
            .div(constants_2.WeiPerEther.pow(3));
        totalLiquidityUSD.add(asset.liquidityUSD);
    }
    return {
        assets: assets.sort((a, b) => (b.liquidityUSD.gt(a.liquidityUSD) ? 1 : -1)),
        comptroller,
        name,
        oracle,
        oracleModel,
        admin,
        totalLiquidityUSD,
        totalSuppliedUSD,
        totalBorrowedUSD,
        totalSupplyBalanceUSD,
        totalBorrowBalanceUSD,
    };
}
exports.fetchFusePoolData = fetchFusePoolData;
;
