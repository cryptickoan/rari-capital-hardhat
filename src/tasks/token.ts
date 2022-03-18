import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

//@ts-ignore
import abi from 'erc-20-abi';
import { commify } from 'ethers/lib/utils';

const getTokenInfo = (token: string) => {
    switch (token) {
      case "USDC":
        return {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 
          decimals: 9, 
          holderToImpersonate: "0x7344e478574acbe6dac9de1077430139e17eec3d" 
        }
      case "DAI":
        return {
          address: "0x6b175474e89094c44da98b954eedeac495271d0f", 
          decimals: 18,
          holderToImpersonate: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"
        }
      case "D3":
        return {
          address: "0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89",
          decimals:18,
          holderToImpersonate: "0xc13fd05bf9aea66d5f00b7ae36d4ed2605ad0803"
        }
      case "TRIBE":
        return {
          address: "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
          decimals: 18,
          holderToImpersonate: "0x3744da57184575064838bbc87a0fc791f5e39ea2"
        }
      default:
        break;
    }
  }
  
  const getContract = (address: string, holderToImpersonate: string, provider: any, hre: any) => {
    return new hre.ethers.Contract(
      address,
      abi,
      provider.getSigner(holderToImpersonate)
    )
  }
  
  task("sendToken")
    .addParam("to", "Transfer recipient")
    .addParam("amount", "Amount of tokens to be transfered in regular numbers")
    .addParam("token", "Symbol of the token to be transfered in caps. i.e. DAI, USDC")
    .setAction(
      async (taskArgs, hre) => {
        const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
        const recipient = taskArgs.to 
        const amount = taskArgs.amount
        const token = taskArgs.token
        
        const tokenInfo = getTokenInfo(token)
        
        

        if (!tokenInfo) return

        await provider.send(
          "hardhat_impersonateAccount",
          [tokenInfo.holderToImpersonate],
          );
          
          const daiContract = getContract(tokenInfo.address, tokenInfo.holderToImpersonate, provider, hre)
          const balanceOfSender = await daiContract.balanceOf(tokenInfo.holderToImpersonate)
          console.log(balanceOfSender)
          console.log('hey')
        const balanceBefore = await daiContract.balanceOf(recipient)
  
  
        const parsedAmount = tokenInfo.decimals === 18 
          ? hre.ethers.utils.parseEther(amount) 
          : hre.ethers.utils.parseUnits(amount, tokenInfo.decimals) 
  
        const transfer = await daiContract.transfer(recipient, parsedAmount)
  
        const balanceAfter = await daiContract.balanceOf(recipient)
        
        const clean = (number: any) => {
          return commify(
            number.div(
              hre.ethers.constants.WeiPerEther
              ).toString()
            )
        }
  
        console.log(
          "Your balance changed from: " 
          + clean(balanceBefore) 
          + ' => ' 
          + clean(balanceAfter)
        )
      }
    );