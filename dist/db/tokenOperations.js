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
exports.TokenService = void 0;
const db_1 = require("./db");
class TokenService {
    constructor() {
        this.tokenCollection = db_1.client
            .db("sol_bot_data")
            .collection("tokens");
    }
    addToken(address, fetchTokenDataFromAPI) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedData = yield fetchTokenDataFromAPI(address);
                const name = fetchedData.data[address].mintSymbol;
                const tokenData = {
                    timeAdded: new Date(),
                    name: name,
                    address: address,
                    state: 1,
                    closingPrices: [],
                    trend: null,
                    buyAmount: null,
                    buyPrice: null,
                };
                const result = yield this.tokenCollection.insertOne(tokenData);
                console.log(`${name} inserted successfully into MongoDB`);
                return true;
            }
            catch (error) {
                console.error(`Error inserting token: ${error}`);
                throw error;
            }
        });
    }
    getAllTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.tokenCollection.find({}).toArray();
                return tokens;
            }
            catch (err) {
                console.error("Error fetching tokens:", err);
                return [];
            }
        });
    }
    updateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.tokenCollection.updateOne({ address: token.address }, { $set: token });
                console.log(`Token ${token.name} (${token.address}) updated successfully.`);
            }
            catch (err) {
                console.error(`Error updating token ${token.address}:`, err);
            }
        });
    }
    deleteToken(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.tokenCollection.deleteOne({ address });
                console.log(`Token with address ${address} deleted successfully`);
                return true;
            }
            catch (error) {
                console.error(`Error deleting token: ${error}`);
                throw error;
            }
        });
    }
    resetToken(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateResult = yield this.tokenCollection.updateOne({ address: address }, {
                    $set: {
                        closing_prices: [],
                        trend: null,
                        buy_price: null,
                        amount_bought: null,
                    },
                });
                if (updateResult.modifiedCount > 0) {
                    console.log(`Successfully reset fields for ${updateResult.modifiedCount} tokens`);
                    return true;
                }
                else {
                    console.log(`No tokens found to reset`);
                    return false;
                }
            }
            catch (err) {
                console.error(`Error resetting token fields: ${err}`);
                throw err;
            }
        });
    }
    resetTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateResult = yield this.tokenCollection.updateMany({}, {
                    $set: {
                        closing_prices: [],
                        trend: null,
                        buy_price: null,
                        amount_bought: null,
                    },
                });
                if (updateResult.modifiedCount > 0) {
                    console.log(`Successfully reset fields for ${updateResult.modifiedCount} tokens`);
                    return true;
                }
                else {
                    console.log(`No tokens found to reset`);
                    return false;
                }
            }
            catch (err) {
                console.error(`Error resetting token fields: ${err}`);
                throw err;
            }
        });
    }
}
exports.TokenService = TokenService;
