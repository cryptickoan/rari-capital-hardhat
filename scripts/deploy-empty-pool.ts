import { providers } from 'ethers';
import { ethers } from 'hardhat';
import { parseUnits } from '@ethersproject/units';
import { Fuse } from '../cjs/index';

export async function deployEmptyPool() {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    const fuse = new Fuse(provider, 31337)

    const options = { from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}

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
        options
      );
      
    console.log("Price Oracle address:" + priceOracleAddress)
    
    // 2. Construct arguments needed for deployment.
    // 50% -> 0.5 * 1e18
    const closeFactor = 50
    const bigCloseFactor = parseUnits((closeFactor / 100).toString());

    // 8% -> 1.08 * 1e8
    const liquidationIncentive = 8
    const bigLiquidationIncentive = parseUnits(
      (liquidationIncentive / 100 + 1).toString()
    );

    const isWhitelisted = false

    // Deploy Pool
    const [_poolAddress] = await fuse.deployPool(
        "Test Pool",
        isWhitelisted,
        bigCloseFactor,
        bigLiquidationIncentive,
        priceOracleAddress,
        {},
        options,
        isWhitelisted ? [] : null
    );

    console.log({_poolAddress})
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployEmptyPool().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
