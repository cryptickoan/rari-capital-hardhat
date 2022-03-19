import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import TurboAuthority from '../../utils/turbo/abi/Auth.sol/Authority.json'
import ERC20 from '../../utils/turbo/abi/ERC20.sol/ERC20.json'
import { commify, formatEther, parseEther } from 'ethers/lib/utils';
import { TurboAddresses } from './constants';


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

const createTurboAuthority = async (hre: HardhatRuntimeEnvironment, authorityAddress: string) => {
    const signers = await hre.ethers.getSigners()

    const turboAuthorityContract = new Contract(
        authorityAddress,
        TurboAuthority.abi,
        signers[0]
    )

    return turboAuthorityContract
}