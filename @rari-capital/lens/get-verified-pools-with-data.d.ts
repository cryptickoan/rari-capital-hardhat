import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { Fuse } from "../../cjs";
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @returns - Async function call to get all public pools.
 */
export declare function getVerifiedPoolsWithData(provider: Web3Provider | JsonRpcProvider, fuse: Fuse): Promise<any>;
