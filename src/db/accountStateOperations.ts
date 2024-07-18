import { MongoClient, Collection } from "mongodb";
import { client } from "./db";

interface AccountState {
  initTime: Date;
  initValue: number;
  balance: number;
  transactions: number[];
}

export class AccountStateService {
  private accountStateCollection: Collection<AccountState>;

  constructor() {
    this.accountStateCollection = client
      .db("sol_bot_data")
      .collection<AccountState>("accountState");
  }

  async addAccountState(balance: number): Promise<boolean> {
    try {
      const accountState: AccountState = {
        initTime: new Date(),
        initValue: balance,
        balance: balance,
        transactions: [],
      };
      const result = await this.accountStateCollection.insertOne(accountState);
      console.log(`Account set up with ${balance}$.`);
      return true;
    } catch (error) {
      console.error(`Error inserting account state: ${error}`);
      throw error;
    }
  }

  /**
   * @param transaction if buy transaction is positive, if sell than negative
   */
  async updateAccountState(transaction: number): Promise<boolean> {
    try {
      const accountState = await this.accountStateCollection.findOne(
        {},
        { projection: { balance: 1, transactions: 1 } }
      );

      if (!accountState) {
        console.error(`No account to update.`);
        return false;
      }

      const newBalance = accountState.balance - transaction;

      if (newBalance < 0) {
        console.error(`Invalid transaction: insufficient balance.`);
        return false;
      }

      const updateResult = await this.accountStateCollection.updateOne(
        {},
        {
          $set: { balance: newBalance },
          $push: { transactions: -transaction },
        }
      );

      if (updateResult.matchedCount > 0) {
        console.log(`Account state updated successfully`);
        return true;
      } else {
        console.error(`No account state document found to update`);
        return false;
      }
    } catch (error) {
      console.error(`Error updating account state: ${error}`);
      throw error;
    }
  }

  async resetAccountState(val: number): Promise<boolean> {
    try {
      const updateResult = await this.accountStateCollection.updateMany(
        {},
        {
          $set: {
            initTime: new Date(),
            initValue: val,
            balance: val,
            transactions: [],
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`Account state successfully reset.`);
        return true;
      } else {
        console.log(`No account states found to reset`);
        return false;
      }
    } catch (error) {
      console.error(`Error resetting account balance: ${error}`);
      throw error;
    }
  }

  async getAccountState(): Promise<AccountState | null> {
    try {
      const accountState = await this.accountStateCollection.findOne({});
      return accountState;
    } catch (err) {
      console.error(`Error fetching account state: ${err}`);
      return null;
    }
  }
}
