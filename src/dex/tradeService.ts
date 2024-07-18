class TradeService {
  private updateAccountState: (amount: number) => Promise<boolean>;

  constructor(updateAccountState: (amount: number) => Promise<boolean>) {
    this.updateAccountState = updateAccountState;
  }

  public async buy(price: number, address: string): Promise<number | null> {
    try {
      const buyValue = 1;
      const amount = buyValue / price;
      const result = await this.updateAccountState(buyValue);
      if (result) {
        console.log(`Bought ${amount} of ${address}`);
        return amount;
      } else {
        console.error(`Failed to buy ${amount} of ${address}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error buying token: ${error.message}`);
      return null;
    }
  }

  public async sell(
    amount: number,
    price: number,
    address: string
  ): Promise<void> {
    try {
      const totalPrice = amount * price;
      const result = await this.updateAccountState(-totalPrice);
      if (result) {
        console.log(`Sold ${address} for ${price}`);
      } else {
        console.error(`Failed to sell ${address} for ${price}`);
      }
    } catch (error: any) {
      console.error(`Error selling token: ${error.message}`);
    }
  }
}

export default TradeService;
