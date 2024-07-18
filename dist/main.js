"use strict";
// import { connectMongoDB, disconnectMongoDB } from "./db/db";
// import { TokenService, Token } from "./db/tokenOperations";
// import TokenFetcher from "./dex/tokenFetchers";
// import Functions from "./utils/functions";
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
// const processToken = async (token: Token, tokenFromAPI) => {
//   if (token.state !== 1) return;
//   const data = tokensData[token.hash];
//   const newPrice = data.price;
//   token.closing_prices.push(newPrice);
//   if (token.closing_prices.length < 26) {
//     await updateToken(token);
//     return;
//   }
//   const [EMA8, EMA26] = calculateEMAs(token.closing_prices);
//   if (!EMA8 || !EMA26) {
//     updateToken(token);
//     return;
//   }
//   let newTrend = EMA8 >= EMA26 ? 1 : 0;
//   if (token.trend === 0 && newTrend === 1) {
//     console.log(`Buy signal for ${token.name} (${token.hash})`);
//     const buyAmount = 1 / newPrice; // amount for 1 $
//     buy(buyAmount, token.hash, updateAccountState);
//     token.amount_bought += buyAmount;
//     token.buy_price = newPrice;
//   }
//   if (
//     (token.trend === 1 && newTrend === 0) ||
//     (token.buy_price && newPrice >= token.buy_price * 1.2)
//   ) {
//     console.log(`Sell signal for ${token.name} (${token.hash})`);
//     const sellPrice = token.amount_bought * newPrice;
//     sell(sellPrice, token.hash, updateAccountState);
//     token.amount_bought = 0;
//     token.buy_price = null;
//   }
//   token.trend = newTrend;
//   await updateToken(token);
// };
// const run = async () => {
//   try {
//     await connectMongoDB();
//     while (true) {
//       const tokens: Token[] = await TokenService.getAllTokens(); // get from db
//       const addresses: string[] = tokens.map((token) => token.address);
//       const response = await TokenFetcher.fetchMultipleTokenData(addresses); // fetch from jupiter api
//       // check all tokens if their emas crossed
//       const processPromises = tokens.map((token) =>
//         processToken(token, response.data)
//       );
//       await Promise.all(processPromises);
//       await Functions.sleep(30000);
//     }
//   } finally {
//     await disconnectMongoDB();
//   }
// };
// run().catch(console.error);
const tokenFetchers_1 = __importDefault(require("./dex/tokenFetchers"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield tokenFetchers_1.default.fetchToken("AguFbHujcAEDSdNBhz2KjVjsBq2NPw8S8SUh5iz67KSc"));
});
run();
