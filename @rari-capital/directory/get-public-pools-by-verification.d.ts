import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { Fuse } from "../../cjs";
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @returns - Async function call to get al available pools.
 */
export declare function getPublicPoolsByVerification(provider: Web3Provider | JsonRpcProvider, fuse: Fuse): Promise<any>;
