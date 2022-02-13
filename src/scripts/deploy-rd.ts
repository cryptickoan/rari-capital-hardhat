import { Fuse } from "../cjs";
import { ethers } from "hardhat";

export async function deployRd() {
    console.log(process.env)
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    const fuse = new Fuse(provider, 31337)

    const deployedDistributor = await fuse.deployRewardsDistributor(
        "0x6b175474e89094c44da98b954eedeac495271d0f",
        {
          from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }
      );


    const functionInterface = [
        'function _addRewardsDistributor(address RdAddress)'
    ]

    const comptrollerContract = new ethers.Contract(
        "0x42053c258b5cd0b7f575e180DE4B90763cC2358b",
        functionInterface,
        provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    )

    await comptrollerContract._addRewardsDistributor(deployedDistributor.address,         )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployRd().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  