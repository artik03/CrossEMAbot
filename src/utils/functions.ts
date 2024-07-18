class Functions {
  // Method to calculate a single EMA
  private static calculateEMA(prices: number[], period: number): number {
    const k = 2 / (period + 1);
    return prices.reduce((acc, price, index) => {
      if (index === 0) return price;
      return price * k + acc * (1 - k);
    }, 0);
  }

  // Method to calculate both EMA8 and EMA26
  public static calculateEMAs(
    prices: number[]
  ): [number | null, number | null] {
    const EMA8 =
      prices.length >= 8 ? this.calculateEMA(prices.slice(-8), 8) : null;
    const EMA26 =
      prices.length >= 26 ? this.calculateEMA(prices.slice(-26), 26) : null;
    return [EMA8, EMA26];
  }

  public static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Functions;
