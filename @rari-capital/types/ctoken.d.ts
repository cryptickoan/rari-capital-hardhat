import { TokensDataMap } from "./token";
export interface CTokenData {
    reserveFactorMantissa: any;
    adminFeeMantissa: any;
    collateralFactorMantissa: any;
    interestRateModelAddress: string;
    cTokenAddress: string;
    isPaused: boolean;
}
export interface CTokenRewardsDistributorIncentives {
    rewardsDistributorAddress: string;
    rewardToken: string;
    borrowSpeed: number;
    supplySpeed: number;
}
export interface CTokenIncentivesMap {
    [cTokenAddress: string]: CTokenRewardsDistributorIncentives[];
}
export interface CTokensUnderlyingMap {
    [cTokenAddr: string]: string;
}
export interface CTokenRewardsDistributorIncentivesWithRates extends CTokenRewardsDistributorIncentives {
    supplyAPY: number;
    borrowAPY: number;
    supplyAPR: number;
    borrowAPR: number;
}
export interface CTokenRewardsDistributorIncentivesWithRatesMap {
    [cTokenAddress: string]: CTokenRewardsDistributorIncentivesWithRates[];
}
export interface IncentivesData {
    hasIncentives: boolean;
    incentives: CTokenRewardsDistributorIncentivesWithRatesMap;
    rewardsDistributorCtokens: RewardsDistributorCTokensMap;
    rewardTokensData: TokensDataMap;
}
export interface RewardsDistributorCTokensMap {
    [rewardsDistributorAddress: string]: string[];
}
export interface RewardsDataForMantissa {
    cTokenAddress: string;
    rewardSpeed: number;
    rewardEthPrice: number;
    underlyingTotalSupply: number;
    underlyingEthPrice: number;
    underlyingDecimals: number;
    rewardDecimals: number;
}
