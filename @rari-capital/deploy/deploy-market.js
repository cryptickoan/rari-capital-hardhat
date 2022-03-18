"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployMarket = void 0;
// Ethers
const units_1 = require("@ethersproject/units");
const constants_1 = require("@ethersproject/constants");
/**
 * @param fuse - An initiated Fuse instance
 * @param comptrollerAddress - The comptroller's address.
 * @param address - The user's address, has to be comptroller admin.
 * @param underlyingAsset - The underlying asset's address. i.e "0xa0b8..48" for USDC.
 * @param collateralFactor - Determines loan to value ratio. i.e. how much of collateral value can be borrowed. Should be between 0 - 1.
 * @param reserveFactor - Determines percentage for reserves. Should be between 0 - 1.
 * @param adminFee - Determines percentage for admin fees. Should be between 0 - 1.
 */
async function deployMarket(fuse, comptrollerAddress, address, underlyingAsset, collateralFactor, // 0.5
reserveFactor, // 0.1
adminFee // 0.05
) {
    // 1. Construct necessary arguments.
    // Convert numbers into BigNumbers
    const bigCollateralFactor = (0, units_1.parseEther)(collateralFactor.toString())
        .div(100)
        .toString();
    // 10% -> 0.1 * 1e18
    const bigReserveFactor = (0, units_1.parseEther)(reserveFactor.toString())
        .div(100)
        .toString();
    // 5% -> 0.05 * 1e18
    const bigAdminFee = (0, units_1.parseEther)(adminFee.toString()).div(100).toString();
    // Interest Rate Model address
    const interestRateModel = fuse.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES.JumpRateModel_Compound_Stables;
    const poolID = 1;
    const conf = {
        underlying: underlyingAsset,
        comptroller: comptrollerAddress,
        interestRateModel,
        initialExchangeRateMantissa: constants_1.WeiPerEther,
        // Ex: BOGGED USDC
        name: "Test Pool" + " " + " DAI",
        // Ex: fUSDC-456
        symbol: "fDAI" + "-" + poolID,
        decimals: 8,
    };
    // 2. Deploy asset.
    const asset = await fuse.deployAsset(conf, bigCollateralFactor, bigReserveFactor, bigAdminFee, { from: address }, 
    // TODO: Disable this. This bypasses the price feed check. Only using now because only trusted partners are deploying assets.
    true);
}
exports.deployMarket = deployMarket;
