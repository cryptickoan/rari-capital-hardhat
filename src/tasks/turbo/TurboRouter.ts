import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import TurboRouter from '../../utils/turbo/abi/TurboRouter.sol/TurboRouter.json'
import { parseEther } from 'ethers/lib/utils';
import { TurboAddresses } from './constants';

task('create-safe', "Will create an empty safe", async (taskArgs, hre) => {

    const turboRouterContract = await createTurboRouter(hre)

    const receipt = await turboRouterContract.createSafe('0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B')

    console.log({receipt})
})

task('create-safe-and-deposit', "", async (taskArgs, hre) => {
    const turboRouterContract = await createTurboRouter(hre)
    const receipt = await turboRouterContract.createSafeAndDeposit(
        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        parseEther("100"),
        0
    )

    console.log({receipt})
})

task('deposit', "Will deposit to given safe", async (taskArgs, hre) => {

    const turboRouterContract = await createTurboRouter(hre)

    const receipt = await turboRouterContract.deposit(
        "0xCd6442eB75f676671FBFe003A6A6F022CbbB8d38",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        parseEther("1000"),
        parseEther("1000"),
    )

    console.log(receipt)
})

const createTurboRouter = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboRouterContract = new Contract(
        TurboAddresses.ROUTER,
        TurboRouter.abi,
        signers[0]
    )

    return turboRouterContract
}