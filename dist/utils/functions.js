"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Functions {
    // Method to calculate a single EMA
    calculateEMA(prices, period) {
        const k = 2 / (period + 1);
        return prices.reduce((acc, price, index) => {
            if (index === 0)
                return price;
            return price * k + acc * (1 - k);
        }, 0);
    }
    // Method to calculate both EMA8 and EMA26
    calculateEMAs(prices) {
        const EMA8 = this.calculateEMA(prices.slice(-8), 8);
        const EMA26 = this.calculateEMA(prices.slice(-26), 26);
        return [EMA8, EMA26];
    }
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.default = Functions;
