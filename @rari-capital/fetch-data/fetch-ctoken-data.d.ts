import { CTokenData } from "../types/ctoken";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
/**
 * @param cTokenAddress - The CToken address to look for.
 * @param comptrollerAddress - The comptroller address that the cToken is managed by.
 * @param provider - An initiated ethers provider.
 * @returns
 */
export declare const fetchCTokenData: (cTokenAddress: string, comptrollerAddress: string, provider: Web3Provider | JsonRpcProvider) => Promise<CTokenData | undefined>;
