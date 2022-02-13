import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { FuseDeployment } from '../fuse-deployer';

task('deploys', 'deploys a clean fuse instance', async (taskArgs, hre) => {
        const [deployer] = await hre.ethers.getSigners();
        const fuse = new FuseDeployment(deployer, hre)

        await fuse.deploy();
})