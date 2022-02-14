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

		npx hardhat deploy-fuse --network localhost 
        
      This will deploy a clean instance of fuse in your localnode.
      
      
### Available scripts:  

##### make sure to run step 5 before using tasks below.

- To deploy an empty pool:

		npx hardhat deploy-pool --network localhost
		
These task will output the deployed pool's comptroller address which you will need to run the tasks below:

- To deploy a cToken/market:

		npx hardhat deploy-market 
        --comptroller ${pool's comptroller address} 
        --underlying ${underlying token address} 
        --network localhost
        --cfactor ${collateral factor. If 50% user will only be able to borrow 50% of their collateral value}
        --rfactor ${reserve factor. Percentage that will go to reserves.}
        --adminfee ${Percentage admin fee.}
    ###### last 3 args are optional and should be a number between 0 and 1.
        
- To deploy a rewards distributor

		npx hardhat deploy-rd-to-pool 
        --underlying ${address of token to be distributed}
        --comptroller ${pool's comptroller address}  
        --network localhost

- To get the pool's information:

        npx hardhat get-pool-info 
        --comptroller ${pool's comptroller address} 
        --network localhost
        

<!-- 
# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations). -->
