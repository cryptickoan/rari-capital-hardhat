import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
export declare function getDecimals(tokenAddress: string, provider: Web3Provider | JsonRpcProvider): Promise<any>;
