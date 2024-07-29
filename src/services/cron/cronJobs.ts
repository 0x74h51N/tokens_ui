"use server";
import scaffoldConfig from "~~/scaffold.config";

interface FetchTransactionsResponse {
  message: string;
}
const cronSecret = process.env.CRON_SECRET;
const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
const mainnetAddresses = scaffoldConfig.contractAddressList || [];
const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://tokens-ui.vercel.app";

console.log(`Base URL: ${baseUrl}`);
console.log(`CRON_SECRET: ${cronSecret}`);

async function fetchTransactions(contractAddress: string, testnet: boolean) {
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet}&allTx=true&cleanCache=true`;
  console.log(`Fetching transactions from URL: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    console.error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch transactions for ${contractAddress}`);
  }

  const data = (await response.json()) as FetchTransactionsResponse;
  console.log(`Transactions fetched for ${contractAddress}: ${JSON.stringify(data)}`);
  return data.message;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runCronJobs() {
  console.log("Cron job started");
  let resultMessage = "Cron jobs completed with the following results:\n";

  await delay(500);

  for (const address of testnetAddresses) {
    console.log(`Fetching transactions for testnet address: ${address}`);
    try {
      const message = await fetchTransactions(address, true);
      console.log(`Successfully fetched transactions for testnet address: ${address}`);
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
      const message = await fetchTransactions(address, false);
      console.log(`Successfully fetched transactions for mainnet address: ${address}`);
      resultMessage += `Mainnet address ${address}: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for mainnet address ${address}:`, error);
        resultMessage += `Mainnet address ${address}: ${error.message}\n`;
      }
    }
    await delay(500);
  }

  console.log(resultMessage);
  console.log("Cron job finished");
  return resultMessage;
}
