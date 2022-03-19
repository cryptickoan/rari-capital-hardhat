import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "ethers/lib/utils";
// import type { SignerWithAddress } from "hardhat/signers";

export async function checkAllowance(
  userAddress: string,
  spender: string,
  underlyingAddress: string,
  amount: BigNumber,
  signer: any
) {
  if (isAssetETH(underlyingAddress)) return true;
  const erc20Interface = new Interface([
    "function allowance(address owner, address spender) public view returns (uint256 remaining)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);

  const hasApproval = (
    await erc20Contract.callStatic.allowance(userAddress, spender)
  ).gte(amount);

  return hasApproval;
}

export async function balanceOf(
  userAddress: string,
  underlyingAddress: string,
  signer: any
) {
  if (isAssetETH(underlyingAddress)) return parseEther("0");
  const erc20Interface = new Interface([
    "function balanceOf(address _owner) public view returns (uint256 balance)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);

  const balance: BigNumber = await erc20Contract.callStatic.balanceOf(userAddress);

  return balance;
}

const isAssetETH = (address: string) =>
  address === "0x0000000000000000000000000000000000000000";
