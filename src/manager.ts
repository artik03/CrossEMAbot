import readline from "readline";
import { connectMongoDB, disconnectMongoDB } from "./db/db";
import { TokenService, Token } from "./db/tokenOperations";
import { AccountStateService } from "./db/accountStateOperations";
import { TokenFetcher } from "./dex/tokenFetchers";

const accountStateService = new AccountStateService();
const tokenService = new TokenService();
const tokenFetcher = new TokenFetcher();

const rl = readline.createInterface({
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

const askQuestion = (query: string) =>
  new Promise((resolve) => rl.question(query, resolve));

const main = async () => {
  await connectMongoDB();
  let shouldContinue = true;

  while (shouldContinue) {
    console.log(menu);
    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
      case "1":
        try {
          const addTokenAddress = (await askQuestion(
            "Enter token address: "
          )) as string;
          await tokenService.addToken(addTokenAddress, tokenFetcher.fetchToken);
          console.log(
            `Token with address ${addTokenAddress} added successfully.`
          );
        } catch (error) {
          console.error("Error adding token:", error);
        }
        break;
      case "2":
        const resetTokenAddress = (await askQuestion(
          "Enter token address: "
        )) as string;
        try {
          await tokenService.resetToken(resetTokenAddress);
          console.log(
            `Token with address ${resetTokenAddress} reset successfully.`
          );
        } catch (error) {
          console.error("Error resetting token:", error);
        }
        break;
      case "3":
        try {
          await tokenService.resetTokens();
          console.log("All tokens reset successfully.");
        } catch (error) {
          console.error("Error resetting all tokens:", error);
        }
        break;
      case "4":
        try {
          const balance: number = parseFloat(
            (await askQuestion("Enter initial amount: ")) as string
          );
          await accountStateService.resetAccountState(balance);
          console.log("Account state reset successfully.");
        } catch (error) {
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

  await disconnectMongoDB();
  rl.close();
};

main().catch(console.error);
