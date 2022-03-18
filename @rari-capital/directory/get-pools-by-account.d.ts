import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { Fuse } from "../../cjs";
/**
 * @param provider - An initiated ethers provider.
 * @param address - The user's address.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @returns - Async function call to get pools by given address.
 */
export declare function getPoolsByAccount(provider: Web3Provider | JsonRpcProvider, address: string, fuse: Fuse): any;
