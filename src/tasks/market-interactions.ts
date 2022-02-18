import '@nomiclabs/hardhat-ethers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import { supplyCEther } from '../fuse/comptroller-interactions/supply/cEth';

// Fuse SDK
import { supplyCToken } from '../fuse/comptroller-interactions/supply/cToken';

// Hardhat helpers
import { configureEnv } from '../utils';

task('supply', 'Will supply amount of token to market.')
    .addParam('underlying', 'Address for the underlying token of the market to supply to. 0 if its ether.')
    .addParam('market', 'Address of the market/ctoken to supply to.')
    .addParam('comptroller', 'Address of comptroller where the market is listed on.')
    .addParam('amunt', 'Amount of underlying to supply.')
    .addOptionalParam('enableAsCollateral', 'If true, the supplied amount will be enabled as collateral.')
    .addOptionalParam('user', 'Address of user that is supplying. Must be a hardhat address.')
    .setAction( async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const userAddress = taskArgs.address ?? address

        if (taskArgs.underlying !== 0 ){
            await supplyCToken(
                fuse,
                fuse.provider,
                userAddress,
                taskArgs.tokenAddress,
                taskArgs.marketAddress,
                taskArgs.amount,
                taskArgs.enableAsCollateral,
                taskArgs.comptrollerAddress
            )
        } else {
            await supplyCEther(
                fuse,
                fuse.provider,
                userAddress,
                taskArgs.marketAddress,
                taskArgs.amount,
                taskArgs.enableAsCollateral,
                taskArgs.comptrollerAddress
            )
        }
    }
)