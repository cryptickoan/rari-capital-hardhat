// Rari SDK
import { Fuse } from "../../cjs";

// Types
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Colors
import colors from 'colors';

export const configureEnv = async (
    hre: HardhatRuntimeEnvironment
) => {
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

    // 0. Check fuse was deployed.
    const fuseDeployed = await check(fuse)

    return {
        address,
        provider,
        fuse,
        fuseDeployed
    }
}

export const check = async (fuse: Fuse) => {
    try {
        await fuse.contracts.FusePoolDirectory.callStatic.owner()
        return true
    } catch(e: any) {
            console.log(colors.red(
                    "Transaction failed: "
                    ))

            console.log(e)

            console.log(colors.yellow(
                    "Please run deploy-fuse task before running this task. You may need to reset your node."
            ))
            return false
    }
}