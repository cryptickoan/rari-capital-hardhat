# Rari Capital's local fork

This project eases the process of setting up a hardhat localfork with Rari Capital's products.

1. You first run 

		npm install 

2. The next step is compilation but one contract needs to be modified before because of incompatible solidity compilator versions

    Go to `node_modules/@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol`

    in Line 2 you'll find:
        `pragma solidity >=0.7.0;`

    change it to:
        `pragma solidity 0.6.12;`
        
     <sub>please let me know if theres a better way to do this I couldn't find it :)</sub>

3. Run

		npx hardhat compile
        
4. Start hardhat node

		npx hardhat node
        
      This will start a mainnet fork pinned at block: 14167154
      
5. Open a second terminal and run:

		npx hardhat --network localhost run scripts/deploy-fuse.ts
        
      This will deploy a clean instance of fuse in your localnode.
      
      
### Available scripts:  

- To deploy an empty pool

		npx hardhat --network localhost run scripts/deploy-empty-pool.ts

- To deploy a pool with one cToken/market

		npx hardhat --network localhost run scripts/deploy_pool.ts
        
These two scripts will output the deployed pool's comptroller address which you will need to run the scripts below:

- To deploy a rewards distributor

		npx hardhat --network localhost run scripts/deploy-rewards-distributor.ts 

- To deploy a cToken

		npx hardhat --nework localhost run scripts/deploy-market.ts
        
        
   **more scripts in development**
        

<!-- 
# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations). -->
