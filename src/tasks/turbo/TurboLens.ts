import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Ethers
import { BigNumber } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callInterfaceWithMulticall, callStaticWithMultiCall, encodeCall } from '../../utils/multicall';
import { createTurboLens, ITurboLens } from './utils/turboContracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TurboAddresses } from './utils/constants';
import { encode } from 'querystring';

/** Types **/
type SafeInfo = {
    collateralAsset: string;
    collateralAmount: BigNumber;
    collateralValue: BigNumber;
    debtAmount: BigNumber;
    debtValue: BigNumber;
    boostedAmount: BigNumber;
    feiAmount: BigNumber;
    tribeDAOFee: BigNumber;
}

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-all-user-safes', "Will get all available safes")
    .addParam('user', 'User to filter for')
    .setAction(async (taskArgs, hre) => {
    
   const userSafes = await getAllUserSafes(hre, taskArgs.user)

   console.log({userSafes})
})


task('get-lens-master', "Will get all available safes")
    .setAction(async (taskArgs, hre) => {
    
    let lens = await createTurboLens(hre)

    const master = await lens.master()

    console.log({master})
})

task('get-safe-info', "Will get all available safes")
    .addParam('safe', 'User to filter for')
    .setAction(async (taskArgs, hre) => {
    const info = await getSafeInfo(hre, taskArgs.safe)
    console.log({info})
})


/** Funcs **/
export const getSafeInfo = async (hre: HardhatRuntimeEnvironment, safe: string) => {
    let lens = await createTurboLens(hre)
    try {
        const result: SafeInfo = await lens.callStatic.getSafeInfo(safe)
        return result
    } catch (err) {
        console.log(err)
    }
}

export const getAllUserSafes = async (hre: HardhatRuntimeEnvironment, user: string) => {
    const turboLens = await createTurboLens(hre)
    return await turboLens.callStatic.getAllUserSafes(user)
}


export const getSafesInfo = async (provider: JsonRpcProvider, safes: string[]) => {

    let encodedCalls = safes.map(safe => {
        return encodeCall(ITurboLens, TurboAddresses.LENS, "getSafeInfo", [safe])
    })


    try {
        const safeInfos = await callStaticWithMultiCall(provider, encodedCalls)
        console.log({ safeInfos })
        return safeInfos
    } catch (err) {
        console.log(err)
    }
}