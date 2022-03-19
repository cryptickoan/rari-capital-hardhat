import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { createTurboAuthority } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('is-user-authorized', "Returns boolean")
    .addParam('user', 'User/contract address')
    .addParam('target', 'Contract to call signature on')
    .addParam('function', 'Function signature')
    .addParam('authority', 'Address of the authority contract to query')
    .setAction(async (taskArgs, hre) => {

    const turboBoosterContract = await createTurboAuthority(hre, taskArgs.authority)

    const authorized = await turboBoosterContract.canCall(
        taskArgs.user,
        taskArgs.target,
        taskArgs.function
    )

    console.log({authorized})
})