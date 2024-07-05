import { useEffect, useReducer, useRef, useState } from "react";
import HandlePages from "./HandlePages";
import Method from "./Method";
import { TransactionHash } from "./TransactionHash";
import { TransactionBase, formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { formatPrice } from "~~/utils/formatPrice";
import formatTime from "~~/utils/formatTime";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export interface ExtendedTransaction extends TransactionBase {
  timeStamp: string;
  tokenSymbol: string;
}

export const TransactionsTable = ({
  deployedContractData,
  contractName,
}: {
  deployedContractData: Contract<ContractName>;
  contractName: ContractName;
}) => {
  const { targetNetwork } = useTargetNetwork();
  const { isConnected } = useAccount();
  const [currentTransactions, setCurrentTransactions] = useReducer(
    (state: ExtendedTransaction[], action: ExtendedTransaction[]) => action,
    [],
  );
  const transactionsPerPage = 17;
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  const fetchTransactions = async (all: boolean, testnet: boolean) => {
    if (!targetNetwork) return console.log("target error");

    if (!deployedContractData.address) return;

    if (initialLoad.current) {
      setLoading(true);
    }
    const url = `/api/fetch-transactions?contractaddress=${deployedContractData.address}&testnet=${testnet}&allTx=${all}&cleanCache=false`;
    const response = await fetch(url);
    const data = await response.json();

    try {
      if (response.ok) {
        if (!all) {
          setTransactions(prevTransactions => {
            const recentPrevTransactions = prevTransactions.slice(0, 120);
            const newTransactions = data.filter(
              (newTx: ExtendedTransaction) => !recentPrevTransactions.some(prevTx => prevTx.hash === newTx.hash),
            );
            const combinedTransactions = [...newTransactions, ...prevTransactions];
            return combinedTransactions;
          });
        } else setTransactions(data);
      } else {
        throw new Error(data.error || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error(error);
    }

    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  useEffect(() => {
    !isConnected && setTransactions([]);
    const testnet = targetNetwork.testnet || false;
    const fetchTransactionsWithDelay = async () => {
      transactions.length < 150 && (await fetchTransactions(true, testnet));
      setLoading(false);
      setTimeout(async () => {
        await fetchTransactions(false, testnet);
      }, 500);
    };

    if (isConnected && deployedContractData.address) {
      fetchTransactionsWithDelay();

      const interval = setInterval(async () => {
        await fetchTransactions(false, testnet);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [deployedContractData.address, targetNetwork.testnet, isConnected]);

  return (
    <div className="flex flex-col justify-start px-4 md:px-0 overflow-hidden h-full">
      <div
        className={`overflow-x-auto w-full shadow-2xl ${
          currentTransactions.length > 10 || !isConnected ? "flex-1" : ""
        }`}
      >
        {isConnected ? (
          loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <table className="table text-lg bg-base-100 table-zebra-zebra w-full 2xl:table-lg lg:table-md sm:table-sm table-xs h-full rounded-none">
                <thead>
                  <tr className="text-sm text-base-content h-16">
                    <th className="bg-primary w-1/12 md:!px-4 !px-2">Time</th>
                    <th className="bg-primary w-1/12 !px-2">Tx Hash</th>
                    <th className="bg-primary w-1/12 !px-2">Method</th>
                    <th className="bg-primary w-4/12 !px-2">From</th>
                    <th className="bg-primary w-4/12 !px-2">To</th>
                    <th className="bg-primary w-2/12 !px-2 text-end">Value ({contractName.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {currentTransactions.map((tx, i: number) => {
                    const timeMined = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");
                    const timeMinedFormatted = formatTime(tx.timeStamp, false);
                    return (
                      <tr key={tx.hash + " table key " + i} className="hover min-h-5">
                        <td className="xl:w-2/12 w-1/12 md:!px-4 !p-2 text-sm">
                          <div
                            data-tip={timeMined}
                            className=" tooltip tooltip-top tooltip-secondary before:left-10 before:max-w-[70px] before:text-xs"
                          >
                            {timeMinedFormatted}
                          </div>
                        </td>
                        <td className="xl:w-2/12 w-1/12 !p-2 text-sm">
                          <TransactionHash hash={tx.hash} />
                        </td>
                        <td className="xl:w-2/12 w-4/12 !p-2 text-sm">
                          <Method from={tx.from} to={tx.to} />
                        </td>
                        <td className="xl:w-2/12 w-4/12 !p-2 text-sm !pr-4">
                          <Address address={tx.from} size="sm" />
                        </td>
                        <td className="xl:w-2/12 w-4/12 !p-2 text-sm">
                          {tx.to ? <Address address={tx.to} size="sm" /> : <span>(Contract Creation)</span>}
                        </td>
                        <td className="xl:w-2/12 w-2/12 12 text-right !p-2 truncate text-sm !pl-4">
                          {formatPrice(Number(formatEther(tx.value)))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-xl italic bg-base-100">
            Please connect your wallet for data request...
          </div>
        )}
      </div>
      <HandlePages
        transactions={transactions}
        transactionsPerPage={transactionsPerPage}
        setCurrentTransactions={setCurrentTransactions}
      />
    </div>
  );
};
