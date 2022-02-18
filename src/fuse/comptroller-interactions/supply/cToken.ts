import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, utils, constants } from "ethers";
import { formatEther, formatUnits, Interface, parseEther, parseUnits } from "ethers/lib/utils";
import { Fuse } from "../../../../cjs";
import { collateral } from "../collateral/collateral";
import { testForCTokenErrorAndSend } from "../utils/testForCTokenErrorAndSend";

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param provider - An initiated ethers provider.
 * @param userAddress - The depositing user address.
 * @param tokenAddress - Address of token to supply. i.e "0xa0b8..48" for USDC.
 * @param marketAddress - The markets/ctoken address. This is where funds are supplied.
 * @param amount - Amount of tokens to be supplied. Bignumber
 * @param collateralize - If true supplied amount will be used as collateral.
 * @param comptrollerAddress - The address of comptroller where market is listed.
 * @param decimals - Optional. Decimals of underlying token. Will fetch if not given.
 */
export async function supplyCToken(
    fuse: Fuse,
    provider: Web3Provider | JsonRpcProvider,
    userAddress: string,
    tokenAddress: string,
    marketAddress: string,
    amount: string,
    collateralize: boolean,
    comptrollerAddress: string,
    decimals?: number,
) {
    // 1. Initiate cToken/market contract.
    const cTokenInterface = new Interface([
        'function mint(uint256 mintAmount) public returns (uint256)'
    ])

    const cToken = new Contract(
        marketAddress,
        cTokenInterface,
        fuse.provider.getSigner()
    )
    
    // 2. Initiate erc20 contract for underlying asset/token.
    const erc20Interface = new utils.Interface([
        'function allowance(address owner, address spender) public view returns (uint256 remaining)',
        'function approve(address spender, uint256 value) public returns (bool success)',
        'function balanceOf(address _owner) public view returns (uint256 balance)',
        'function decimals() public view returns (uint8)'
    ])

    const erc20Contract = new Contract(
        tokenAddress,
        erc20Interface,
        provider.getSigner(userAddress)
    )

    // 3. Parse given amount to its erc20 notation.
        // Get decimals if not given.
        if (!decimals) {
            decimals = await erc20Contract.callStatic.decimals();
        }

    const parsedAmount = decimals === 18 ? parseEther(amount) : parseUnits(amount, decimals)
    
    // 4. Check allowance. Approve if necessary.
    const hasApprovedEnough = (
        await erc20Contract.callStatic.allowance(userAddress, cToken.address)
        ).gte(amount);
        
    if (!hasApprovedEnough) {
        const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #
        let approveTx = await erc20Contract.approve(cToken.address, max);
        await approveTx.wait(1)
    }

    // 5. Enable as collateral if requested.
    if (collateralize) {
        await collateral(
            comptrollerAddress,
            [marketAddress],
            "enter",
            provider
        )
    }


    //  6. Test for errors. Send transaction if there are none.
    await testForCTokenErrorAndSend(
        cToken.callStatic.mint,
        parsedAmount,
        cToken.mint,
        "Cannot deposit this amount right now!"
      );
}