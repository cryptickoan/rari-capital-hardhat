import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Colors
import colors from 'colors';

// Turbo ABIs
import Deployer from '../../turbo/abi/Deployer.sol/Deployer.json'
import DAIABI from '../../turbo/abi/DAI.sol/DAI.json'
import TurboRouter from '../../turbo/abi/TurboRouter.sol/TurboRouter.json'
import TurboMaster from '../../turbo/abi/TurboMaster.sol/TurboMaster.json'
import TurboComptroller from '../../turbo/abi/Comptroller.sol/Comptroller.json'

// Ethers
import { Contract } from 'ethers';
import { getPermitDigest, sign } from '../../utils/signatures';
import { Interface } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';


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
        '0xab69ee29c41cb9ef1befcc650f858feebbf2cead',
        TurboMaster.abi,
        signers[0]
    )

    return turboMasterContract
}
