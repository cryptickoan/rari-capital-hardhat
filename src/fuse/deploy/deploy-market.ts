import { parseEther } from '@ethersproject/units';
import { WeiPerEther } from '@ethersproject/constants'
import { Fuse } from '../../../cjs/index';
import colors from 'colors';

/**
 * @param fuse - An initiated Fuse instance
 * @param _poolAddress - The comptroller's address.
 * @param address - The user's address.
 * @param underlyingAsset - The underlying asset's address. i.e "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" for USDC.
 */
export async function deployMarket(
  fuse: Fuse,
  _poolAddress: string, 
  address: string,
  underlyingAsset: string
) {
  // 1. Construct necessary arguments.

    // 50% -> 0.5 * 1e18
    const collateralFactor = 0.5
    const reserveFactor = 0.1
    const adminFee = 0.05

    const bigCollateralFactor = parseEther(collateralFactor.toString())
      .div(100)
      .toString();

    // 10% -> 0.1 * 1e18
    const bigReserveFactor = parseEther(reserveFactor.toString())
      .div(100)
      .toString();

    // 5% -> 0.05 * 1e18
    const bigAdminFee = parseEther(adminFee.toString()).div(100).toString();

    const interestRateModel = fuse.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES.JumpRateModel_Compound_Stables
    const poolID = 1

    const conf: any = {
      underlying: underlyingAsset,
      comptroller: _poolAddress,
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