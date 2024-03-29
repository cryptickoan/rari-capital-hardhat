"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
// Cache
const cache_1 = __importDefault(require("./cache"));
// Subpools
const aave_1 = __importDefault(require("./subpools/aave"));
const dydx_1 = __importDefault(require("./subpools/dydx"));
const compound_1 = __importDefault(require("./subpools/compound"));
const mstable_1 = __importDefault(require("./subpools/mstable"));
const yvault_1 = __importDefault(require("./subpools/yvault"));
const alpha_1 = __importDefault(require("./subpools/alpha"));
const fuse_1 = __importDefault(require("./subpools/fuse"));
// Pools
const stable_1 = __importDefault(require("./pools/stable"));
const dai_1 = __importDefault(require("./pools/dai"));
const ethereum_1 = __importDefault(require("./pools/ethereum"));
// ERC20ABI
const ERC20_json_1 = __importDefault(require("./abi/ERC20.json"));
const governance_1 = __importDefault(require("./governance/governance"));
const yield_1 = __importDefault(require("./pools/yield"));
const keeperdao_1 = __importDefault(require("./subpools/keeperdao"));
class Vaults {
    constructor(web3Provider) {
        this.internalTokens = {
            DAI: {
                symbol: "DAI",
                address: "0x6b175474e89094c44da98b954eedeac495271d0f",
                name: "Dai Stablecoin",
                decimals: 18,
            },
            USDC: {
                symbol: "USDC",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                name: "USD Coin",
                decimals: 6,
            },
            USDT: {
                symbol: "USDT",
                address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
                name: "Tether USD",
                decimals: 6,
            },
            TUSD: {
                symbol: "TUSD",
                address: "0x0000000000085d4780b73119b644ae5ecd22b376",
                name: "TrueUSD",
                decimals: 18,
            },
            BUSD: {
                symbol: "BUSD",
                address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
                name: "Binance USD",
                decimals: 18,
            },
            sUSD: {
                symbol: "sUSD",
                address: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
                name: "sUSD",
                decimals: 18,
            },
            mUSD: {
                symbol: "mUSD",
                address: "0xe2f2a5c287993345a840db3b0845fbc70f5935a5",
                name: "mStable USD",
                decimals: 18,
            },
        };
        this.provider = web3Provider;
        this.cache = new cache_1.default({ allTokens: 8600, ethUSDPrice: 300 });
        for (const currencyCode of Object.keys(this.internalTokens))
            this.internalTokens[currencyCode].contract = new ethers_1.Contract(this.internalTokens[currencyCode].address, ERC20_json_1.default, this.provider);
        let self = this;
        this.price = function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum");
                }
                catch (e) {
                    console.log(e);
                }
            });
        };
        this.getEthUsdPriceBN = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield self.cache.getOrUpdate("ethUSDPrice", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            // Returns a USD price. Which means its a floating point of at least 2 decimal numbers.
                            const UsdPrice = (yield axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum")).data.ethereum.usd;
                            // Now we turn it into a big number
                            const usdPriceBN = ethers_1.utils.parseUnits(UsdPrice.toString(), 18);
                            // To parse this back into USD usdPriceBN.div(constants.WeiPerEther).toString()
                            return usdPriceBN;
                        }
                        catch (error) {
                            throw new Error("Error retrieving data from Coingecko API: " + error);
                        }
                    });
                });
            });
        };
        this.getAllTokens = function (cacheTimeout = 86400) {
            return __awaiter(this, void 0, void 0, function* () {
                self.cache._raw["allTokens"].timeout = typeof cacheTimeout === "undefined" ? 86400 : cacheTimeout;
                return yield self.cache.getOrUpdate("allTokens", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        let allTokens = Object.assign({}, self.internalTokens);
                        let data = (yield axios_1.default.get("https://api.0x.org/swap/v0/tokens")).data;
                        data.records.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
                        for (const token of data.records)
                            if (["DAI", "USDC", "USDT", "TUSD", "BUSD", "bUSD", "sUSD", "SUSD", "mUSD"].indexOf(token.symbol) < 0) {
                                token.contract = new ethers_1.Contract(token.address, ERC20_json_1.default, self.provider.getSigner());
                                allTokens[token.symbol] = token;
                            }
                        return allTokens;
                    });
                });
            });
        };
        let subpools = {
            Aave: new aave_1.default(this.provider),
            dYdX: new dydx_1.default(this.provider),
            Compound: new compound_1.default(this.provider),
            mStable: new mstable_1.default(this.provider),
            yVault: new yvault_1.default(this.provider),
            Alpha: new alpha_1.default(this.provider),
            KeeperDAO: new keeperdao_1.default(this.provider),
            Fuse2: new fuse_1.default(this.provider, {
                USDC: "0x69aEd4932B3aB019609dc567809FA6953a7E0858",
            }),
            Fuse3: new fuse_1.default(this.provider, {
                USDC: "0x94C49563a3950424a2a7790c3eF5458A2A359C7e",
            }),
            Fuse7: new fuse_1.default(this.provider, {
                USDC: "0x53De5A7B03dc24Ff5d25ccF7Ad337a0425Dfd8D1",
                DAI: "0x7322B10Db09687fe8889aD8e87f333f95104839F",
            }),
            Fuse11: new fuse_1.default(this.provider, {
                USDC: "0x241056eb034BEA7482290f4a9E3e4dd7269D4329",
            }),
            Fuse13: new fuse_1.default(this.provider, {
                USDC: "0x3b624de26A6CeBa421f9857127e37A5EFD8ecaab",
            }),
            Fuse14: new fuse_1.default(this.provider, {
                USDC: "0x6447026FE96363669B5be2EE135843a5e4d15B50",
            }),
            Fuse15: new fuse_1.default(this.provider, {
                USDC: "0x5F9FaeD5599D86D2e6F8d982189d560C067897a0",
            }),
            Fuse16: new fuse_1.default(this.provider, {
                USDC: "0x7bA788fa2773fb157EfAfAd046FE5E0e6120DEd5",
            }),
            Fuse18: new fuse_1.default(this.provider, {
                USDC: "0x6f95d4d251053483f41c8718C30F4F3C404A8cf2",
                DAI: "0x8E4E0257A4759559B4B1AC087fe8d80c63f20D19",
            }),
            Fuse6: new fuse_1.default(this.provider, {
                USDC: "0xdb55b77f5e8a1a41931684cf9e4881d24e6b6cc9",
                DAI: "0x989273ec41274C4227bCB878C2c26fdd3afbE70d",
            }),
        };
        this.pools = {
            stable: new stable_1.default(this.provider, {
                dYdX: subpools["dYdX"],
                Compound: subpools["Compound"],
                Aave: subpools["Aave"],
                mStable: subpools["mStable"],
                Fuse2: subpools["Fuse2"],
                Fuse3: subpools["Fuse3"],
                Fuse7: subpools["Fuse7"],
                Fuse11: subpools["Fuse11"],
                Fuse13: subpools["Fuse13"],
                Fuse14: subpools["Fuse14"],
                Fuse15: subpools["Fuse15"],
                Fuse16: subpools["Fuse16"],
                Fuse18: subpools["Fuse18"],
                Fuse6: subpools["Fuse6"],
            }, this.getAllTokens),
            dai: new dai_1.default(this.provider, {
                dYdX: subpools["dYdX"],
                Compound: subpools["Compound"],
                Aave: subpools["Aave"],
                mStable: subpools["mStable"],
                Fuse6: subpools["Fuse6"],
                Fuse7: subpools["Fuse7"],
                Fuse18: subpools["Fuse18"],
            }, this.getAllTokens),
            yield: new yield_1.default(this.provider, {
                dYdX: subpools["dYdX"],
                Compound: subpools["Compound"],
                Aave: subpools["Aave"],
                mStable: subpools["mStable"],
            }, this.getAllTokens),
            ethereum: new ethereum_1.default(this.provider, {
                dYdX: subpools["dYdX"],
                Compound: subpools["Compound"],
                KeeperDAO: subpools["KeeperDAO"],
                Aave: subpools["Aave"],
                Alpha: subpools["Alpha"],
                Enzyme: subpools["Alpha"],
            }, this.getAllTokens),
        };
        this.governance = new governance_1.default(this.provider);
    }
}
exports.default = Vaults;
