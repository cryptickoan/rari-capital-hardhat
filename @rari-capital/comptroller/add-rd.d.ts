import { Fuse } from '../../cjs';
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment passed from task.
 * @param RdAddress - Rewards distributor's address.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 */
export declare function addRdToPool(fuse: Fuse, rdAddress: string, comptrollerAddress: string, comptrollerAdmin: string): Promise<void>;
