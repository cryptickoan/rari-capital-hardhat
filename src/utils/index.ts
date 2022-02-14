// Rari SDK
import { Fuse } from "../../cjs";

// Types
import { HardhatRuntimeEnvironment } from "hardhat/types";

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

    return {
        address,
        provider,
        fuse
    }
}