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

        await fuseDeployer.deploy(true);

        // Configure
        const {fuse, address} = await configureEnv(hre)

        
        // 2. Deploy empty pool.
        let emptyPool
        try {
            console.log(colors.yellow("(2/5) Deploying empty pool."))
            emptyPool = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("-- Empty pool deployed successfully!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
        }
        

        // 3. Deploy pool 2.
        let poolAddress
        try {
            console.log(colors.yellow("(3/5) Deploying configuredPool"))
            poolAddress = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("-- Deployed pool successfully!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
                return
        }
        
        // Deploy dai market to pool2.
        try {
            console.log(colors.yellow("(4/5) Deploying DAI market to configuredPool"))
            await deployMarket(
                    fuse,
                    poolAddress, 
                    address,
                    "0x6b175474e89094c44da98b954eedeac495271d0f",
                    5,
                    0.1,
                    0.05
                );

                // 2. Filter events to get cToken address.
                const comptrollerContract = new hre.ethers.Contract(
                        poolAddress,
                        JSON.parse(
                                fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
                        ),
                        fuse.provider
                )   
                
                let events: any = await comptrollerContract.queryFilter(
                        comptrollerContract.filters.MarketListed() ,
                        (await fuse.provider.getBlockNumber()) - 10,
                        "latest"
                );
                console.table([
                        {
                                market: "DAI", 
                                address: events.slice(-1)[0].args[0]
                        },
                ])


                // Done!
                console.log(
                        colors.green(
                                "-- Deployed market sucessfully!"
                        )
                )
        } catch (e) {
                console.error(e)
                console.log(colors.red("Please reset node and start again."))
                return
        }

        try {
                console.log(colors.yellow("(5/5) Deploying ETH market to configuredPool"))
                await deployMarket(
                        fuse,
                        poolAddress, 
                        address,
                        "0",
                        5,
                        0.1,
                        0.05
                );

                // 2. Filter events to get cToken address.
                const comptrollerContract = new hre.ethers.Contract(
                        poolAddress,
                        JSON.parse(
                                fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
                        ),
                        fuse.provider
                )   
                
                let events: any = await comptrollerContract.queryFilter(
                        comptrollerContract.filters.MarketListed() ,
                        (await fuse.provider.getBlockNumber()) - 10,
                        "latest"
                );

                console.table([
                        {
                                market: "Eth", 
                                address: events.slice(-1)[0].args[0]
                        },
                ])

                // Done!
                console.log(
                        colors.green(
                                "-- Deployed market sucessfully!"
                        )
                )
            } catch (e) {
                    console.error(e)
                    console.log(colors.red("Please reset node and start again."))
                    return
            }

        console.log(colors.green("Test environment configured successfully! These are your pools:"))

        console.table([
            {comptroller: "emptyPool", address: emptyPool},
            {comptroller: "configuredPool", address: poolAddress}
        ])

        
})