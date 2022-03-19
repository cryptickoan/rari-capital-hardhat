import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { commify, formatUnits } from 'ethers/lib/utils';
import { createTurboComptroller } from './utils/turboContracts';

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