import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { commify, formatUnits, parseUnits } from 'ethers/lib/utils';
import { createOracle, createTurboComptroller } from './utils/turboContracts';
import { TurboAddresses } from './utils/constants';
import { getEthUsdPriceBN } from '../../../cjs/utils/getUSDPriceBN';
import { constants } from 'ethers';

task('turbo-markets', "Will create an empty safe")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {

    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const markets = await turboComptrollerContract.getAllMarkets()

    console.log({markets})
})

task('turbo-tribe-cf', "Will get TRIBE Collateral Factor in the turbo pool")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const market = await turboComptrollerContract.markets("0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f")

    console.log("Collateral Factor: ", formatUnits(market.collateralFactorMantissa))
})

task('turbo-tribe-supply-cap', "Will get TRIBE's supply cap in the turbo pool")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const market = await turboComptrollerContract.supplyCaps("0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f")

    console.log("Supply Cap: ", commify(formatUnits(market)))
})

task('turbo-oracle', "Will get all info for turbo markets")
    .addParam('id', 'chainID')
    .setAction(async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const oracle = await turboComptrollerContract.oracle()
    console.log(oracle)
})

task('get-oracle-for-asset')
    .addParam('id', 'chainID')
    .addParam('oracle', 'Oracles address')
    .addParam('asset', 'Address of asset to get price for')
    .setAction(async (taskArgs, hre) => {
        const oracleContract = await createOracle(hre.ethers.provider, TurboAddresses[taskArgs.id].ORACLE)

        console.log(oracleContract)
        const price = await oracleContract.callStatic.price(taskArgs.asset)
        const ethPrice = await getEthUsdPriceBN()

        console.log(formatUnits(price.mul(ethPrice).div(constants.WeiPerEther)))
    })