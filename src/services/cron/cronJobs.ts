"use server";
import scaffoldConfig from "~~/scaffold.config";
import { delay } from "../web3/utils";
import { revalidatePath } from "next/cache";
import { fetchTransactions } from "./utils";

const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
const mainnetAddresses = scaffoldConfig.contractAddressList || [];
/**
 * This function fetches transactions for the daily cron-job to cache transaction data on the server.
 * Transactions are not fetched directly via the getBscTransactions function to allow better control
 * and purging of cached data before fetching.
 * If data were cached directly via the getBscTransactions function, it is not possible to revalidate the cached data.
 * At least I couldn't manage it...
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
