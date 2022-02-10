import { ethers } from "hardhat";

async function main() {
  const lensContract = ethers.getContractAt(
    "FusePoolLens",
    "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
  );

  console.log(
    await (
      await lensContract
    ).initialize("0x5fbdb2315678afecb367f032d93f642f64180aa3")
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
