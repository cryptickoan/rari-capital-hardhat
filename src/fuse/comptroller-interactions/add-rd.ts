import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// Types
import { Fuse } from '../../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

/**
 * @param fuse an initiated fuse sdk instance.
 * @param hre Hardhat runtime environment passed from task.
 * @param RdAddress rewards distributor's address.
 * @param comptrollerAddress address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin comptroller admin's address
 */
export async function addRdToPool(
    fuse: Fuse,
    hre: HardhatRuntimeEnvironment,
    rdAddress: string,
    comptrollerAddress: string,
    comptrollerAdmin: string,
) {
    // 2. 
    const functionInterface = [
        'function _addRewardsDistributor(address RdAddress)'
    ]

    const comptrollerContract = new hre.ethers.Contract(
        comptrollerAddress,
        functionInterface,
        fuse.provider.getSigner(comptrollerAdmin)
    )

    try {
        await comptrollerContract._addRewardsDistributor(rdAddress)
        console.info(
            colors.green(
                "Comptroller configuration successful. Rewards distributor was added to your pool"
            )
        )
    } catch (e) {
        console.log(e)
    }
}