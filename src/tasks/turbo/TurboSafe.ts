import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import TurboSafe from '../../turbo/abi/TurboSafe.sol/TurboSafe.json'
import ERC20 from '../../turbo/abi/ERC20.sol/ERC20.json'
import { formatEther, parseEther } from 'ethers/lib/utils';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('getOwner', "Will get the safe's owner", async (taskArgs, hre) => {

    const turboSafeContract = await createTurboSafe(hre)

    const receipt = await turboSafeContract.owner()

    console.log({receipt})
})

task('getPool', "Gets pool associated to the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const pool = await turboSafeContract.pool()

    console.log({pool})
})


task('getFeiCToken', "Gets pool associated to the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const feiTurboCToken = await turboSafeContract.feiTurboCToken()

    console.log({feiTurboCToken})
})

task('getAssetTurboCToken', "Gets pool associated to the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const assetTurboCToken = await turboSafeContract.assetTurboCToken()

    console.log({assetTurboCToken})
})

task('getSafeAsset', "Gets pool associated to the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const safeAsset = await turboSafeContract.asset()

    console.log({safeAsset})
})

task('getTotalAssets', "Gets total assets held by the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const safeAssets = await turboSafeContract.totalAssets()

    console.log(formatEther(safeAssets), "TRIBE")
})


/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('approveSafe', "Will approve safe to use user assets", async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners()

    const erc20Contract = new Contract(
        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
        ERC20.abi,
        signers[0]
    )

    const receipt = await erc20Contract.approve(
        "0x9b1d1ACb9BD6cFcd9159c5FA31F24B9383De1061",
        parseEther("100")
    )

    console.log({receipt})
})

task('directDeposit', "Will deposit directly into the safe", async (taskArgs, hre) => {
    const turboSafeContract = await createTurboSafe(hre)

    const receipt = await turboSafeContract.deposit(
        parseEther("100"),
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    )

    console.log({receipt})
})

/*///////////////////////////////////////////////////////////////
                        UTILS
//////////////////////////////////////////////////////////////*/
const createTurboSafe = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboSafeContract = new Contract(
        '0x9b1d1ACb9BD6cFcd9159c5FA31F24B9383De1061',
        TurboSafe.abi,
        signers[0]
    )

    return turboSafeContract
}