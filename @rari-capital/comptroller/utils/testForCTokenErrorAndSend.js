"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testForCTokenErrorAndSend = void 0;
const types_1 = require("./types");
async function testForCTokenErrorAndSend(txObjectStaticCall, // for static calls
txArgs, txObject, // actual method
failMessage) {
    let response = await txObjectStaticCall(txArgs);
    // For some reason `response` will be `["0"]` if no error but otherwise it will return a string of a number.
    if (response.toString() !== "0") {
        response = parseInt(response);
        let err;
        if (response >= 1000) {
            const comptrollerResponse = response - 1000;
            let msg = types_1.ComptrollerErrorCodes[comptrollerResponse];
            if (msg === "BORROW_BELOW_MIN") {
                msg =
                    "As part of our guarded launch, you cannot borrow less than 1 ETH worth of tokens at the moment.";
            }
            // This is a comptroller error:
            err = new Error(failMessage + " Comptroller Error: " + msg);
        }
        else {
            // This is a standard token error:
            err = new Error(failMessage + " CToken Code: " + types_1.CTokenErrorCodes[response]);
        }
        //   LogRocket.captureException(err);
        throw err;
    }
    return await txObject(txArgs);
}
exports.testForCTokenErrorAndSend = testForCTokenErrorAndSend;
