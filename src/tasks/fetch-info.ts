import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Fuse SDK
import Fuse from '../../cjs/Fuse';

// Hardhat helpers
import { getPoolInfo } from '../fuse/info/get-pool-info';

task('get-pool-info', 'Will return given pool\'s info')
        .addParam("comptroller", "Pool's comptroller address.")
        .addOptionalParam("address", "Will be used to get address' balances in available markets.")
        .setAction(async (taskArgs, hre) => {
        // User address. 
        //  - Using hardhat default addresses.
        const address = taskArgs.address ?? (await hre.ethers.getSigners())[0].address;

        // Initiate a fuse sdk instance.
        //  - Contract addresses are preset to the ones that would be created if
        //      the node is started at block: 14167154. If node is pinned to any other
        //      block, the addresses will not match configuration so the sdk will not work.
        //      This happens because one of the salts used to create the contract addresses is the block number.
        const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        const fuse = new Fuse(provider, 31337);
        const comptroller = "0x14294f7c1DD4e2A1d61cF52A444adFE5139Cb2dD"

        const data = await getPoolInfo(
                hre,
                comptroller,
                address,
                fuse
        )

        console.log(data)
})