import { AccountStateService } from "./db/accountStateOperations";
import { connectMongoDB, disconnectMongoDB } from "./db/db";
import { TokenService, Token } from "./db/tokenOperations";
import {
  TokenFetcher,
  FetchedToken,
  FetchedTokenData,
} from "./dex/tokenFetchers";
import TradeService from "./dex/tradeService";
import Functions from "./utils/functions";

const accountStateService = new AccountStateService();
const tradeService = new TradeService(accountStateService.updateAccountState);
const tokenService = new TokenService();
const tokenFetcher = new TokenFetcher();

const processToken = async (token: Token, tokenFromAPI: FetchedTokenData) => {
  if (token.state !== 1) return;

  const data: FetchedToken = tokenFromAPI[token.address];
  const newPrice = data.price;

  token.closingPrices.push(newPrice);

  const [EMA8, EMA26] = Functions.calculateEMAs(token.closingPrices);
  if (!EMA8 || !EMA26) {
    tokenService.updateToken(token);
    return;
  }
  const newTrend = EMA8 > EMA26 ? 1 : 0;

  // check for reversal
  if (token.trend === 0 && newTrend === 1) {
    console.log(`Buy signal for ${token.name} (${token.address})`);

    const newBuyAmount = await tradeService.buy(newPrice, token.address);

    if (newBuyAmount) {
      token.buyAmount = token.buyAmount
        ? token.buyAmount + newBuyAmount
        : newBuyAmount;
      token.buyPrice = newPrice;
    }
  }

  if (
    (token.trend === 1 && newTrend === 0) ||
    (token.buyPrice && newPrice >= token.buyPrice * 1.1)
  ) {
    console.log(`Sell signal for ${token.name} (${token.address})`);

    await tradeService.sell(
      token.buyAmount ? token.buyAmount : 0,
      newPrice,
      token.address
    );

    token.buyAmount = null;
    token.buyPrice = null;
  }

  if (token.closingPrices.length >= 26) token.closingPrices.shift();
  token.trend = newTrend;
  await tokenService.updateToken(token);
};

const run = async () => {
  try {
    await connectMongoDB();
    while (true) {
      const tokens: Token[] = await tokenService.getAllTokens(); // get from db
      const addresses: string[] = tokens.map((token) => token.address);
      const response = await tokenFetcher.fetchMultipleTokenData(addresses); // fetch from jupiter api
      if (!response) throw new Error("No response from API");

      // check all tokens if their emas crossed
      const processPromises = tokens.map((token) =>
        processToken(token, response.data)
      );
      await Promise.all(processPromises);
      await Functions.sleep(30000);
    }
  } finally {
    await disconnectMongoDB();
  }
};

run().catch(console.error);
