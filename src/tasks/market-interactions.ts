import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import { supplyCEther } from '../fuse/comptroller-interactions/supply/cEth';
import { supplyCToken } from '../fuse/comptroller-interactions/supply/cToken';

// Hardhat helpers
import { configureEnv } from '../utils';

task('supply', 'Will supply amount of token to market.')
    .addParam('underlying', 'Address for the underlying token of the market to supply to. 0 if its ether.')
    .addParam('market', 'Address of the market/ctoken to supply to.')
    .addParam('comptroller', 'Address of comptroller where the market is listed on.')
    .addParam('amount', 'Amount of underlying to supply.')
    .addOptionalParam('collateralize', 'If true, the supplied amount will be enabled as collateral.')
    .addOptionalParam('user', 'Address of user that is supplying. Must be a hardhat address.')
    .setAction( async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const userAddress = taskArgs.user ?? address

        if (taskArgs.underlying !== '0'){
            await supplyCToken(
                fuse,
                fuse.provider,
                userAddress,
                taskArgs.underlying,
                taskArgs.market,
                taskArgs.amount,
                taskArgs.collateralize ?? false,
                taskArgs.comptroller
            )
        } else {
            await supplyCEther(
                fuse,
                fuse.provider,
                userAddress,
                taskArgs.market,
                taskArgs.amount,
                taskArgs.collateralize ?? false,
                taskArgs.comptroller
            )
        }
    }
)