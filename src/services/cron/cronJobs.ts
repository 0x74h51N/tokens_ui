"use server";
import { revalidatePath } from "next/cache";
import scaffoldConfig from "~~/scaffold.config";

import { delay } from "../web3/utils";
import { fetchTransactions } from "./utils";

const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
const mainnetAddresses = scaffoldConfig.contractAddressList || [];

export async function runCronJobs() {
  console.log("Cron job started");
  revalidatePath("/api/fetch-transactions");
  let resultMessage = "Cron jobs completed with the following results:\n";

  await delay(500);

  for (const address of testnetAddresses) {
    console.log(`Fetching transactions for testnet address: ${address}`);
    try {
      const message = await fetchTransactions(address, "true");
      resultMessage += `Testnet address ${address}: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for testnet address ${address}:`, error);
        resultMessage += `Testnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500);
  }

  for (const address of mainnetAddresses) {
    console.log(`Fetching transactions for mainnet address: ${address}`);
    try {
      const message = await fetchTransactions(address, "false");
      resultMessage += `Mainnet address ${address}: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for mainnet address ${address}:`, error);
        resultMessage += `Mainnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500);
  }
  console.log("Cron job finished");
  return resultMessage;
}
