import { useEffect, useReducer, useRef, useState } from "react";
import HandlePages from "./HandlePages";
import Method from "./Method";
import { TransactionHash } from "./TransactionHash";
import { TransactionBase, formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { fetchTransactions } from "~~/lib/fetchTransactions";
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
  const [currentTransactions, setCurrentTransactions] = useReducer(
    (state: ExtendedTransaction[], action: ExtendedTransaction[]) => action,
    [],
  );
  const transactionsPerPage = 17;
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);
  const testnet = targetNetwork.testnet || false;
  const fetchAndSetTransactions = async (all: boolean) => {
    if (!deployedContractData.address) return;

    if (initialLoad.current) {
      setLoading(true);
    }

    try {
      const data = await fetchTransactions(deployedContractData.address, testnet, all);
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }

    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  useEffect(() => {
    if (deployedContractData.address) {
      fetchAndSetTransactions(true).then(() => {
        setLoading(false);
        setTimeout(() => {
          fetchAndSetTransactions(false);
        }, 500);
      });

      const interval = setInterval(() => {
        fetchAndSetTransactions(false);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [deployedContractData.address]);

  return (
    <div className="flex flex-col justify-start px-4 md:px-0 overflow-hidden h-full">
      <div className={`overflow-x-auto w-full shadow-2xl ${currentTransactions.length > 10 ? "flex-1" : ""}`}>
        {loading ? (
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
