import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import Fuse from '../../cjs/Fuse';

// Hardhat helpers
import { getPoolInfo } from '../fuse/info/get-pool-info';
import { configureEnv } from '../utils';

task('get-pool-info', 'Will return given pool\'s info')
        .addParam("comptroller", "Pool's comptroller address.")
        .addOptionalParam("address", "Will be used to get address' balances in available markets.")
        .setAction(async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const data = await getPoolInfo(
                hre,
                taskArgs.comptroller,
                address,
                fuse
        )

        console.log(data)
})