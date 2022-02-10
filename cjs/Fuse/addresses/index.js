"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuseContractVersion = exports.CompoundContractVersion = void 0;
const networks_1 = require("../../utils/networks");
const mainnet_1 = __importDefault(require("./mainnet"));
const arbitrum_1 = __importDefault(require("./arbitrum"));
const hardhat_1 = __importDefault(require("./hardhat"));
var CompoundContractVersion;
(function (CompoundContractVersion) {
    CompoundContractVersion[CompoundContractVersion["1.0.0"] = 0] = "1.0.0";
    CompoundContractVersion[CompoundContractVersion["1.0.1"] = 1] = "1.0.1";
    CompoundContractVersion[CompoundContractVersion["1.0.2"] = 2] = "1.0.2";
    CompoundContractVersion[CompoundContractVersion["1.1.0"] = 3] = "1.1.0";
})(CompoundContractVersion = exports.CompoundContractVersion || (exports.CompoundContractVersion = {}));
var FuseContractVersion;
(function (FuseContractVersion) {
    FuseContractVersion[FuseContractVersion["1.0.0"] = 0] = "1.0.0";
    FuseContractVersion[FuseContractVersion["1.0.1"] = 1] = "1.0.1";
    FuseContractVersion[FuseContractVersion["1.0.2"] = 2] = "1.0.2";
    FuseContractVersion[FuseContractVersion["1.0.3"] = 3] = "1.0.3";
    FuseContractVersion[FuseContractVersion["1.0.4"] = 4] = "1.0.4";
    FuseContractVersion[FuseContractVersion["1.0.5"] = 5] = "1.0.5";
    FuseContractVersion[FuseContractVersion["1.1.0"] = 6] = "1.1.0";
    FuseContractVersion[FuseContractVersion["1.1.1"] = 7] = "1.1.1";
    FuseContractVersion[FuseContractVersion["1.1.2"] = 8] = "1.1.2";
    FuseContractVersion[FuseContractVersion["1.1.3"] = 9] = "1.1.3";
    FuseContractVersion[FuseContractVersion["1.1.4"] = 10] = "1.1.4";
    FuseContractVersion[FuseContractVersion["1.1.5"] = 11] = "1.1.5";
    FuseContractVersion[FuseContractVersion["1.1.6"] = 12] = "1.1.6";
    FuseContractVersion[FuseContractVersion["1.2.0"] = 13] = "1.2.0";
    FuseContractVersion[FuseContractVersion["1.2.1"] = 14] = "1.2.1";
    FuseContractVersion[FuseContractVersion["1.2.2"] = 15] = "1.2.2";
})(FuseContractVersion = exports.FuseContractVersion || (exports.FuseContractVersion = {}));
const addresses = {
    [networks_1.ChainID.ETHEREUM]: mainnet_1.default,
    [networks_1.ChainID.HARDHAT]: hardhat_1.default,
    // Todo - update all these addresses
    [networks_1.ChainID.ARBITRUM]: arbitrum_1.default,
    //ChainID.ARBITRUM_TESTNET]: ARBITRUM_RINKEBY_ADDRESSES,
};
exports.default = addresses;
