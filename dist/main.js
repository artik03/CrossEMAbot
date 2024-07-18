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
const accountStateOperations_1 = require("./db/accountStateOperations");
const db_1 = require("./db/db");
const tokenOperations_1 = require("./db/tokenOperations");
const tokenFetchers_1 = require("./dex/tokenFetchers");
const tradeService_1 = __importDefault(require("./dex/tradeService"));
const functions_1 = __importDefault(require("./utils/functions"));
const accountStateService = new accountStateOperations_1.AccountStateService();
const tradeService = new tradeService_1.default(accountStateService.updateAccountState);
const tokenService = new tokenOperations_1.TokenService();
const tokenFetcher = new tokenFetchers_1.TokenFetcher();
const processToken = (token, tokenFromAPI) => __awaiter(void 0, void 0, void 0, function* () {
    if (token.state !== 1)
        return;
    const data = tokenFromAPI[token.address];
    const newPrice = data.price;
    token.closingPrices.push(newPrice);
    const [EMA8, EMA26] = functions_1.default.calculateEMAs(token.closingPrices);
    if (!EMA8 || !EMA26) {
        tokenService.updateToken(token);
        return;
    }
    const newTrend = EMA8 >= EMA26 ? 1 : 0;
    // check for reversal
    if (token.trend === 0 && newTrend === 1) {
        console.log(`Buy signal for ${token.name} (${token.address})`);
        const newBuyAmount = yield tradeService.buy(newPrice, token.address);
        if (newBuyAmount) {
            token.buyAmount = token.buyAmount
                ? token.buyAmount + newBuyAmount
                : newBuyAmount;
            token.buyPrice = newPrice;
        }
    }
    if ((token.trend === 1 && newTrend === 0) ||
        (token.buyPrice && newPrice >= token.buyPrice * 1.1)) {
        console.log(`Sell signal for ${token.name} (${token.address})`);
        yield tradeService.sell(token.buyAmount ? token.buyAmount : 0, newPrice, token.address);
        token.buyAmount = null;
        token.buyPrice = null;
    }
    if (token.closingPrices.length >= 26)
        token.closingPrices.shift();
    token.trend = newTrend;
    yield tokenService.updateToken(token);
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectMongoDB)();
        while (true) {
            const tokens = yield tokenService.getAllTokens(); // get from db
            const addresses = tokens.map((token) => token.address);
            const response = yield tokenFetcher.fetchMultipleTokenData(addresses); // fetch from jupiter api
            if (!response)
                throw new Error("No response from API");
            // check all tokens if their emas crossed
            const processPromises = tokens.map((token) => processToken(token, response.data));
            yield Promise.all(processPromises);
            yield functions_1.default.sleep(30000);
        }
    }
    finally {
        yield (0, db_1.disconnectMongoDB)();
    }
});
run().catch(console.error);
