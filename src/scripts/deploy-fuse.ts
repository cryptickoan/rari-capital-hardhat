import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log();
  // 1. Deploy FusePoolDirectory
  const FusePoolDirectoryContractFactory = await ethers.getContractFactory(
    "FusePoolDirectory"
  );
  const FusePoolDirectory = await FusePoolDirectoryContractFactory.deploy();

  // 2. Deploy FuseSafeLiquidator
  const SafeLiquidator = await (await ethers.getContractFactory("FuseSafeLiquidator")).deploy();

  // 3. Deploy FuseFeeDistributor
  const FuseFee = await (await ethers.getContractFactory("FuseFeeDistributor")).deploy();

  // 4. Deploy Lens
  const Lens = await (await ethers.getContractFactory("FusePoolLens")).deploy();

  const LensSecondary = await (
    await ethers.getContractFactory("FusePoolLensSecondary")
  ).deploy();


  // 5. Initiate Lens
  await Lens.initialize(FusePoolDirectory.address);
  await LensSecondary.initialize(FusePoolDirectory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
