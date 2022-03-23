import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getSafesInfo } from './TurboLens';
import { TRIBE } from './utils/constants';
import { createTurboMaster } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-all-safes', "Will get all available safes")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
   const allSafes: string[] = await getAllSafes(hre)

   console.log({allSafes})
})

task('get-safe-id', "Will get the given safe's ID")
    .addParam('id', 'ChainID')
    .addParam('safe', "TurboSafe to query.")
    .setAction( async (taskArgs, hre) => {

    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)

    const safeId = await turboMasterContract.callStatic.getSafeId(taskArgs.safe)

    console.log({safeId})
})

task('get-total-boosted', " total amount of Fei boosted by Safes using it as collateral")
    .addParam('id', 'ChainID')
    .setAction( async (taskArgs, hre) => {

    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)

    const totalBoosted = await turboMasterContract.callStatic.getTotalBoostedAgainstCollateral("0x14Bd62D9b534e2301811400F7284945288797588")

    console.log({totalBoosted})
})

task('get-comptroller')
    .addParam('id', 'ChainID') 
    .setAction(async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)
    const comptroller = await turboMasterContract.pool()
    console.log(comptroller)
})

task('get-master-owner')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)
    const owner = await turboMasterContract.owner()
    console.log({owner})
})

task('get-master-authority')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)
    const authority = await turboMasterContract.authority()
    console.log({authority})
})

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('master-create-safe')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre, taskArgs.id)
    const receipt = await turboMasterContract.createSafe(TRIBE)
    console.log({receipt})
})

export const getAllSafes = async (hre: HardhatRuntimeEnvironment) => {
    const turboMasterContract = await createTurboMaster(hre, 31337  )
    return await turboMasterContract.callStatic.getAllSafes()
}