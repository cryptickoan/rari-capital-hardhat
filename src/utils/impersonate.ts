import { providers } from "ethers";

export const impersonateAccount = async (
    provider: providers.Web3Provider | providers.JsonRpcProvider, 
    accountToImpersonate: string
) => {
    await provider.send(
        "hardhat_impersonateAccount",
        [accountToImpersonate],
        );
}