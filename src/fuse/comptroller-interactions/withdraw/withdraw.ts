// Ethers
import { Contract } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Interface, parseEther, parseUnits  } from "ethers/lib/utils";

// Fuse SDK
import { testForCTokenErrorAndSend } from "../utils/testForCTokenErrorAndSend";

/**
 * @param cTokenAddress - Address of market to withdraw from.
 * @param amount - The amount to withdraw.
 * @param provider - An initiated ethers provider.
 * @param tokenAddress - Address of the market's underlying asset.
 * @param decimals - Underlying token's decimals. i.e DAI = 18.
 */
export async function withdraw(
    cTokenAddress: string,
    amount: string,
    provider: Web3Provider | JsonRpcProvider,
    tokenAddress: string,
    decimals?: number
) {
    // 1. Initiate market/ctoken contract.
    const cTokenInterface = new Interface([
        'function redeemUnderlying(uint redeemAmount) external returns (uint)'
    ])

    const cTokenContract = new Contract(
        cTokenAddress,
        cTokenInterface,
        provider.getSigner()
    )

    // 2. Parse given amount to the underlying asset's notation.
        // Fetch decimals if not given.
        if(!decimals && tokenAddress != '0'){
            decimals = await getDecimals(
                tokenAddress,
                provider
            )
        }
    const parsedAmount = decimals === 18 || tokenAddress === '0' 
        ? parseEther(amount) 
        : parseUnits(amount, decimals)
    
    let tx = await testForCTokenErrorAndSend(
        cTokenContract.callStatic.redeemUnderlying,
        parsedAmount,
        cTokenContract.redeemUnderlying,
        "Cannot withdraw this amount right now!"
      );

    await tx.wait(1)
}

function getDecimals(
    tokenAddress: string,
    provider: Web3Provider | JsonRpcProvider
) {
    const erc20Interface = new Interface([
        'function decimals() public view returns (uint8)'
    ])

    const erc20Contract = new Contract(
        tokenAddress,
        erc20Interface,
        provider.getSigner()
    )

    return erc20Contract.callStatic.decimals()
} 