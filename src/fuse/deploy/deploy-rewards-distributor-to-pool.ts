import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// Types
import { Fuse } from '../../../cjs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';
import { addRdToPool } from '../comptroller-interactions/add-rd';

/**
 * @param fuse an initiated fuse sdk instance.
 * @param hre Hardhat runtime environment passed from task.
 * @param underlying address of token to distribute. i.e for DAI 0x6b175474e89094c44da98b954eedeac495271d0f.
 * @param comptrollerAddress address of comptroller that the rewards distributor will be added to.
 * @param comptrollerAdmin comptroller admin's address
 * @param address - optional. If present it'll be used as the address that deploys the reward distributor. 
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