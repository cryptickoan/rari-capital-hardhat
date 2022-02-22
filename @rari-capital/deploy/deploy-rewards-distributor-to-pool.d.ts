import { Fuse } from '../../cjs';
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param underlying - Address of token to distribute. i.e for DAI 0x6b175474e89094c44da98b954eedeac495271d0f.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 * @param address - Optional. If present it'll be used as the address that deploys the reward distributor.
 */
export declare function deployRdToPool(fuse: Fuse, underlying: string, comptrollerAddress: string, comptrollerAdmin: string, address?: string): Promise<void>;
