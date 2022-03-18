/**
 * This is a class that will hold all necessary calls to load and interact with your fuse pool.
 *  - Get Fuse Pool information
 *      - Available rewards distributors.
 *      - Users summary
 *      - Name,
 *      - comptroller address,
 *      - admin address,
 *      - close factor
 *      - liquidation incentive.
 *      - Available markets.
 *      - Master Price Oracle address
 *  - Get data for available markets.
 *      - Market's oracle address, and model.
 *      - CToken address
 *      - Totals (supply, borrow) tailored to the incoming user.
 *      - Market's irm model
 *
 *  - Interact with market
 *      - Supply/borrow/repay/withdraw.
 *
 *
 */
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { fetchFusePoolData } from "..";
declare const MyPool: {
    (provider: Web3Provider | JsonRpcProvider, comptroller: string): any;
    fetchFusePoolData: {
        fetchFusePoolData: typeof fetchFusePoolData;
    };
};
export = MyPool;
