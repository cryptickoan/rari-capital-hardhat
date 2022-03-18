import { Fuse } from '../../cjs/index';
/**
 * @param fuse - An initiated Fuse instance
 * @param comptrollerAddress - The comptroller's address.
 * @param address - The user's address, has to be comptroller admin.
 * @param underlyingAsset - The underlying asset's address. i.e "0xa0b8..48" for USDC.
 * @param collateralFactor - Determines loan to value ratio. i.e. how much of collateral value can be borrowed. Should be between 0 - 1.
 * @param reserveFactor - Determines percentage for reserves. Should be between 0 - 1.
 * @param adminFee - Determines percentage for admin fees. Should be between 0 - 1.
 */
export declare function deployMarket(fuse: Fuse, comptrollerAddress: string, address: string, underlyingAsset: string, collateralFactor: number, // 0.5
reserveFactor: number, // 0.1
adminFee: number): Promise<void>;
