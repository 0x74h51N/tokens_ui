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

const useFetchTransactions = (all: boolean, testnet: boolean, address: Address): FetchTransactionsResult => {
  const [data, setFetchedData] = useState<ExtendedTransaction[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sessionStart = useGlobalState(state => state.sessionStart);

  const globalTransactions = useGlobalState(state => state.transactions[address]);

  const fetchTransactions = useCallback(async () => {
    setPending(true);
    setError(null);

    const url = `/api/fetch-transactions?contractaddress=${address}&testnet=${testnet ? "true" : "false"}&allTx=${
      all ? "true" : "false"
    }&cleanCache=false`;

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
      if (all && !globalTransactions) {
        fetchTransactions();
      } else if (!all) {
        setTimeout(() => fetchTransactions(), 500);
        const interval = setInterval(() => {
          fetchTransactions();
        }, scaffoldConfig.pollingInterval);

        return () => clearInterval(interval);
      }
    }
  }, [all, sessionStart, globalTransactions, fetchTransactions]);

  return { data, pending, error };
};

export default useFetchTransactions;
