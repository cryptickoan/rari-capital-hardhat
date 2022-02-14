// Types
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Fuse } from "../../../cjs"

/**
 * @param hre Hardhat runtime environment, passed from task.
 * @param comptroller the pool's comptroller address.
 * @param address the user's address - used to calculate user's balance in listed markets.
 * @param fuse an initiated fuse instance.
 * @returns an array with listed markets and their information.
 */
export async function getPoolInfo(
    hre: HardhatRuntimeEnvironment,
    comptroller: string,
    address: string,
    fuse: Fuse
  ) {
    const comptrollerContract = new hre.ethers.Contract(
        comptroller,
        JSON.parse(
                fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
              ),
        fuse.provider
    )   

    const data = await fuse.contracts.FusePoolLens.callStatic.getPoolAssetsWithData(
            comptroller,
            { from: address }
        )

    return data
  }