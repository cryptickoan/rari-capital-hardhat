import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { Fuse } from "../../cjs";
/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @param id - Id of pool to update.
 * @param name - New name for the pool.
 * @returns - Async function call to get all public pools.
 */
export declare function setPoolName(provider: Web3Provider | JsonRpcProvider, fuse: Fuse, id: number, name: string): any;
