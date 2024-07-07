import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
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
  const { address: walletAddress } = useAccount();
  const sessionStart = useGlobalState(state => state.sessionStart);

  const globalTransactions = useGlobalState(state => state.transactions[address]);

  const fetchTransactions = async () => {
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
  };

  useEffect(() => {
    const isLoggedIn = (walletAddress && sessionStart[walletAddress]?.isLogin) || false;
    if (isLoggedIn) {
      if (all && !globalTransactions) {
        setTimeout(() => fetchTransactions(), 500);
      } else if (!all) {
        const interval = setInterval(() => {
          fetchTransactions();
        }, 30000);

        return () => clearInterval(interval);
      }
    }
  }, [all, testnet, address, sessionStart, globalTransactions, walletAddress]);

  return { data, pending, error };
};

export default useFetchTransactions;
