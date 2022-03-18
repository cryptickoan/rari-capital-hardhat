// Types
import { Fuse } from '../../../../cjs/index';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Colors
import colors from 'colors';

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param hre - Hardhat runtime environment, passed from task.
 * @param address - User's address.
 */
export async function deployEmptyPool(
  fuse: Fuse, 
  hre: HardhatRuntimeEnvironment, 
  address: string
) {
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

        return _poolAddress
}
