"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployUniTwapV2ToMpo = void 0;
// Colors
const colors_1 = __importDefault(require("colors"));
async function deployUniTwapV2ToMpo(comptrollerAddress, uniV3BaseTokenAddress, fuse, address) {
    console.info(colors_1.default.yellow("Initiating UniswapTwapV2 deployment."));
    // 1. Deploy UniswapTwapV2 oracle.
    const uniswapTwapOracle = await fuse.deployPriceOracle("UniswapTwapPriceOracleV2", { baseToken: uniV3BaseTokenAddress }, { from: address });
    console.info(colors_1.default.green("Deployment successful!"));
    console.table({ contract: "UniswapTwapV2Oracle", address: uniswapTwapOracle });
    console.info(colors_1.default.yellow("Configuring MasterPriceOracle."));
    // const comptrollerInterface = new Interface([
    //     'function oracle() external view returns (address)'
    // ])
    // const comptrollerContract = new Contract(
    //     comptrollerAddress,
    //     comptrollerInterface,
    //     fuse.provider
    // )
    // const oracleAddress = await comptrollerContract.oracle()
    // const oracleInterface = new Interface([
    //     'function add(address[] calldata underlyings, tuple[] calldata _oracles) external onlyAdmin'
    // ])
    // const oracleContract = new Contract(
    //     oracleAddress,
    //     oracleInterface,
    //     fuse.provider
    // )
    // await oracleContract.add(tokenArray, oracleAddress, {
    //     from: address,
    //   });
}
exports.deployUniTwapV2ToMpo = deployUniTwapV2ToMpo;
