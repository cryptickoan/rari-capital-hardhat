import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { Fuse } from "../../../../cjs";
import { fetchGasForCall } from "../utils/fetchGasForCall";
import { Interface, parseEther, formatEther} from "ethers/lib/utils";
import { constants } from "ethers";

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
    // tokenAddress: string,
    provider: Web3Provider | JsonRpcProvider,
    userAddress: string,
    marketAddress: string,
    amount: BigNumber,
    enableAsCollateral: boolean,
    comptrollerAddress: string
) {
    const cTokenInterface = new Interface([
         'function mint() public returns ()'
    ])

    // const cToken = new Contract(
    //     marketAddress,
    //     cTokenInterface,
    //     fuse.provider.getSigner()
    // )

    const cToken = new Contract(
            marketAddress,
            JSON.parse(
                fuse.compoundContracts[
                "contracts/CEtherDelegate.sol:CEtherDelegate"
                ].abi
            ),
            fuse.provider.getSigner()
        );


    const balance = await provider.getBalance(userAddress)

    // 3. Enable as collateral if requested.
    if (enableAsCollateral) {

        const comptrollerInterface = new Interface([
            'function enterMarkets(address[] calldata cTokens) external returns (uint[] memory)',
        ])

        const comptrollerContract = new Contract(
            comptrollerAddress,
            comptrollerInterface,
            provider.getSigner(userAddress)
        )

        // Don't await this, we don't care if it gets executed first!
        await comptrollerContract.enterMarkets([cToken.address]);
    }

    if (balance.eq(amount)) {
        const { gasWEI } = await fetchGasForCall(
            cToken.estimateGas.mint,
            amount,
            fuse,
            userAddress
          );

        // If there's an error fetching gas price return
        if (!gasWEI) return

        console.log(amount.sub(gasWEI))
        const amountUpdated = amount.sub(gasWEI)
        // Mint max amount, after substracting fees
        // Gas price is best handled by the wallet. 
        // On our side we just make sure to leave enough balance to pay for fees.
        await cToken.mint({
            from: userAddress,
            value: amountUpdated
        });

    } else {
        const tx = await cToken.mint({ 
            from: userAddress,
            value: amount
        });
    }
}