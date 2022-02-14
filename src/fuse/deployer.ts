import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// Types
import { Signer } from "ethers";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { FusePoolLens, FusePoolLensSecondary } from '../../typechain';

// Colors
import colors from 'colors';


export class FuseDeployment {
    public declare readonly deployer: Signer;
    public declare hre: HardhatRuntimeEnvironment;
    public FuseDirectoryAddress?: string;
    public SafeLiquidatorAddress?: string;
    public FeeDistributorAddress?: string;
    public LensAddress?: string;
    public LensSecondaryAddress?: string;

    constructor(deployer: SignerWithAddress, hre: any) {
      this.deployer = deployer;
      this.hre = hre
    }

    async deployFuseDirectory() {
        // 1. Deploy FusePoolDirectory
        const FusePoolDirectoryContractFactory = await this.hre.ethers.getContractFactory(
            "FusePoolDirectory"
        );
        const FusePoolDirectory = await FusePoolDirectoryContractFactory.deploy();
        this.FuseDirectoryAddress = FusePoolDirectory.address;
        return this.FuseDirectoryAddress;
    }

    async deploySafeLiquidator() {
        // 2. Deploy FuseSafeLiquidator
        const SafeLiquidatorContractFactory = await this.hre.ethers.getContractFactory(
            "FuseSafeLiquidator"
        );

        const SafeLiquidator = await SafeLiquidatorContractFactory.deploy();
        this.SafeLiquidatorAddress = SafeLiquidator.address;
        return this.SafeLiquidatorAddress
    }

    async deployFeeDistributor() {
        const FeeDistributorContractFactory = await this.hre.ethers.getContractFactory(
            "FuseFeeDistributor"
        );

        const FeeDistributor = await FeeDistributorContractFactory.deploy()
        this.FeeDistributorAddress = FeeDistributor.address
        return this.FeeDistributorAddress
    }

    async deployLens() {
        // 4. Deploy Lens
        const Lens = await (
            await this.hre.ethers.getContractFactory("FusePoolLens")
        ).deploy();

        const LensSecondary = await (
            await this.hre.ethers.getContractFactory("FusePoolLensSecondary")
        ).deploy();

        this.LensAddress = Lens.address;
        this.LensSecondaryAddress = LensSecondary.address

        await this.initiateLens(Lens, LensSecondary)
        return([this.LensAddress, this.LensSecondaryAddress])
    }

    async initiateLens(
        Lens: FusePoolLens, 
        LensSecondary: FusePoolLensSecondary
    ) {
        if (this.FuseDirectoryAddress) {
            // 5. Initiate Lens
            await Lens.initialize(this.FuseDirectoryAddress);
            await LensSecondary.initialize(this.FuseDirectoryAddress);
        }
    }

    async deploy() {
         console.info(colors.yellow("Initiating deployment."))

        const directory = await this.deployFuseDirectory();
        const liquidator = await this.deploySafeLiquidator();
        const distributor = await this.deployFeeDistributor();
        const lens = await this.deployLens();

        console.table([
            {contract: "Directory: ", address: directory},
            {contract: "Safe liquidator: ", address: liquidator},
            {contract: "Fee distributor: ", address: distributor},
            {contract: "Primary lens: ", address: lens[0]},
            {contract: "Secondary lens: ", address: lens[1]},
        ])
       
        console.info(colors.green("Fuse deployed successfully."))

         
    }
}