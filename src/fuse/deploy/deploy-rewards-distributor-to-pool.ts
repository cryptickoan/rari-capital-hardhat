// Types
import { Fuse } from '../../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

// Function
import { addRdToPool } from '../market-interactions/add-rd';

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment passed from task.
 * @param underlying - Address of token to distribute. i.e for DAI 0x6b175474e89094c44da98b954eedeac495271d0f.
 * @param comptrollerAddress - Address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin - Comptroller admin's address
 * @param address - Optional. If present it'll be used as the address that deploys the reward distributor. 
 */
export async function deployRdToPool(
    fuse: Fuse,
    hre: HardhatRuntimeEnvironment,
    underlying: string,
    comptrollerAddress: string,
    comptrollerAdmin: string,
    address?: string
) {

    console.info(
        colors.green(
            "Initiating rewards distributor deployment."
        )
    )

    // 1. Deploy Rd
    const deployedDistributor = await fuse.deployRewardsDistributor(
        underlying,
        {
          from: address ?? comptrollerAdmin,
        }
    );

    console.info(
        colors.green(
            "Deployment successful!"
        )
    )

    console.table(
        {contract: "Rewards distributor" , address: deployedDistributor.address}
    )


    // 2. Add to pool
    await addRdToPool(
        fuse,
        hre,
        deployedDistributor.address,
        comptrollerAddress,
        comptrollerAdmin
    )

}