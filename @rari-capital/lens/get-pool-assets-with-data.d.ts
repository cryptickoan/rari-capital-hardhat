/**
 * @param provider - An initiated ethers provider.
 * @param fuse - Initiated fuse sdk instance. TODO: Remove.
 * @param comptrollerAddress - Comptroller to look for.
 * @returns - Async function call to get all public pools.
 */
export declare function getPoolAssetsWithData(provider: any, fuseLensAddress: string, comptrollerAddress: string): Promise<any>;
