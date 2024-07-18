import { Collection, MongoClient } from "mongodb";
import { client } from "./db";

/**
 * @state -> 0=off, 1=on, 2=paused
 * @trend -> 0=down (ema8 < ema26), 1=up ema8 > ema26
 */
interface Token {
  timeAdded: Date;
  name: string;
  address: string;
  state: number;
  closingPrices: number[];
  trend: number | null;
  buyAmount: number | null;
  buyPrice: number | null;
}

class TokenService {
  private tokenCollection: Collection<Token>;

  constructor() {
    this.tokenCollection = client
      .db("sol_bot_data")
      .collection<Token>("tokens");
  }

  async addToken(
    address: string,
    fetchTokenDataFromAPI: (address: string) => Promise<any>
  ): Promise<boolean> {
    try {
      const fetchedData = await fetchTokenDataFromAPI(address);
      const name = fetchedData.data[address].mintSymbol;

      const tokenData: Token = {
        timeAdded: new Date(),
        name: name,
        address: address,
        state: 1,
        closingPrices: [],
        trend: null,
        buyAmount: null,
        buyPrice: null,
      };

      const result = await this.tokenCollection.insertOne(tokenData);
      console.log(`${name} inserted successfully into MongoDB`);
      return true;
    } catch (error) {
      console.error(`Error inserting token: ${error}`);
      throw error;
    }
  }

  async getAllTokens(): Promise<Token[]> {
    try {
      const tokens = await this.tokenCollection.find({}).toArray();
      return tokens;
    } catch (err) {
      console.error("Error fetching tokens:", err);
      return [];
    }
  }

  async updateToken(token: Token): Promise<void> {
    try {
      await this.tokenCollection.updateOne(
        { address: token.address },
        { $set: token }
      );
      console.log(
        `Token ${token.name} (${token.address}) updated successfully.`
      );
    } catch (err) {
      console.error(`Error updating token ${token.address}:`, err);
    }
  }

  async deleteToken(address: string): Promise<boolean> {
    try {
      const result = await this.tokenCollection.deleteOne({ address });
      console.log(`Token with address ${address} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting token: ${error}`);
      throw error;
    }
  }

  async resetToken(address: string): Promise<boolean> {
    try {
      const updateResult = await this.tokenCollection.updateOne(
        { address: address },
        {
          $set: {
            closing_prices: [],
            trend: null,
            buy_price: null,
            amount_bought: null,
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(
          `Successfully reset fields for ${updateResult.modifiedCount} tokens`
        );
        return true;
      } else {
        console.log(`No tokens found to reset`);
        return false;
      }
    } catch (err) {
      console.error(`Error resetting token fields: ${err}`);
      throw err;
    }
  }

  async resetTokens(): Promise<boolean> {
    try {
      const updateResult = await this.tokenCollection.updateMany(
        {},
        {
          $set: {
            closing_prices: [],
            trend: null,
            buy_price: null,
            amount_bought: null,
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(
          `Successfully reset fields for ${updateResult.modifiedCount} tokens`
        );
        return true;
      } else {
        console.log(`No tokens found to reset`);
        return false;
      }
    } catch (err) {
      console.error(`Error resetting token fields: ${err}`);
      throw err;
    }
  }
}

export { TokenService, Token };
