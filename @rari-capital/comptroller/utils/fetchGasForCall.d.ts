import { BigNumber } from "@ethersproject/bignumber";
import { Fuse } from "../../../cjs";
/**
 *
 * @param call - Function call to calculate gas for.
 * @param amountBN - Amount of ETH to send.
 * @param fuse - An initiated Fuse instance.
 * @param address - User's address
 * @returns - { Estimated gas needed for transaction, gasPrice per gas, gasWei total gas in wei. }
 */
export declare const fetchGasForCall: (call: any, amountBN: BigNumber, fuse: Fuse, address: string) => Promise<{
    gasWEI: BigNumber | null;
    gasPrice: BigNumber | null;
    estimatedGas: BigNumber;
}>;
