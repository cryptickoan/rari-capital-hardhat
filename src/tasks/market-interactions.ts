import '@nomiclabs/hardhat-ethers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import { supplyCToken } from '../fuse/comptroller-interactions/supply/cToken';

// Hardhat helpers
import { configureEnv } from '../utils';

task('supply-ctoken', 'Will return given pool\'s info', async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const tokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
        const userAddress = address
        const marketAddress = "0xB8DA336A58a13D9F09FaA41570cAAf5Ec4879266"
        const amount = BigNumber.from(10000)
        const enableAsCollateral = true
        const comptrollerAddress = "0x42053c258b5cd0b7f575e180DE4B90763cC2358b"

        await supplyCToken(
            fuse,
            tokenAddress,
            fuse.provider,
            userAddress,
            marketAddress,
            amount,
            enableAsCollateral,
            comptrollerAddress
        )
    }
)