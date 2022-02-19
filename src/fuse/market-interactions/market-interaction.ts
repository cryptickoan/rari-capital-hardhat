// Ethers
import { Contract, BigNumber } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Interface, parseEther, parseUnits  } from "ethers/lib/utils";

// Fuse SDK
import { testForCTokenErrorAndSend } from "./utils/testForCTokenErrorAndSend";

/**
 * @param action - Type of action to perform. i.e borrow, withdraw, repay.
 * @param cTokenAddress - Address of market to withdraw from.
 * @param amount - The amount to withdraw.
 * @param provider - An initiated ethers provider.
 * @param tokenAddress - Address of the market's underlying asset.
 * @param decimals - Underlying token's decimals. i.e DAI = 18.
 */
export async function marketInteraction(
    action: marketInteractionType,
    cTokenAddress: string,
    amount: string,
    provider: Web3Provider | JsonRpcProvider,
    tokenAddress: string,
    decimals?: number,
) {

    // 1. Initiate market/ctoken contract.
    const cTokenInterface = new Interface([
        'function redeemUnderlying(uint redeemAmount) external returns (uint)',
        'function borrow(uint borrowAmount) returns (uint)',
        'function repayBorrow(uint repayAmount) returns (uint)',
        'function repayBorrow() payable',
        'function mint() payable',
        'function mint(uint256 mintAmount) public returns (uint256)'
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
    
    switch (action) {
        case 'withdraw':
            await testForCTokenErrorAndSend(
                cTokenContract.callStatic.redeemUnderlying,
                parsedAmount,
                cTokenContract.redeemUnderlying,
                "Cannot withdraw this amount right now!"
              );
            break;
        case 'borrow':
            await testForCTokenErrorAndSend(
                cTokenContract.callStatic.borrow,
                parsedAmount,
                cTokenContract.borrow,
                "Cannot borrow this amount right now!"
              );
        case 'repay':
            if (tokenAddress !== '0') {   
                await testForCTokenErrorAndSend(
                    cTokenContract.callStatic['repayBorrow(uint repayAmount)'],
                    parsedAmount,
                    cTokenContract['repayBorrow(uint repayAmount)'],
                    "Cannot repay this amount right now!"
                );
            } else {
                await cTokenContract['repayBorrow()']({
                    value: parsedAmount,
                });
            }
        case 'supply':
            if (tokenAddress !== '0') {
                await testForCTokenErrorAndSend(
                    cTokenContract.callStatic['mint(uint256 mintAmount)'],
                    parsedAmount,
                    cTokenContract['mint(uint256 mintAmount)'],
                    "Cannot deposit this amount right now!"
                ); 
            } else {
                await cTokenContract['mint()']({ 
                    value: parsedAmount
                });
            }
        default:
            break;
    }
}

type marketInteractionType = "withdraw" | "borrow" | "repay" | "supply"

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