import { providers } from 'ethers';
import { ethers } from 'hardhat';
import { parseUnits, parseEther } from '@ethersproject/units';
import { WeiPerEther } from '@ethersproject/constants'
import { Fuse } from '../cjs/index';

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    const fuse = new Fuse(provider, 31337)

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

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
        {
          from: address
        }
      );

      const closeFactor = 50
      const liquidationIncentive = 8

    // 50% -> 0.5 * 1e18
    const bigCloseFactor = parseUnits((closeFactor / 100).toString());

    // 8% -> 1.08 * 1e8
    const bigLiquidationIncentive = parseUnits(
      (liquidationIncentive / 100 + 1).toString()
    );

    const isWhitelisted = false

    // 2. Deploy Pool
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
    

    console.log({_poolAddress})

    // 3. Deploy Asset

    // 50% -> 0.5 * 1e18
    const collateralFactor = 0.5
    const reserveFactor = 0.1
    const adminFee = 0.05

    const bigCollateralFactor = parseEther(collateralFactor.toString())
      .div(100)
      .toString();

    // 10% -> 0.1 * 1e18
    const bigReserveFactor = parseEther(reserveFactor.toString())
      .div(100)
      .toString();

    // 5% -> 0.05 * 1e18
    const bigAdminFee = parseEther(adminFee.toString()).div(100).toString();

    const interestRateModel = fuse.addresses.PUBLIC_INTEREST_RATE_MODEL_CONTRACT_ADDRESSES.JumpRateModel_Compound_Stables
    
    const underlyingAsset = "0x6b175474e89094c44da98b954eedeac495271d0f"
    const poolID = 1

    const conf: any = {
      underlying: underlyingAsset,
      comptroller: _poolAddress,
      interestRateModel,
      initialExchangeRateMantissa: WeiPerEther,

      // Ex: BOGGED USDC
      name: "Test Pool" + " " + " DAI",
      // Ex: fUSDC-456
      symbol: "fDAI" + "-" + poolID,
      decimals: 8,
    };

    await fuse.deployAsset(
      conf,
      bigCollateralFactor,
      bigReserveFactor,
      bigAdminFee,
      { from: address },
      // TODO: Disable this. This bypasses the price feed check. Only using now because only trusted partners are deploying assets.
      true
    );
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  