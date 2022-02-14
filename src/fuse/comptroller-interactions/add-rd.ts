// Types
import { Fuse } from '../../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment passed from task.
 * @param RdAddress - Rewards distributor's address.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 */
export async function addRdToPool(
    fuse: Fuse,
    hre: HardhatRuntimeEnvironment,
    rdAddress: string,
    comptrollerAddress: string,
    comptrollerAdmin: string,
) {
    // 1. Initiate comptroller contract.
    const functionInterface = [
        'function _addRewardsDistributor(address RdAddress)'
    ]

    const comptrollerContract = new hre.ethers.Contract(
        comptrollerAddress,
        functionInterface,
        fuse.provider.getSigner(comptrollerAdmin)
    )

    // 2. Add rd to comptroller.
    await comptrollerContract._addRewardsDistributor(rdAddress)
    
    console.info(
        colors.green(
            "Comptroller configuration successful. Rewards distributor was added to your pool"
        )
    )
}