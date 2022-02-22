import { BigNumber } from "ethers";
import { TokenData } from "./token";
export interface FuseAsset {
    cToken: string;
    borrowBalance: BigNumber;
    supplyBalance: BigNumber;
    liquidity: BigNumber;
    membership: boolean;
    underlyingName: string;
    underlyingSymbol: string;
    underlyingToken: string;
    underlyingDecimals: BigNumber;
    underlyingPrice: BigNumber;
    underlyingBalance: BigNumber;
    collateralFactor: BigNumber;
    reserveFactor: BigNumber;
    adminFee: BigNumber;
    fuseFee: BigNumber;
    oracle: string;
    borrowRatePerBlock: BigNumber;
    supplyRatePerBlock: BigNumber;
    totalBorrow: BigNumber;
    totalSupply: BigNumber;
}
export interface FusePool {
    name: string;
    creator: string;
    comptroller: string;
    isPrivate: boolean;
}
export interface LensFusePool {
    blockPosted: string;
    name: string;
    creator: string;
    comptroller: string;
    timestampPosted: string;
}
export interface LensFusePoolData {
    totalBorrow: string;
    totalSupply: string;
    underlyingSymbols: string[];
    underlyingTokens: string[];
    whitelistedAdmin: boolean;
}
export declare type LensPoolsWithData = [
    ids: string[],
    fusePools: LensFusePool[],
    fusePoolsData: LensFusePoolData[],
    errors: boolean[]
];
export interface MergedPool extends LensFusePoolData, LensFusePool {
    id: number;
    suppliedUSD: number;
    borrowedUSD: number;
}
export interface FusePoolData {
    assets: USDPricedFuseAsset[];
    comptroller: string;
    name: string;
    oracle: string;
    oracleModel: string | undefined;
    totalLiquidityUSD: BigNumber;
    totalSuppliedUSD: BigNumber;
    totalBorrowedUSD: BigNumber;
    totalSupplyBalanceUSD: BigNumber;
    totalBorrowBalanceUSD: BigNumber;
    id?: number;
    admin: string;
}
export interface USDPricedFuseAsset extends FuseAsset {
    supplyBalanceUSD: BigNumber;
    borrowBalanceUSD: BigNumber;
    totalSupplyUSD: BigNumber;
    totalBorrowUSD: BigNumber;
    liquidityUSD: BigNumber;
    isPaused: boolean;
    borrowGuardianPaused?: boolean;
}
export interface USDPricedFuseAssetWithTokenData extends USDPricedFuseAsset {
    tokenData: TokenData;
}
