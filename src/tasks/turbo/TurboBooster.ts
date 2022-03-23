import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { createTurboBooster } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-boostable-vaults', "Will get all boostable vaults", async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboBooster(hre, 31337)

    const boostableVaults = await turboBoosterContract.getBoostableVaults()

    console.log({boostableVaults})
})

task('get-is-frozen', "Will return true if boosting for all safes under master is frozen.", async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboBooster(hre, 31337)

    const boostableVaults = await turboBoosterContract.frozen()

    console.log({boostableVaults})
})