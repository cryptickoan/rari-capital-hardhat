// Ethers
import { parseEther } from '@ethersproject/units';
import { WeiPerEther } from '@ethersproject/constants'

// Types
import { Fuse } from '../../../cjs/index';

/**
 * @param fuse - An initiated Fuse instance
 * @param comptrollerAddress - The comptroller's address.
 * @param address - The user's address, has to be comptroller admin.
 * @param underlyingAsset - The underlying asset's address. i.e "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" for USDC.
 * 
 */
export async function deployMarket(
  fuse: Fuse,
  comptrollerAddress: string, 
  address: string,
  underlyingAsset: string,
  collateralFactor: number, // 0.5
  reserveFactor: number, // 0.1
  adminFee: number // 0.05
) {
  // 1. Construct necessary arguments.
    // Convert numbers into BigNumbers
    const bigCollateralFactor = parseEther(collateralFactor.toString())
      .div(100)
      .toString();

    // 10% -> 0.1 * 1e18
    const bigReserveFactor = parseEther(reserveFactor.toString())
      .div(100)
      .toString();

    // 5% -> 0.05 * 1e18
    const bigAdminFee = parseEther(adminFee.toString()).div(100).toString();

    // Interest Rate Model address
    const interestRateModel = fuse.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES.JumpRateModel_Compound_Stables
    const poolID = 1

    const conf: any = {
      underlying: underlyingAsset,
      comptroller: comptrollerAddress,
      interestRateModel,
      initialExchangeRateMantissa: WeiPerEther,

      // Ex: BOGGED USDC
      name: "Test Pool" + " " + " DAI",
      // Ex: fUSDC-456
      symbol: "fDAI" + "-" + poolID,
      decimals: 8,
    };

  // 2. Deploy asset.
    const asset = await fuse.deployAsset(
      conf,
      bigCollateralFactor,
      bigReserveFactor,
      bigAdminFee,
      { from: address },
      // TODO: Disable this. This bypasses the price feed check. Only using now because only trusted partners are deploying assets.
      true
    );
}