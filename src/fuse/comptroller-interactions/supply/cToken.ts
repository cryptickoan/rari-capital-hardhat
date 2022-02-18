import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, utils, constants } from "ethers";
import { Interface } from "ethers/lib/utils";
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
 * @param enableAsCollateral - If true supplied amount will be used as collateral.
 * @param comptrollerAddress - The address of comptroller where market is listed.
 */
export async function supplyCToken(
    fuse: Fuse,
    provider: Web3Provider | JsonRpcProvider,
    userAddress: string,
    tokenAddress: string,
    marketAddress: string,
    amount: BigNumber,
    enableAsCollateral: boolean,
    comptrollerAddress: string
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
        'function approve(address spender, uint256 value) public returns (bool success)'
    ])

    const erc20Contract = new Contract(
        tokenAddress,
        erc20Interface,
        provider.getSigner(userAddress)
    )

    const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #

    // 2. Check allowance. Approve if necessary.
    const hasApprovedEnough = (
        await erc20Contract.callStatic.allowance(userAddress, cToken.address)
      ).gte(amount);

    if (!hasApprovedEnough) {
        let approveTx = await erc20Contract.approve(cToken.address, max);
        await approveTx.wait(1)
    }

    // 3. Enable as collateral if requested.
    if (enableAsCollateral) {
        await collateral(
            comptrollerAddress,
            [marketAddress],
            "enter",
            provider
        )
    }


    //  4. Test for errors. Send transaction if there are none.
    await testForCTokenErrorAndSend(
        cToken.callStatic.mint,
        amount,
        cToken.mint,
        "Cannot deposit this amount right now!"
      );
}