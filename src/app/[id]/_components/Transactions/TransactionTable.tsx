import { useEffect, useReducer, useRef, useState } from "react";
import HandlePages from "./HandlePages";
import { TransactionHash } from "./TransactionHash";
import { TransactionBase, decodeFunctionData, formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
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
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [currentTransactions, setCurrentTransactions] = useReducer(
    (state: ExtendedTransaction[], action: ExtendedTransaction[]) => action,
    [],
  );
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 17;
  const initialLoad = useRef(true);

  const fetchTransactions = async () => {
    if (!deployedContractData.address) return;

    if (initialLoad.current) {
      setLoading(true);
    }

    const testnet = targetNetwork.testnet ? "true" : "false";
    const url = `/api/fetch-transactions?contractaddress=${deployedContractData.address}&testnet=${testnet}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      setTransactions(data);
      console.log(data);
    } else {
      console.error(data.error);
    }

    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  useEffect(() => {
    if (deployedContractData.address) {
      fetchTransactions();
      const interval = setInterval(() => {
        fetchTransactions();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [deployedContractData.address]);
  const decodeInput = (input: `0x${string}`) => {
    try {
      const decodedData = decodeFunctionData({
        abi: deployedContractData.abi,
        data: input,
      });
      return decodedData;
    } catch (error) {
      return "unknown";
    }
  };
  return (
    <div className="flex flex-col flex-1 justify-center px-4 md:px-0 overflow-hidden h-full">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl flex-1">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <table className="table text-lg bg-base-100 table-zebra w-full md:table-md table-sm h-full">
              <thead className="h-16">
                <tr className="rounded-lg text-sm text-base-content">
                  <th className="bg-primary">Time</th>
                  <th className="bg-primary">Transaction Hash</th>
                  <th className="bg-primary">From</th>
                  <th className="bg-primary">To</th>
                  <th className="bg-primary text-end">Value ({contractName.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {currentTransactions.map((tx, i: number) => {
                  const timeMined = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");

                  return (
                    <tr key={tx.hash + " table key " + i} className="hover text-sm min-h-5">
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
      </div>
      <HandlePages
        transactions={transactions}
        transactionsPerPage={transactionsPerPage}
        setCurrentTransactions={setCurrentTransactions}
      />
    </div>
  );
};
