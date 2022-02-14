import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import Fuse from '../../cjs/Fuse';

// Colors
import colors from 'colors';

// Hardhat helpers
import { FuseDeployment } from '../fuse/deploy/deployer';
import { deployEmptyPool } from '../fuse/deploy/deploy-empty-pool';
import { deployMarket } from '../fuse/deploy/deploy-market';
import { getPoolInfo } from '../fuse/info/get-pool-info';
import { deployRdToPool } from '../fuse/deploy/deploy-rewards-distributor-to-pool';


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

task('deploy-market', 'Deploys an asset to the given comptroller.')
        .addParam('comptroller', "Pool's comptroller address.")
        .addParam('underlying', "Underlying asset's address for the cToken. e.g DAI address")
        .setAction( async (taskArgs, hre) => {
       // User address. 
        //  - Using hardhat default addresses.
        const address = (await hre.ethers.getSigners())[0].address;

        // Initiate a fuse sdk instance.
        //  - Contract addresses are preset to the ones that would be created if
        //      the node is started at block: 14167154. If node is pinned to any other
        //      block, the addresses will not match configuration, and the sdk will not work.
        //      This happens because one of the salts used to create the contract addresses is the block number.
        const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        const fuse = new Fuse(provider, 31337);
        
        // 1. Deploy market.
        try {
                await deployMarket(
                        fuse,
                        taskArgs.comptroller, 
                        address,
                        taskArgs.underlying
                );
        } catch (e) {
                console.error(e)
        }

        // 2. Filter events to get cToken address.
        const comptrollerContract = new hre.ethers.Contract(
                taskArgs.comptroller,
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

        // Done
        console.log(colors.green("Deployed asset sucessfully!"))

        console.table([
          {contract: "cToken delegate", address: events.slice(-1)[0].args[0]}
        ])

})

task('deploy-rd-to-pool')
        .addParam('underlying', "Address of asset that will be distributed. e.g. DAI address ")
        .addParam('comptroller', "Comptroller address to which the rewards distributor will be added to.")
        .addOptionalParam('rdDeployer', "If present this address will be used to deploy the rewards")
        .setAction(async (taskArgs, hre) => {
                // User address. 
                //  - Using hardhat default addresses.
                const address = (await hre.ethers.getSigners())[0].address;

                // Initiate a fuse sdk instance.
                //  - Contract addresses are preset to the ones that would be created if
                //      the node is started at block: 14167154. If node is pinned to any other
                //      block, the addresses will not match configuration, and the sdk will not work.
                //      This happens because one of the salts used to create the contract addresses is the block number.
                const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
                const fuse = new Fuse(provider, 31337);

                await deployRdToPool(
                        fuse,
                        hre,
                        taskArgs.underlying,
                        taskArgs.comptroller,
                        address,
                        taskArgs.rdDeployer ?? undefined
                )
        }
)

