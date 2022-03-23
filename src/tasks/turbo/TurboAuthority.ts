import '@nomiclabs/hardhat-ethers';
import { providers } from 'ethers';
import { task } from 'hardhat/config';
import { TurboAddresses } from './utils/constants';
import { createMultiRolesAuthority, createTurboAuthority, createTurboMaster, ITurboMaster } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('is-user-authorized-to-create', "Returns boolean")
    .addParam('user', 'User/contract address')
    .addParam('target', 'Contract to call signature on')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {

    const isUserAuthorized = await isUserAuthorizedToCreateSafes(hre.ethers.provider, TurboAddresses[taskArgs.id].TURBO_AUTHORITY, taskArgs.user, taskArgs.target)

    console.log({isUserAuthorized})
})

task('is-capability-public', "Returns boolean")
    .addParam('authority', 'Address of the authority contract to query')
    .setAction(async (taskArgs, hre) => {

    const turboBoosterContract = await createMultiRolesAuthority(hre, taskArgs.authority)

    const functionSig = ITurboMaster.getSighash('createSafe')

    const authorized = await turboBoosterContract.isCapabilityPublic(
        functionSig
    )

    console.log({authorized})
})

task('get-authority-owner')
    .addParam('authority', 'Address of the authority contract to query')
    .setAction( async (taskArgs, hre) => {
    const turboBoosterContract = await createTurboAuthority(hre.ethers.provider, taskArgs.authority)

    const owner = await turboBoosterContract.owner()

    console.log({owner})
})

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('grant-dev-permission')
    .addParam('user', 'User/contract address')
    .addParam('target', 'Contract to call signature on')
    .addParam('function', 'Function signature')
    .addParam('authority', 'Address of the authority contract to query') 
    .setAction( async (taskArgs, hre) => {
    const turboBoosterContract = await createTurboAuthority(hre.ethers.provider, taskArgs.authority)
})

const isUserAuthorizedToCreateSafes = async (
    provider: providers.JsonRpcProvider | providers.Web3Provider, 
    authority: string,
    user: string,
    target: string
) => {
    const turboBoosterContract = await createTurboAuthority(provider, authority)

    const functionSig = ITurboMaster.getSighash('createSafe')

    const authorized = await turboBoosterContract.canCall(
        user,
        target,
        functionSig
    )

    return authorized
}