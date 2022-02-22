import { Fuse } from "../../cjs";
import { FusePoolData } from "../types/types";
/**
 * @param fuse - An initiated fuse sdk instance.
 * @param poolId - The pool's assigned ID.
 * @param address - User's address.
 * @returns data of given pool.
 */
export declare function fetchFusePoolData(fuse: Fuse, poolId: string | undefined, address: string): Promise<FusePoolData | undefined>;
