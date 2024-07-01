import { useEffect, useReducer, useState } from "react";
import HandlePages from "./HandlePages";
import { TransactionHash } from "./TransactionHash";
import { TransactionBase, formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
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
  const transactionsPerPage = 17;
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [currentTransactions, setCurrentTransactions] = useReducer(
    (state: ExtendedTransaction[], action: ExtendedTransaction[]) => action,
    [],
  );
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!deployedContractData.address) return;

    setLoading(true);
    const url = `/api/fetch-transactions?contractaddress=${deployedContractData.address}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      setTransactions(data);
    } else {
      console.error(data.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (deployedContractData.address) {
      fetchTransactions();
    }
  }, [deployedContractData.address]);

  return (
    <div className="flex flex-1 justify-center px-4 md:px-0 overflow-y-auto h-full">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <table className="table text-lg bg-base-100 table-zebra w-full md:table-md table-sm">
              <thead className="h-16">
                <tr className="rounded-lg text-sm  text-base-content">
                  <th className="bg-primary">Time</th>
                  <th className="bg-primary">{"Transaction\nHash"}</th>
                  <th className="bg-primary">From</th>
                  <th className="bg-primary">To</th>
                  <th className="bg-primary text-end">Value ({contractName.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx, i: number) => {
                  const timeMined = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");

                  return (
                    <tr key={tx.hash + " table key " + i} className="hover text-sm">
                      <td className="w-2/12 md:py-2 text-xs">{timeMined}</td>
                      <td className="w-1/12 md:py-2">
                        <TransactionHash hash={tx.hash} />
                      </td>
                      <td className="w-2/12 md:py-2">
                        <Address address={tx.from} size="sm" />
                      </td>
                      <td className="w-2/12 md:py-2">
                        {tx.to ? <Address address={tx.to} size="sm" /> : <span>(Contract Creation)</span>}
                      </td>
                      <td className="text-right md:py-2 truncate">
                        {parseFloat(Number(formatEther(tx.value)).toFixed(6))} {tx.tokenSymbol}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        <HandlePages
          transactions={transactions}
          transactionsPerPage={transactionsPerPage}
          setCurrentTransactions={setCurrentTransactions}
        />
      </div>
    </div>
  );
};
