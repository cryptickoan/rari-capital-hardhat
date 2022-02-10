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
exports.getEthUsdPriceBN = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("ethers/lib/utils");
const getEthUsdPriceBN = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Returns a USD price. Which means its a floating point of at least 2 decimal numbers.
        const usdPrice = (yield axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum")).data.ethereum.usd;
        // Now we turn it into a big number
        const usdPriceBN = (0, utils_1.parseUnits)(usdPrice.toString(), 18);
        // To parse this back into USD usdPriceBN.div(constants.WeiPerEther).toString()
        return usdPriceBN;
    });
};
exports.getEthUsdPriceBN = getEthUsdPriceBN;
