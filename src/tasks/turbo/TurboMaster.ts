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

task('get-safe-id', "Will get the given safe's ID", async (taskArgs, hre) => {

    const turboMasterContract = await createTurboMaster(hre)

    const safeId = await turboMasterContract.callStatic.getSafeId("0x9b1d1ACb9BD6cFcd9159c5FA31F24B9383De1061")

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


const createTurboMaster = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboMasterContract = new Contract(
        TurboAddresses.MASTER,
        TurboMaster.abi,
        signers[0]
    )

    return turboMasterContract
}
