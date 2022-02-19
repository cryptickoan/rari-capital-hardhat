# Rari Capital's local fork

This project eases the process of setting up a hardhat localfork with Rari Capital's products.

<details>
<summary> Setup </summary>

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
</details>
      
<details>
<summary>Fuse</summary>
<ul>
<details>     
<summary> Interacion </summary>
<ul>

###### Go through the setup before using any task below.


<details>
    <summary>Deploy an empty pool</summary>

		npx hardhat deploy-pool --network localhost
		
###### This task will output the deployed pool's comptroller address which you will need to run the tasks below:
</details>


<details>
    <summary>Deploy a cToken/market</summary>

		npx hardhat deploy-market --comptroller 0x00...0000 --underlying 0x00...0000 --cfactor 5 --rfactor 0.5 --adminfee 0.05 --network localhost 
	
###### - comptroller is the comptroller address where ctoken/market will be listed.
###### - underlying is the underlying token of the market.
###### - cfactor is the collateral factor of the market. optional
###### - rfactor is the reserve factor. optional.
###### - adminfee is the admin fee. optional.
</details>

      
<details>  
    <summary>Deploy a rewards distributor to a given pool</summary>

	npx hardhat deploy-rd-to-pool --underlying 0x00...0000 --comptroller 0x00...0000 --network localhost
		
###### - underlying is the address of token to distribute.
###### - comptroller is the comptroller address to add rd.
</details>

<details>
<summary>Deploy Uniswap V2 Twap Oracle</summary>
    
    npx hardhat deploy-unitwap-v2

###### task not complete yet, it'll deploy an oracle but will not add it to the comptroller.

</details>


<details>
<summary>Market Interaction</summary>
<ul>

<details>
<summary>Supply</summary>
        
        
    npx hardhat supply --underlying 0x00...0000 --market 0x00...0000 --comptroller 0x00...0000 --amount 1000 --collateralize true --user 0x00...0000
    

###### - underlying is the market's underlying asset.
###### - market is the address of the market.
###### - comptroller is the address where market is listed.
###### - amount is the amount of tokens to supply.
###### - collateralize is optional. If true you will enter the market.
###### - user is address of supplier. optional. default to hardhat's first address.
</details>
<details>
<summary>Borrow</summary>
        
        
    npx hardhat borrow --market 0x00...0000 --amount 1000 --token 0x00..0000
    

###### - market is the address of the market.
###### - amount is the amount of tokens to supply.
###### - token is the market's underlying asset.
</details>
<details>
<summary>Repay</summary>
        
        
    npx hardhat repay --market 0x00...0000 --amount 1000 --token 0x00..0000
    

###### - market is the address of the market.
###### - amount is the amount of tokens to supply.
###### - token is the market's underlying asset.
</details>
<details>
<summary>Withdraw</summary>
        
        
    npx hardhat withdraw --market 0x00...0000 --amount 1000 --token 0x00..0000
    

###### - market is the address of the market.
###### - amount is the amount of tokens to supply.
###### - token is the market's underlying asset.
</details>

</ul>
</details>
</ul>
</details> 

<details>
    <summary>Fetching info</summary>
<ul>

###### Go through the setup, and deploy a pool before using tasks below.
<details>
    <summary>To get the pool's information</summary>

    npx hardhat get-pool-info --comptroller 0x00...0000 --network localhost
      
###### - comptroller is the address of the comptroller that will be used to get information.
</details>
</ul>
</details>
</ul>
</details>

<details>
<summary>Misc</summary>
<ul>
<details>
<summary>Get a token</summary>

    npx hardhat sendToken --to 0x00...0000 --amount 1000 --token DAI
    
###### - to is the recepient address.
###### - amount is the amount of tokens to send
###### - token is the tokens symbol. Currently supports DAI and USDC.
    
</details>
</ul>
</details>
    
   

<!-- 
# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations). -->
