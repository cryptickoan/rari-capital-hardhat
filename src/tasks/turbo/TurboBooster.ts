import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import TurboBooster from '../../utils/turbo/abi/TurboBooster.sol/TurboBooster.json'
import ERC20 from '../../utils/turbo/abi/ERC20.sol/ERC20.json'
import { commify, formatEther, parseEther } from 'ethers/lib/utils';
import { TurboAddresses } from './constants';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-boostable-vaults', "Will get all boostable vaults", async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboSafe(hre)

    const boostableVaults = await turboBoosterContract.getBoostableVaults()

    console.log({boostableVaults})
})

task('get-is-frozen', "Will return true if boosting for all safes under master is frozen.", async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboSafe(hre)

    const boostableVaults = await turboBoosterContract.frozen()

    console.log({boostableVaults})
})


/*///////////////////////////////////////////////////////////////
                        UTILS
//////////////////////////////////////////////////////////////*/
const createTurboSafe = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboBoosterContract = new Contract(
        TurboAddresses.BOOSTER,
        TurboBooster.abi,
        signers[0]
    )

    return turboBoosterContract
}