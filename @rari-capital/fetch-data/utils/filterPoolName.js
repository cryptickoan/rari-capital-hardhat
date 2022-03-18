"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPoolName = exports.filter = void 0;
// @ts-ignore
const bad_words_1 = __importDefault(require("bad-words"));
exports.filter = new bad_words_1.default({ placeHolder: " " });
exports.filter.addWords(...["R1", "R2", "R3", "R4", "R5", "R6", "R7"]);
const filterPoolName = (name) => {
    if (name === "Tetranode's Pool") {
        return "Tetranode's Locker";
    }
    if (name === "state's pool") {
        return "Ribbon Pool";
    }
    if (name === "Stake DAO Pool") {
        return "The Animal Kingdom";
    }
    if (name === "Tetranode's ETH Pool") {
        return "ChainLinkGod's / Tetranode's Up Only Pool";
    }
    if (name === "Tetranode's Flavor of the Month") {
        return "FeiRari (Fei DAO Pool)";
    }
    if (name === "WOO pool") {
        return "Warlord's WOO Pool";
    }
    if (name === "Yearn's Yield") {
        return "Yearn Soup Pot of Yield";
    }
    return exports.filter.clean(name + "$W@G0N0M1C$").replace("$W@G0N0M1C$", "");
};
exports.filterPoolName = filterPoolName;
