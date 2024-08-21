"use server";
import scaffoldConfig from "~~/scaffold.config";
import { delay } from "../web3/utils";
import { revalidatePath } from "next/cache";
import { fetchTransactions } from "./utils";

const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
const mainnetAddresses = scaffoldConfig.contractAddressList || [];
/**
 * This function is designed to be executed as a daily cron job. Its primary purpose is to fetch transactions
 * from the BNB Smart Chain (BSC) for a list of contract addresses, both on testnet and mainnet, and cache
 * the results for efficient retrieval for client requests.
 */
export async function runCronJobs() {
  console.log("Cron job started");
  let resultMessage = "Cron jobs completed with the following results:\n";

  //Clean cached transaction from fetch-transactions route before cron-job run
  revalidatePath("/api/fetch-transactions");
  console.log("Revalidate complete");

  await delay(500);
  // Process testnet addresses
  for (const address of testnetAddresses) {
    console.log(`Fetching transactions for testnet address: ${address}`);
    try {
      const message = await fetchTransactions(address, true);

      //await getBscTransactions(address, "true", "true", "300");
      resultMessage += `Testnet address ${address} mes: ${message}\n`;
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
      const message = await fetchTransactions(address, false);
      // await getBscTransactions(address, "false", "true", "300");
      resultMessage += `Mainnet address ${address} mes: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for mainnet address ${address}:`, error);
        resultMessage += `Mainnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500); // Avoid hitting rate limits
  }
  console.log("Cron job finished");
  return resultMessage;
}
