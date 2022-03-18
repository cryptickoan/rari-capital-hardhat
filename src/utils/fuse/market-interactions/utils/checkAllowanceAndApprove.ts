// Ethers
import { BigNumber, constants, Contract } from 'ethers';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Interface } from 'ethers/lib/utils';

/**
 * @param userAddress - Address of user to check allowance for.
 * @param marketAddress - Market/ctoken to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 * @param provider - An initiated ethers provider.
 */
export async function checkAllowanceAndApprove(
    userAddress:string,
    marketAddress: string,
    underlyingAddress: string,
    amount: BigNumber,
    provider: Web3Provider | JsonRpcProvider
) {
    const erc20Interface = new Interface([
        'function allowance(address owner, address spender) public view returns (uint256 remaining)',
        'function approve(address spender, uint256 value) public returns (bool success)',
    ])

    const erc20Contract = new Contract(
        underlyingAddress,
        erc20Interface,
        provider.getSigner(userAddress)
    )

    const hasApprovedEnough = (
        await erc20Contract.callStatic.allowance(userAddress, marketAddress)
    ).gte(amount);
        
    if (!hasApprovedEnough) {
        const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #
        await erc20Contract.approve(marketAddress, max);
    }
}