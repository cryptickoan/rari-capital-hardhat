// Ethers
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from '@ethersproject/constants';

// Rari SDK
import { Fuse } from "../../../../../cjs";

/**
 * 
 * @param call - Function call to calculate gas for.
 * @param amountBN - Amount of ETH to send.
 * @param fuse - An initiated Fuse instance.
 * @param address - User's address
 * @returns - { Estimated gas needed for transaction, gasPrice per gas, gasWei total gas in wei. }
 */
export const fetchGasForCall = async (
    call: any,
    amountBN: BigNumber,
    fuse: Fuse,
    address: string
  ) => {
    console.log("HJERE", amountBN.div(2).toString())
    const estimatedGas = BigNumber.from(
      (
        (await call({
          from: address,
          // Cut amountBN in half in case it screws up the gas estimation by causing a fail in the event that it accounts for gasPrice > 0 which means there will not be enough ETH (after paying gas)
          value: amountBN.div(2),
        })) *
        // 50% more gas for limit:
        5
      ).toFixed(0)
    );
    console.log("EST")
  
    const gasInfo = await fuse.provider.getFeeData()
    const gasPrice = gasInfo.maxFeePerGas
    const gasWEI = gasPrice 
        ? estimatedGas
            .mul(gasPrice)
            .add(gasInfo.maxPriorityFeePerGas ?? Zero) 
        : null;
  
    return { gasWEI, gasPrice, estimatedGas };
};