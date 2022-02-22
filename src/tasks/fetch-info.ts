import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import Fuse from '../../cjs/Fuse';

// Hardhat helpers
import { getPoolInfo } from '../fuse/info/get-pool-info';
import { configureEnv } from '../utils';
import { fetchCTokenData } from '../../@rari-capital/fetch-data/fetch-ctoken-data';
import { fetchFusePoolData } from '../../@rari-capital/fetch-data/fetch-fuse-pool-data';
import { getPoolAssetsWithData } from '../../@rari-capital/lens';

task('get-pool-info', 'Will return given pool\'s info')
        .addParam("comptroller", "Pool's comptroller address.")
        .addOptionalParam("address", "Will be used to get address' balances in available markets.")
        .setAction(async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const data = await getPoolAssetsWithData(
                fuse.provider,
                fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS,
                address,
        )

        console.log(data)
})

task('get-market-data', 'Will return given markets\'s info')
        .addParam("market", "Address of market to look for.")
        .addOptionalParam("comptroller", "Address of comptroller where market is listed.")
        .setAction(async (taskArgs, hre) => {
        const {address, provider, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const data = await fetchCTokenData(
                taskArgs.market,
                taskArgs.comptroller,
                provider
        )

        console.log(data)
})

task("fetch-fuse-pool-data", async (taskArgs, hre) => {
        const {address, fuse, fuseDeployed} = await configureEnv(hre)
        if (!fuseDeployed) return

        const answer = await fetchFusePoolData(
                fuse,
                "1",
                address
        )
        console.log(answer)
})
