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
const readline_1 = __importDefault(require("readline"));
const db_1 = require("./db/db");
const tokenOperations_1 = require("./db/tokenOperations");
const accountStateOperations_1 = require("./db/accountStateOperations");
const tokenFetchers_1 = require("./dex/tokenFetchers");
const accountStateService = new accountStateOperations_1.AccountStateService();
const tokenService = new tokenOperations_1.TokenService();
const tokenFetcher = new tokenFetchers_1.TokenFetcher();
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const menu = `
Choose an option:
1. Add token
2. Reset token
3. Reset all tokens
4. Reset account state
q. Quit
`;
const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectMongoDB)();
    let shouldContinue = true;
    while (shouldContinue) {
        console.log(menu);
        const choice = yield askQuestion("Enter your choice: ");
        switch (choice) {
            case "1":
                try {
                    const addTokenAddress = (yield askQuestion("Enter token address: "));
                    yield tokenService.addToken(addTokenAddress, tokenFetcher.fetchToken);
                    console.log(`Token with address ${addTokenAddress} added successfully.`);
                }
                catch (error) {
                    console.error("Error adding token:", error);
                }
                break;
            case "2":
                const resetTokenAddress = (yield askQuestion("Enter token address: "));
                try {
                    yield tokenService.resetToken(resetTokenAddress);
                    console.log(`Token with address ${resetTokenAddress} reset successfully.`);
                }
                catch (error) {
                    console.error("Error resetting token:", error);
                }
                break;
            case "3":
                try {
                    yield tokenService.resetTokens();
                    console.log("All tokens reset successfully.");
                }
                catch (error) {
                    console.error("Error resetting all tokens:", error);
                }
                break;
            case "4":
                try {
                    const balance = parseFloat((yield askQuestion("Enter initial amount: ")));
                    yield accountStateService.resetAccountState(balance);
                    console.log("Account state reset successfully.");
                }
                catch (error) {
                    console.error("Error resetting account state:", error);
                }
                break;
            case "q":
                shouldContinue = false;
                break;
            default:
                console.log("Invalid choice, please try again.");
        }
    }
    yield (0, db_1.disconnectMongoDB)();
    rl.close();
});
main().catch(console.error);
