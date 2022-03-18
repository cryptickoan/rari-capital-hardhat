// import '@nomiclabs/hardhat-ethers';
// import { task } from 'hardhat/config'; 
// import { Contract } from 'ethers';
// import { Interface } from 'ethers/lib/utils';

// // Hardhat helpers
// import { configureEnv } from '../../utils';

// // Rari SDK
// import { 
//     getPublicPoolsWithData,
//     getPoolUsersWithData, 
//     getVerifiedPoolsWithData, 
//     getPoolsByAccountWithData, 
//     getPoolAssetsWithData,
//     // getPoolSummary, 
// } from '../../@rari-capital/lens';
// import { Fuse } from '../../../cjs';

// task('get-public-pools-with-data', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const answer = await getPublicPoolsWithData(fuse.provider, fuse)
//     console.log(answer)
// })

// task('get-verified-pools-with-data', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const answer = await getVerifiedPoolsWithData(fuse.provider, fuse)
//     console.log(answer)
// })

// task('get-pools-by-account-with-data', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const answer = await getPoolsByAccountWithData(fuse.provider, fuse, address)
//     console.log(answer) 
// })

// task('get-pool-summary', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const comptrollerAddress = "0x42053c258b5cd0b7f575e180DE4B90763cC2358b"

//     const answer = await getPoolSummary(fuse.provider, fuse, comptrollerAddress)
//     console.log(answer) 
// })

// task('get-pool-assets-with-data', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const comptrollerAddress = "0x42053c258b5cd0b7f575e180DE4B90763cC2358b"

//     const answer = await getPoolAssetsWithData(fuse.provider, fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS, comptrollerAddress)
//     console.log(answer) 
// })

// task('get-pool-users-with-data', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
//     const {address, fuse, fuseDeployed} = await configureEnv(hre)
//     if (!fuseDeployed) return

//     const comptrollerAddress = "0x42053c258b5cd0b7f575e180DE4B90763cC2358b"
//     const maxHealth = "10"

//     const answer = await getPoolUsersWithData(fuse.provider, fuse, comptrollerAddress, maxHealth)
//     console.log(answer) 
// })
