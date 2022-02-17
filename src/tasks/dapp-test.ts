import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';


// Colors
import colors from 'colors';

// Hardhat helpers
import { FuseDeployment } from '../fuse/deploy/deployer';
import { deployEmptyPool } from '../fuse/deploy/deploy-empty-pool';
import { deployMarket } from '../fuse/deploy/deploy-market';
import { configureEnv } from '../utils';


task('setup', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
        // 1. Deploy fuse.
        const [deployer] = await hre.ethers.getSigners();
        const fuseDeployer = new FuseDeployment(deployer, hre)

        await fuseDeployer.deploy();

        // Configure
        const {fuse, address} = await configureEnv(hre)

        
        // 2. Deploy empty pool.
        let emptyPool
        try {
            console.log(colors.yellow("Deploying empty pool."))
            emptyPool = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("Empty pool deployed successfully!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
        }
        

        // 3. Deploy pool 2.
        let poolAddress
        try {
            console.log(colors.yellow("Deploying configuredPool"))
            poolAddress = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("Deployment successful!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
                return
        }
        
        // Deploy dai market to pool2.
        try {
            console.log(colors.yellow("Deploying DAI market to configuredPool"))
            await deployMarket(
                    fuse,
                    poolAddress, 
                    address,
                    "0x6b175474e89094c44da98b954eedeac495271d0f",
                    0.5,
                    0.1,
                    0.05
            );
            console.log(colors.green("Deployment successful!"))
        } catch (e) {
                console.error(e)
                console.log(colors.red("Please reset node and start again."))
                return
        }

        console.log(colors.green("Test environment configured successfully!"))

        console.table([
            {contracts: "emptyPool", address: emptyPool},
            {contracts: "configuredPool", address: poolAddress}
        ])
})