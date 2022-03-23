import "@nomiclabs/hardhat-ethers";
import { Contract, providers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// ABIS
import TurboRouter from "../abis/TurboRouter.sol/TurboRouter.json";
import TurboMaster from  "../abis/TurboMaster.sol/TurboMaster.json";
import ERC20 from "../abis/ERC20.sol/ERC20.json"
import CERC20 from "../abis/CERC20.sol/CERC20.json"
import TurboComptroller from "../abis/Comptroller/comptroller.json";
import TurboLens from "../abis/TurboLens.sol/TurboLens.json";
import TurboBooster from "../abis/TurboBooster.sol/TurboBooster.json";
import TurboSafe from "../abis/TurboSafe.sol/TurboSafe.json";
import TurboAuthority from "../abis/Auth.sol/Authority.json";
import MultiRolesAuthority from "../abis/MultiRolesAuthority.sol/MultiRolesAuthority.json";
import Oracle from '../../../../artifacts/contracts/oracles/MasterPriceOracle.sol/MasterPriceOracle.json'

// Utils
import { Interface } from "ethers/lib/utils";
import { TurboAddresses } from "../utils/constants";


//** Contracts **/
export const createTurboRouter = async (hre: HardhatRuntimeEnvironment, id: number) => {
  const signers = await hre.ethers.getSigners();

  const turboRouterContract = new Contract(
    TurboAddresses[id].ROUTER,
    TurboRouter.abi,
    signers[0]
  );

  return turboRouterContract;
};

export const createERC20 = async (
  hre: HardhatRuntimeEnvironment,
  token: string
) => {
  const signers = await hre.ethers.getSigners();

  const erc20Contract = new Contract(token, ERC20.abi, signers[0]);

  return erc20Contract;
};

export const createTurboMaster = async (hre: HardhatRuntimeEnvironment, id: number) => {
  const signers = await hre.ethers.getSigners();
  
  const turboMasterContract = new Contract(
    TurboAddresses[id].MASTER,
    TurboMaster.abi,
    signers[0]
  );

  return turboMasterContract;
};

export const createTurboComptroller = async (
  hre: HardhatRuntimeEnvironment,
  id: number
) => {
  const signers = await hre.ethers.getSigners();

  const turboRouterContract = new Contract(
    TurboAddresses[id].COMPTROLLER,
    TurboComptroller,
    signers[0]
  );

  return turboRouterContract;
};

export const createTurboLens = async (hre: HardhatRuntimeEnvironment, id: number) => {
  const signers = await hre.ethers.getSigners();

  const turboLens = new Contract(
    TurboAddresses[id].LENS,
    TurboLens.abi,
    signers[0]
  );

  return turboLens;
};

export const createTurboBooster = async (hre: HardhatRuntimeEnvironment, id: number) => {
  const signers = await hre.ethers.getSigners();

  const turboBoosterContract = new Contract(
    TurboAddresses[id].BOOSTER,
    TurboBooster.abi,
    signers[0]
  );

  return turboBoosterContract;
};

export const createTurboSafe = async (
  hre: HardhatRuntimeEnvironment,
  turboSafe: string
) => {
  const signers = await hre.ethers.getSigners();

  const turboSafeContract = new Contract(turboSafe, TurboSafe.abi, signers[0]);

  return turboSafeContract;
};

export const createTurboAuthority = async (
  provider: providers.JsonRpcProvider | providers.Web3Provider,
  authorityAddress: string
) => {
  const turboAuthorityContract = new Contract(
    authorityAddress,
    TurboAuthority.abi,
    provider.getSigner()
  );

  return turboAuthorityContract;
};

export const createMultiRolesAuthority = async (
  hre: HardhatRuntimeEnvironment,
  authorityAddress: string
) => {
  const signers = await hre.ethers.getSigners();

  const turboAuthorityContract = new Contract(
    authorityAddress,
    MultiRolesAuthority.abi,
    signers[0]
  );

  return turboAuthorityContract;
};


export const createCERC20 = async (hre: HardhatRuntimeEnvironment, tokenAddress: string) => {
  const signers = await hre.ethers.getSigners()

  const CERC20Contract = new Contract(
      tokenAddress,
      CERC20.abi,
      signers[0]
  )

  return CERC20Contract
}

export const createOracle = async (provider: providers.Provider, oracleAddress: string) => {
  const oracleContract = new Contract(
    oracleAddress,
    Oracle.abi,
    provider
  )

  return oracleContract
}


/** Interfaces **/

// Turbo Ifaces
export const ITurboRouter = new Interface(TurboRouter.abi);
export const ITurboMaster = new Interface(TurboMaster.abi);
export const ITurboComptroller = new Interface(TurboComptroller);
export const ITurboSafe = new Interface(TurboSafe.abi);
export const ITurboBooster = new Interface(TurboBooster.abi);
export const ITurboLens = new Interface(TurboLens.abi);
export const ITurboAuthority = new Interface(TurboAuthority.abi);

// Etc Ifaces
export const IERC20 = new Interface(ERC20.abi);
export const ICERC20 = new Interface(CERC20.abi);