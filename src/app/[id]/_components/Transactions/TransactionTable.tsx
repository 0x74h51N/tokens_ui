import { useEffect, useReducer, useState } from "react";
import HandlePages from "./HandlePages";
import TableHead from "./TableHead";
import { TransactionHash } from "./TransactionHash";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import useFetchTransactions from "~~/hooks/useFetchTransactions";
import { useGlobalState } from "~~/services/store/store";
import { ExtendedTransaction } from "~~/types/utils";
import { formatPrice } from "~~/utils/formatPrice";
import formatTime from "~~/utils/formatTime";
import getMethodName from "~~/utils/getMethodName";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import TransactionFilterHead from "./TransactionFilterHead";

export const TransactionsTable = ({
  deployedContractData,
  contractName,
}: {
  deployedContractData: Contract<ContractName>;
  contractName: ContractName;
}) => {
  const { targetNetwork } = useTargetNetwork();
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;
  const [currentTransactions, setCurrentTransactions] = useReducer(
    (state: ExtendedTransaction[], action: ExtendedTransaction[]) => action,
    [],
  );
  const transactionsPerPage = 17;
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [sortedTransactions, setSortedTransactions] = useState<ExtendedTransaction[]>([]);
  const testnet = targetNetwork.testnet || false;
  const allTransactions = useGlobalState(state => state.transactions[deployedContractData.address]);
  const { data, error } = useFetchTransactions(false, testnet, deployedContractData.address);

  useEffect(() => {
    if (allTransactions) {
      const transactionsWithMethod: ExtendedTransaction[] = allTransactions.map(tx => {
        const methodName = getMethodName(tx.from, tx.to);
        return {
          ...tx,
          method: methodName,
        };
      });

      setTransactions(transactionsWithMethod);
    }
  }, [allTransactions]);

  useEffect(() => {
    if (data && !error) {
      const recentPrevTransactions = transactions.slice(0, 120);
      const newTxs = data.filter(
        (newTx: { hash: string }) => !recentPrevTransactions.some(prevTx => prevTx.hash === newTx.hash),
      );
      if (newTxs.length > 0) {
        const newTxsWithMethod = newTxs.map(tx => {
          const methodName = getMethodName(tx.from, tx.to);
          return {
            ...tx,
            method: methodName,
          };
        });

        setTransactions(prevTransactions => [...newTxsWithMethod, ...prevTransactions]);
      }
    }
  }, [data, transactions]);
  useEffect(() => {
    setSortedTransactions(transactions);
  }, [transactions]);
  return (
    <div className="flex flex-col justify-start px-0 overflow-hidden h-full">
      <TransactionFilterHead
        setSortedTransactions={setSortedTransactions}
        transactions={transactions}
        contractName={contractName}
      />
      <div className={`overflow-x-auto w-full ${currentTransactions.length > 10 || !isLoggedIn ? "flex-1" : ""}`}>
        {isLoggedIn ? (
          <table className="table text-lg bg-base-100 table-zebra-zebra w-full 2xl:table-lg lg:table-md sm:table-sm table-xs h-full rounded-none">
            <TableHead
              contractName={contractName}
              sortTransactions={setSortedTransactions}
              sortedTransactions={sortedTransactions}
            />
            <tbody className="overflow-y-auto">
              {currentTransactions.map((tx, i) => {
                const timeMined = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");
                const timeMinedFormatted = formatTime(tx.timeStamp, false);
                const length = formatEther(tx.value).length;
                return (
                  <tr key={tx.hash + " table key " + i} className="hover min-h-5 z-50">
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
                    <td className="xl:w-2/12 w-4/12 !p-2 text-sm">{tx.method}</td>
                    <td className="xl:w-2/12 w-4/12 !p-2 text-sm !pr-4">
                      <Address address={tx.from} size="sm" />
                    </td>
                    <td className="xl:w-2/12 w-4/12 !p-2 text-sm">
                      {tx.to ? <Address address={tx.to} size="sm" /> : <span>(Contract Creation)</span>}
                    </td>
                    <td className="xl:w-2/12 w-2/12 12 text-right !p-2 text-sm !pl-4 min-w-28">
                      <div
                        data-tip={formatEther(tx.value)}
                        className={`${
                          length > 4 && "tooltip"
                        } tooltip-top tooltip-secondary before:max-w-[900px] before:text-xs ${
                          length > 14 ? "before:-left-8" : "before:left-auto before:-right-3"
                        }`}
                      >
                        {formatPrice(Number(formatEther(tx.value)))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex items-center justify-center text-xl italic bg-base-100 max-md:min-h-40">
            Please connect your wallet for data request...
          </div>
        )}
      </div>
      {isLoggedIn && (
        <HandlePages
          transactions={sortedTransactions}
          transactionsPerPage={transactionsPerPage}
          setCurrentTransactions={setCurrentTransactions}
        />
      )}
    </div>
  );
};
