import { providers } from 'ethers';
import { ethers } from 'hardhat';
import { parseUnits } from '@ethersproject/units';
import { Fuse } from '../../cjs/index';
import colors from 'colors';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export async function deployEmptyPool(
  fuse: Fuse, 
  hre: HardhatRuntimeEnvironment, 
  address: string
) {
        try {
                await fuse.contracts.FusePoolDirectory.callStatic.owner()
        } catch(e: any) {
                console.log(colors.red(
                        "Transaction failed: "
                         ))

                console.log(e)

                console.log(colors.yellow(
                        "Please run deploy-fuse task before running this task. You may need to reset your node."
                ))
                return
        }

        // 1. Deploy Price Oracle
        const priceOracleAddress = await fuse.deployPriceOracle(
                "MasterPriceOracle",
                {
                underlyings: [],
                oracles: [],
                canAdminOverwrite: true,
                defaultOracle:
                fuse.addresses.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES
                .MasterPriceOracle, // We give the MasterPriceOracle a default "fallback" oracle of the Rari MasterPriceOracle
                },
                { from: address }
        );

        // 2. Construct arguments needed for deployment.
        const closeFactor = 50
        const liquidationIncentive = 8

        // 50% -> 0.5 * 1e18
        const bigCloseFactor = hre.ethers.utils.parseUnits((closeFactor / 100).toString());

        // 8% -> 1.08 * 1e8
        const bigLiquidationIncentive = hre.ethers.utils.parseUnits(
                (liquidationIncentive / 100 + 1).toString()
        );

        const isWhitelisted = false

        // 3. Deploy Pool
        const [_poolAddress] = await fuse.deployPool(
                "Test Pool",
                isWhitelisted,
                bigCloseFactor,
                bigLiquidationIncentive,
                priceOracleAddress,
                {},
                { 
                        from: address
                },
                isWhitelisted ? [] : null
        );

        console.log(colors.green('Deployed pool successfully!'))

        console.table([
                {contract: "Pool comptroller", address: _poolAddress}
        ])
}
