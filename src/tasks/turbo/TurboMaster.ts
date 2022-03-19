import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getSafesInfo } from './TurboLens';
import { TRIBE } from './utils/constants';
import { createTurboMaster } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-all-safes', "Will get all available safes", async (taskArgs, hre) => {
   const allSafes: string[] = await getAllSafes(hre)

   const safesInfo = await getSafesInfo(hre.ethers.provider, allSafes)

   console.log({allSafes, safesInfo})
})

task('get-safe-id', "Will get the given safe's ID")
    .addParam('safe', "TurboSafe to query.")
    .setAction( async (taskArgs, hre) => {

    const turboMasterContract = await createTurboMaster(hre)

    const safeId = await turboMasterContract.callStatic.getSafeId(taskArgs.safe)

    console.log({safeId})
})

task('get-total-boosted', " total amount of Fei boosted by Safes using it as collateral", async (taskArgs, hre) => {

    const turboMasterContract = await createTurboMaster(hre)

    const totalBoosted = await turboMasterContract.callStatic.getTotalBoostedAgainstCollateral("0x14Bd62D9b534e2301811400F7284945288797588")

    console.log({totalBoosted})
})

task('get-comptroller', async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre)
    const comptroller = await turboMasterContract.pool()
    console.log(comptroller)
})

task('get-master-owner', async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre)
    const owner = await turboMasterContract.owner()
    console.log({owner})
})

task('get-master-authority', async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre)
    const authority = await turboMasterContract.authority()
    console.log({authority})
})

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('master-create-safe', async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre)
    const receipt = await turboMasterContract.createSafe(TRIBE)
    console.log({receipt})
})

export const getAllSafes = async (hre: HardhatRuntimeEnvironment) => {
    const turboMasterContract = await createTurboMaster(hre)
    return await turboMasterContract.callStatic.getAllSafes()
}