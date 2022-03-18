
// Types
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

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
        const FusePoolDirectoryContractFactory = await this.hre.ethers.getContractFactory(
            "FusePoolDirectory"
        );
        const FusePoolDirectory = await FusePoolDirectoryContractFactory.deploy();
        this.FuseDirectoryAddress = FusePoolDirectory.address;
        return this.FuseDirectoryAddress;
    }

    async deploySafeLiquidator() {
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
        Lens: Contract, 
        LensSecondary: Contract
    ) {
        if (this.FuseDirectoryAddress) {
            // 5. Initiate Lens
            await Lens.initialize(this.FuseDirectoryAddress);
            await LensSecondary.initialize(this.FuseDirectoryAddress);
        }
    }

    async deploy(setup?: boolean) {
        const stringToShow = setup ? "(1/5) Initiating Fuse deployment." : "Initiating deployment."
         console.info(colors.yellow(stringToShow))

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
       
        console.info(colors.green("-- Fuse deployed successfully."))

         
    }
}