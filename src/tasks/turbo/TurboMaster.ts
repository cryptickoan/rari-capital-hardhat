import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Colors
import colors from 'colors';

// Turbo ABIs
import Deployer from '../../utils/turbo/abi/Deployer.sol/Deployer.json'
import DAIABI from '../../utils/turbo/abi/DAI.sol/DAI.json'
import TurboRouter from '../../utils/turbo/abi/TurboRouter.sol/TurboRouter.json'
import TurboMaster from '../../utils/turbo/abi/TurboMaster.sol/TurboMaster.json'
import TurboComptroller from '../../utils/turbo/abi/Comptroller.sol/Comptroller.json'

// Ethers
import { Contract } from 'ethers';
import { getPermitDigest, sign } from '../../utils/signatures';
import { Interface } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { TurboAddresses } from './constants';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-all-safes', "Will get all available safes", async (taskArgs, hre) => {
    
    const turboMasterContract = await createTurboMaster(hre)

    const allSafes = await turboMasterContract.callStatic.getAllSafes()

    console.log({allSafes})
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
task('direct-create-safe', async (taskArgs, hre) => {
    const turboMasterContract = await createTurboMaster(hre)
    const receipt = await turboMasterContract.createSafe("0xc7283b66eb1eb5fb86327f08e1b5816b0720212b")
    console.log({receipt})
})

const createTurboMaster = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboMasterContract = new Contract(
        TurboAddresses.MASTER,
        TurboMaster.abi,
        signers[0]
    )

    return turboMasterContract
}
