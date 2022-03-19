import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import ERC20 from './abis/ERC20.sol/ERC20.json'
import { commify, formatEther, parseEther } from 'ethers/lib/utils';
import { getRecentEventDecoded } from './utils/decodeEvents';
import { createTurboSafe } from './utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('get-owner', "Will get the safe's owner")
    .addParam('safe', "TurboSafe to query.")
    .setAction( async (taskArgs, hre) => {

    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const owner = await turboSafeContract.owner()

    console.log({owner})
})

task('get-pool', "Gets pool associated to the safe")
        .addParam('safe', "TurboSafe to query.")
        .setAction(async (taskArgs, hre) => {
        const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

        const pool = await turboSafeContract.pool()

        console.log({pool})
})


task('get-fei-ctoken', "Gets pool associated to the safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const feiTurboCToken = await turboSafeContract.feiTurboCToken()

    console.log({feiTurboCToken})
})

task('get-asset-turbo-ctoken', "Gets pool associated to the safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const assetTurboCToken = await turboSafeContract.assetTurboCToken()

    console.log({assetTurboCToken})
})

task('get-safe-asset', "Gets pool associated to the safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const safeAsset = await turboSafeContract.asset()

    console.log({safeAsset})
})

task('get-total-assets', "Gets total assets held by the safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const safeAssets = await turboSafeContract.totalAssets()

    console.log(commify(formatEther(safeAssets)), "TRIBE")
})

task('get-total-fei-boosted', "Gets total fei boosted by the given safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const safeAssets = await turboSafeContract.totalFeiBoosted()

    console.log(commify(formatEther(safeAssets)), "FEI")
})

task('get-total-fei-boosted-for-vault', "Gets total fei boosted by the given safe to the given vault")
    .addParam('safe', "TurboSafe to query.")
    .addParam('vault', "Vault to query")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const safeAssets = await turboSafeContract.getTotalFeiBoostedForVault(taskArgs.vault)

    console.log(commify(formatEther(safeAssets)), "FEI")
})


/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('approve-safe', "Will approve safe to use user assets")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners()

    const erc20Contract = new Contract(
        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
        ERC20.abi,
        signers[0]
    )

    const receipt = await erc20Contract.approve(
        taskArgs.safe,
        parseEther("50000000")
    )

    console.log({receipt})
})

task('safe-deposit', "Will deposit directly into the safe")
    .addParam('safe', "TurboSafe to query.")
    .setAction(async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    const receipt = await turboSafeContract.deposit(
        parseEther("5000000"),
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    )

    console.log({receipt})
})

task('safe-boost', "Borrow Fei from the Turbo Fuse Pool and deposit it into an authorized Vault.")
    .addParam('safe', "The safe to use for boosting")
    .addParam('vault', "The vault to deposit borrowed Fei")
    .addParam('amount', "Amount of FEI to borrow")
    .setAction(async (taskArgs, hre) => {

    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)        

    const receipt = await turboSafeContract.boost(taskArgs.vault, parseEther(taskArgs.amount))

    console.log({receipt})
})

task('safe-less', "Withdraw Fei from a deposited Vault and use it to repay debt in the Turbo Fuse Pool.")
    .addParam('safe', 'The safe to use for lessing')
    .addParam('vault', 'Vault to withdraw from')
    .addParam('amount', 'Amount to withdraw')
    .setAction(async (taskArgs, hre) => {

    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe) 

    const receipt = await turboSafeContract.less(taskArgs.vault, parseEther(taskArgs.amount))

    console.log({receipt})
})

task('safe-slurp', "Accrue any interest earned by the Safe in the Vault.")
    .addParam('safe', "Safe to use for slurping")
    .addParam('vault', "Vault to slurp interest from")
    .setAction(async (taskArgs, hre) => {

    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe) 
    const receipt = await turboSafeContract.slurp(taskArgs.vault)

    const blockNumber = await hre.ethers.provider.getBlockNumber()
    const decodedEVent = await getRecentEventDecoded(turboSafeContract, turboSafeContract.filters.VaultSlurped)
    console.log({decodedEVent})

})

task('safe-sweep', "Claim tokens sitting idly in the Safe.")
    .addParam('safe', 'Safe to sweep from')
    .addParam('to', 'Receiver of the sweeped tokens')
    .addParam('token', 'Token to sweep and send')
    .addParam('amount', 'Amount to sweep from the safe')
    .setAction(async (taskArgs, hre) => {
        
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    // Safes can borrow any available borrowable asset in the turbo pool + theres shares from the strategy. 
    // That's why we need to specify token to sweep. 
    const receipt = await turboSafeContract.sweep(taskArgs.to, taskArgs.token, taskArgs.amount)
    
    const decodedEvent = await getRecentEventDecoded(turboSafeContract, turboSafeContract.filters.TokenSweeped)

    // Looks like you can sweep even if theres no token to sweep. Event will be triggered regardless of anything being transferred.
    console.log({decodedEvent})
})

task('safe-gib', "Impound a specific amount of a Safe's collateral")
    .addParam('safe', 'Safe to impound from')
    .addParam('to', 'Address to send impounded collateral to')
    .addParam('amount', 'Amount of collateral to impound')
    .setAction(async (taskArgs, hre) => {
    
    const turboSafeContract = await createTurboSafe(hre, taskArgs.safe)

    // Safes can only support one type of collateral that's why we dont specify token.
    const receipt = await turboSafeContract.gib(taskArgs.to, parseEther(taskArgs.amount))
    
    const decodedEvent = await getRecentEventDecoded(turboSafeContract, turboSafeContract.filters.SafeGibbed)
    console.log({decodedEvent})
})

