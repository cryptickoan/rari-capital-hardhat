import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { Fuse } from "../../../../cjs";
import { fetchGasForCall } from "../utils/fetchGasForCall";
import { Interface, parseEther, formatEther} from "ethers/lib/utils";
import { constants } from "ethers";
import { collateral } from "../collateral/collateral";

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param provider - An initiated ethers provider.
 * @param userAddress - The depositing user address.
 * @param marketAddress - The markets/ctoken address. This is where funds are supplied.
 * @param amount - Amount of tokens to be supplied. Bignumber
 * @param enableAsCollateral - If true supplied amount will be used as collateral.
 * @param comptrollerAddress - The address of comptroller where market is listed.
 */
export async function supplyCEther(
    fuse: Fuse,
    provider: Web3Provider | JsonRpcProvider,
    userAddress: string,
    marketAddress: string,
    amount: BigNumber,
    enableAsCollateral: boolean,
    comptrollerAddress: string
) {
    // 1. Initiate contract
    const cTokenInterface = new Interface([
         'function mint() payable'
    ])

    const cToken = new Contract(
        marketAddress,
        cTokenInterface,
        fuse.provider.getSigner()
    )

    // 2. Enable as collateral if requested.
    if (enableAsCollateral) {
        await collateral(
            comptrollerAddress,
            [marketAddress],
            "enter",
            provider
        )
    }

    const balance = await provider.getBalance(userAddress)

    if (balance.eq(amount)) {
        // If user is supplying all its balance, we need to leave enough
        // available for gas.

        //  1. Estimate gas for call.
        const { gasWEI } = await fetchGasForCall(
            cToken.estimateGas.mint,
            amount,
            fuse,
            userAddress
          );

            // If there's an error fetching gas price return
            if (!gasWEI) return

        // 2. From amount to supply substract estimated gas.
        const amountUpdated = amount.sub(gasWEI)

        // 3. Mint
            // Gas price is best handled by the wallet. 
            // On our side we just make sure to leave enough balance to pay for fees.
        await cToken.mint({
            from: userAddress,
            value: amountUpdated
        });

    } else {
        await cToken.mint({ 
            from: userAddress,
            value: amount
        });
    }
}