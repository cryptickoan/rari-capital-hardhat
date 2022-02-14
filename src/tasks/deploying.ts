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
import { deployRdToPool } from '../fuse/deploy/deploy-rewards-distributor-to-pool';
import { configureEnv } from '../utils';


task('deploy-fuse', 'Deploys a clean fuse instance', async (taskArgs, hre) => {
        const [deployer] = await hre.ethers.getSigners();
        const fuse = new FuseDeployment(deployer, hre)

        await fuse.deploy();
})

task('deploy-pool', 'Deploys an empty pool', async (taskArgs, hre) => {
        const { fuse, address } = await configureEnv(hre)

        // 1. Deploy pool.
        console.info(
                colors.green(
                        "Initiating pool deployment."
                )
        )

        try {
                await deployEmptyPool(fuse, hre, address);
        } catch (e) {
                console.error(e);
        }
})

task('deploy-market', 'Deploys an asset to the given comptroller.')
        .addParam('comptroller', "Pool's comptroller address.")
        .addParam('underlying', "Underlying asset's address for the cToken. e.g DAI address")
        .addOptionalParam('cfactor', "CollateralFactor. Will determine loan to value ratio. Its a percentage so it should be between 0 - 1.")
        .addOptionalParam('rfactor', "ReserveFactor. Will determine ratio of fees to go to the reserve. Its a percentage so it should be between 0 - 1.")
        .addOptionalParam('adminfee', "Will determine percentage admin fee. Its a percentage so it should be between 0 - 1.")
        .setAction( async (taskArgs, hre) => {
        const { fuse, address } = await configureEnv(hre)
        
        // 1. Deploy market.
        console.info(
                colors.green(
                        "Initiating market deployment."
                )
        )

        try {
                await deployMarket(
                        fuse,
                        taskArgs.comptroller, 
                        address,
                        taskArgs.underlying,
                        taskArgs.cfactor ?? 0.5,
                        taskArgs.rfactor ?? 0.1,
                        taskArgs.adminFee ?? 0.05
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

        // Done!
        console.log(
                colors.green(
                        "Deployed asset sucessfully!"
                )
        )

        console.table(
                {
                  contract: "cToken delegate", 
                  address: events.slice(-1)[0].args[0]
                }
        )
})

task('deploy-rd-to-pool')
        .addParam('underlying', "Address of asset that will be distributed. e.g. DAI address ")
        .addParam('comptroller', "Comptroller address to which the rewards distributor will be added to.")
        .addOptionalParam('rdDeployer', "If present this address will be used to deploy the rewards")
        .setAction(async (taskArgs, hre) => {
                const {fuse, address} = await configureEnv(hre)

                try {
                        await deployRdToPool(
                                fuse,
                                hre,
                                taskArgs.underlying,
                                taskArgs.comptroller,
                                address,
                                taskArgs.rdDeployer ?? undefined
                        )
                } catch (e) {
                        console.error(e)
                }

        }
)

