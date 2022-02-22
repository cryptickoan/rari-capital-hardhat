import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import { marketInteraction } from '../../@rari-capital/comptroller/market-interaction';
import { collateral } from '../../@rari-capital/comptroller/collateral';

// Hardhat helpers
import { configureEnv } from '../utils';
import { checkAllowanceAndApprove } from '../fuse/market-interactions/utils/checkAllowanceAndApprove';

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

        // 1. On an erc20 check for allowance and approve given market to use funds. 
        if(taskArgs.underlying !== '0') {
            await checkAllowanceAndApprove(
                address,
                taskArgs.market,
                taskArgs.underlying,
                taskArgs.amount,
                fuse.provider
            )
        }

        // 2. If true enable as collateral. i.e enter market.
        if (taskArgs.enableAsCollateral) {
            await collateral(
                taskArgs.comptrollerAddress,
                [taskArgs.marketAddress],
                "enter",
                fuse.provider
            )
        }

        // 3. Supply to given market.
        await marketInteraction(
            "supply",
            taskArgs.market,
            taskArgs.amount,
            fuse.provider,
            taskArgs.underlying,
        )
    }
)

task('withdraw', 'Withdraws amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "withdraw",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        taskArgs.token,
    )
})

task('borrow', 'Borrows amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "borrow",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        taskArgs.token,
    )
})

task('repay', 'Borrows amount from given market')
    .addParam('market', 'Address of market to withdraw from.')
    .addParam('amount', 'Amount to withdraw from given market.')
    .addParam('token', 'Address of token to withdraw. 0 if its Eth')
    .setAction(async (taskArgs, hre) => {
    const {fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    await marketInteraction(
        "repay",
        taskArgs.market,
        taskArgs.amount,
        fuse.provider,
        taskArgs.token,
    )
})