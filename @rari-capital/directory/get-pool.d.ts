import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
/**
 * @param provider - An initiated ethers provider.
 * @param id - The pool id.
 * @param directoryAddress - Fuse Directory address.
 * @returns - Object with following properties: name: string, creator: address, comptroller: address, blockPosted: bn, timestampPosted: bn.
 */
export declare function getPool(provider: Web3Provider | JsonRpcProvider, id: string, directoryAddress: string): Promise<any>;
