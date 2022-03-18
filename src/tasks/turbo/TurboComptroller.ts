import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { commify, formatUnits } from 'ethers/lib/utils';
import TurboComptroller from '../../utils/turbo/abi/Comptroller/comptroller.json'
import CERC20 from '../../utils/turbo/abi/CERC20.sol/CERC20.json'

task('turbo-markets', "Will create an empty safe", async (taskArgs, hre) => {

    const turboComptrollerContract = await createTurboComptroller(hre)

    const markets = await turboComptrollerContract.getAllMarkets()

    console.log({markets})
})

task('turbo-tribe-cf', "Will get TRIBE Collateral Factor in the turbo pool", async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre)

    const market = await turboComptrollerContract.markets("0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f")

    console.log("Collateral Factor: ", formatUnits(market.collateralFactorMantissa))
})

task('turbo-tribe-supply-cap', "Will get TRIBE's supply cap in the turbo pool", async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre)

    const market = await turboComptrollerContract.supplyCaps("0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f")

    console.log("Supply Cap: ", commify(formatUnits(market)))
})

task('turbo-markets-info', "Will get all info for turbo markets", async (taskArgs, hre) => {

})

const createCERC20 = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboTRIBEContract = new Contract(
        "0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f",
        CERC20.abi,
        signers[0]
    )
}

const createTurboComptroller = async (hre: HardhatRuntimeEnvironment) => {
    const signers = await hre.ethers.getSigners()

    const turboRouterContract = new Contract(
        '0x14Bd62D9b534e2301811400F7284945288797588',
        TurboComptroller,
        signers[0]
    )

    return turboRouterContract
}

