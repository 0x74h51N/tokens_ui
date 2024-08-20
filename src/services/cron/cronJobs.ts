"use server";
import scaffoldConfig from "~~/scaffold.config";
import { delay } from "../web3/utils";
import { getBscTransactions } from "../web3/getBscTransactions";

const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
const mainnetAddresses = scaffoldConfig.contractAddressList || [];

/**
 * This function is designed to be executed as a daily cron job. Its primary purpose is to fetch transactions
 * from the Binance Smart Chain (BSC) for a list of contract addresses, both on testnet and mainnet, and cache
 * the results for efficient retrieval.
 */
export async function runCronJobs() {
  console.log("Cron job started");
  let resultMessage = "Cron jobs completed with the following results:\n";

  await delay(500);
  // Process testnet addresses
  for (const address of testnetAddresses) {
    console.log(`Fetching transactions for testnet address: ${address}`);
    try {
      await getBscTransactions(address, "true", "true", "300");
      resultMessage += `Testnet address ${address}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for testnet address ${address}:`, error);
        resultMessage += `Testnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500); // Avoid hitting rate limits
  }
  // Process mainnet addresses
  for (const address of mainnetAddresses) {
    console.log(`Fetching transactions for mainnet address: ${address}`);
    try {
      await getBscTransactions(address, "false", "true", "300");
      resultMessage += `Mainnet address ${address}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for mainnet address ${address}:`, error);
        resultMessage += `Mainnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500); // Process mainnet addresses
  }
  console.log("Cron job finished");
  return resultMessage;
}
