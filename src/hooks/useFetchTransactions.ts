import { useEffect, useState, useCallback } from "react";
import { Address } from "viem";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ExtendedTransaction } from "~~/types/utils";

interface FetchTransactionsResult {
  data: ExtendedTransaction[] | null;
  pending: boolean;
  error: string | null;
}
/**
 * useFetchTransactions Hook
 *
 * Fetches transactions from the BSC network using a server-side API endpoint.
 *
 * @param all - Whether to fetch all transactions or just a subset. If all false it fetches transactions after a short delay and continues to poll the API at a
 *   configured interval (from scaffoldConfig.pollingInterval).
 * @param testnet - Whether to fetch from the testnet or mainnet.
 * @param address - The contract address to fetch transactions for.
 *
 * @returns {FetchTransactionsResult} - The fetched transactions data, loading state, and any error encountered.
 */
const useFetchTransactions = (all: boolean, testnet: boolean, address: Address): FetchTransactionsResult => {
  const [data, setFetchedData] = useState<ExtendedTransaction[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sessionStart = useGlobalState(state => state.sessionStart);

  const globalTransactions = useGlobalState(state => state.transactions[address]);

  const fetchTransactions = useCallback(async () => {
    setPending(true);
    setError(null);
    const offset = all ? 300 : 100;
    const url = `/api/fetch-transactions?contractaddress=${address}&testnet=${testnet}&allTx=${all}&offset=${offset}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        setFetchedData(result);
      } else {
        throw new Error(result.error || "Failed to fetch transactions");
      }
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setPending(false);
    }
  }, [all, testnet, address]);

  useEffect(() => {
    if (sessionStart) {
      if (all && !globalTransactions && !pending) {
        fetchTransactions();
      } else if (!all && !pending) {
        /**
         * Initial fetchTransactions call after a 500ms delay when `all` is false.
         * This starts the process of fetching transactions at regular intervals.
         */
        setTimeout(() => fetchTransactions(), 500);
        /**
         * Set up an interval to fetch live transactions at a configured polling interval.
         */
        const interval = setInterval(() => {
          fetchTransactions();
        }, scaffoldConfig.pollingInterval);

        return () => clearInterval(interval);
      }
    }
  }, [all, sessionStart, globalTransactions]);

  return { data, pending, error };
};

export default useFetchTransactions;
