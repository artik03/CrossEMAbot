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
exports.AccountStateService = void 0;
const db_1 = require("./db");
class AccountStateService {
    constructor() {
        this.accountStateCollection = db_1.client
            .db("sol_bot_data")
            .collection("accountState");
    }
    addAccountState(balance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountState = {
                    initTime: new Date(),
                    initValue: balance,
                    balance: balance,
                    transactions: [],
                };
                const result = yield this.accountStateCollection.insertOne(accountState);
                console.log(`Account set up with ${balance}$.`);
                return true;
            }
            catch (error) {
                console.error(`Error inserting account state: ${error}`);
                throw error;
            }
        });
    }
    /**
     * @param transaction if buy transaction is positive, if sell than negative
     */
    updateAccountState(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountState = yield this.accountStateCollection.findOne({}, { projection: { balance: 1, transactions: 1 } });
                if (!accountState) {
                    console.error(`No account to update.`);
                    return false;
                }
                const newBalance = accountState.balance - transaction;
                if (newBalance < 0) {
                    console.error(`Invalid transaction: insufficient balance.`);
                    return false;
                }
                const updateResult = yield this.accountStateCollection.updateOne({}, {
                    $set: { balance: newBalance },
                    $push: { transactions: -transaction },
                });
                if (updateResult.matchedCount > 0) {
                    console.log(`Account state updated successfully`);
                    return true;
                }
                else {
                    console.error(`No account state document found to update`);
                    return false;
                }
            }
            catch (error) {
                console.error(`Error updating account state: ${error}`);
                throw error;
            }
        });
    }
    resetAccountState(val) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateResult = yield this.accountStateCollection.updateMany({}, {
                    $set: {
                        initTime: new Date(),
                        initValue: val,
                        balance: val,
                        transactions: [],
                    },
                });
                if (updateResult.modifiedCount > 0) {
                    console.log(`Account state successfully reset.`);
                    return true;
                }
                else {
                    console.log(`No account states found to reset`);
                    return false;
                }
            }
            catch (error) {
                console.error(`Error resetting account balance: ${error}`);
                throw error;
            }
        });
    }
    getAccountState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountState = yield this.accountStateCollection.findOne({});
                return accountState;
            }
            catch (err) {
                console.error(`Error fetching account state: ${err}`);
                return null;
            }
        });
    }
}
exports.AccountStateService = AccountStateService;
