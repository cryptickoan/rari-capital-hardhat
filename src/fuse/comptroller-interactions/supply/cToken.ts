import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, utils, constants } from "ethers";
import { Interface } from "ethers/lib/utils";
import { Fuse } from "../../../../cjs";
import { testForCTokenErrorAndSend } from "../utils/testForCTokenErrorAndSend";

/**
 * @param fuse - An initiated fuse sdk instance.
 * @param tokenAddress - Address of token to supply. i.e "0xa0b8..48" for USDC.
 * @param provider - An initiated ethers provider.
 * @param userAddress - The depositing user address.
 * @param marketAddress - The markets/ctoken address. This is where funds are supplied.
 * @param amount - Amount of tokens to be supplied. Bignumber
 * @param enableAsCollateral - If true supplied amount will be used as collateral.
 * @param comptrollerAddress - The address of comptroller where market is listed.
 */
export async function supplyCToken(
    fuse: Fuse,
    tokenAddress: string,
    provider: Web3Provider | JsonRpcProvider,
    userAddress: string,
    marketAddress: string,
    amount: BigNumber,
    enableAsCollateral: boolean,
    comptrollerAddress: string
) {
    const cTokenInterface = new Interface([
        'function mint(uint256 mintAmount) public returns (uint256)'
    ])

    // Might need contract for supply/withdrawy/repay abis will save here in the meantime
        // const cToken = new Contract(
        //     marketAddress,
        //     JSON.parse(
        //         fuse.compoundContracts[
        //         "contracts/CErc20Delegate.sol:CErc20Delegate"
        //         ].abi
        //     ),
        //     fuse.provider.getSigner()
        // );

    const cToken = new Contract(
        marketAddress,
        cTokenInterface,
        fuse.provider.getSigner()
    )

    // 1. Create erc20 contract.
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


    //  4. Test for errors. Send transaction if thers none.
    let tx = await testForCTokenErrorAndSend(
        cToken.callStatic.mint,
        amount,
        cToken.mint,
        "Cannot deposit this amount right now!"
      );

      console.log(tx, 'Woohoo!')
}