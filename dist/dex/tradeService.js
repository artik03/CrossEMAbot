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
Object.defineProperty(exports, "__esModule", { value: true });
class TradeService {
    constructor(updateAccountState) {
        this.updateAccountState = updateAccountState;
    }
    buy(amount, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.updateAccountState(-amount);
                if (result) {
                    console.log(`Bought ${amount} of ${address}`);
                }
                else {
                    console.error(`Failed to buy ${amount} of ${address}`);
                }
            }
            catch (error) {
                console.error(`Error buying token: ${error.message}`);
            }
        });
    }
    sell(price, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.updateAccountState(price);
                if (result) {
                    console.log(`Sold ${address} for ${price}`);
                }
                else {
                    console.error(`Failed to sell ${address} for ${price}`);
                }
            }
            catch (error) {
                console.error(`Error selling token: ${error.message}`);
            }
        });
    }
}
exports.default = TradeService;
