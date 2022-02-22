import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Hardhat helpers
import { configureEnv } from '../utils';

// Rari SDK
import { 
    getAllPools, 
    getPoolsByAccount,
    getPool,
    getPublicPools,
    setPoolName,
    getPublicPoolsByVerification 
} from '../../@rari-capital/directory'

task('get-all-pools', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = 1

    const answer = await getAllPools(fuse.provider, fuse)
    console.log(answer)
})

task('get-pool', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = "1"

    const answer = await getPool(fuse.provider, id, fuse.addresses.FUSE_POOL_DIRECTORY_CONTRACT_ADDRESS)
    console.log(answer)
})

task('get-pools-by-account', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = 1

    const answer = await getPoolsByAccount(fuse.provider, address, fuse)
    console.log(answer)
})

task('get-public-pools', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = 1

    const answer = await getPublicPools(fuse.provider, fuse)
    console.log(answer)
})

task('set-pool-name', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = 1

    const answer = await setPoolName(fuse.provider, fuse, 1, 'Koan')
    console.log(answer)
})

task('get-pools-by-verification', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
    const {address, fuse, fuseDeployed} = await configureEnv(hre)
    if (!fuseDeployed) return

    const id = 1

    const answer = await getPublicPoolsByVerification(fuse.provider, fuse)
    console.log(answer)
})