import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse
import { FuseDeployment } from '../fuse/deployer';
import Fuse from '../../cjs/Fuse';

import colors from 'colors';
import { deployEmptyPool } from '../scripts/deploy-empty-pool';
import { deployMarket } from '../scripts/deploy-market';


task('deploy-fuse', 'Deploys a clean fuse instance', async (taskArgs, hre) => {
        const [deployer] = await hre.ethers.getSigners();
        const fuse = new FuseDeployment(deployer, hre)

        await fuse.deploy();
})

task('deploy-pool', 'Deploys an empty pool', async (taskArgs, hre) => {
        // User address. 
        //  - Using hardhat default addresses.
        const address = (await hre.ethers.getSigners())[0].address

        // Initiate a fuse sdk instance.
        //  - Contract addresses are preset to the ones that would be created if
        //      the node is started at block: 14167154. If node is pinned to any other
        //      block, the addresses will not match configuration, and the sdk will not work.
        //      This happens because one of the salts used to create the contract addresses is the block number.
        const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        const fuse = new Fuse(provider, 31337);

        try {
                await deployEmptyPool(fuse, hre, address);
        } catch (e) {
                console.error(e);
        }
})

task('deploy-asset', 'Deploys an asset to the given comptroller.', async (taskArgs, hre) => {
       // User address. 
        //  - Using hardhat default addresses.
        const address = (await hre.ethers.getSigners())[0].address;
        const _poolAddress = "0x42053c258b5cd0b7f575e180DE4B90763cC2358b";

        // Initiate a fuse sdk instance.
        //  - Contract addresses are preset to the ones that would be created if
        //      the node is started at block: 14167154. If node is pinned to any other
        //      block, the addresses will not match configuration, and the sdk will not work.
        //      This happens because one of the salts used to create the contract addresses is the block number.
        const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        const fuse = new Fuse(provider, 31337);
        
        try {
                await deployMarket(
                        fuse,
                        _poolAddress, 
                        address,
                        "0x6b175474e89094c44da98b954eedeac495271d0f"
                );
        } catch (e) {
                console.error(e)
        }
})

task('deploy-')