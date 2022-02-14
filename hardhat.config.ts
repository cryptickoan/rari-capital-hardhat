import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import './src/tasks'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
      version: "0.6.12"
      },
      // {
      // version: "0.7.0"
      // }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN",
        blockNumber: 14167154
      },
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;
