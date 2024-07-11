import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { ExtendedTransaction } from "~~/types/utils";
import getMethodName from "~~/utils/getMethodName";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import DateFilterTransactions from "../DateFilterTransactions";

interface TransactionFilterHeadProps {
  setSortedTransactions: Dispatch<SetStateAction<ExtendedTransaction[]>>;
  transactions: ExtendedTransaction[];
  contractName: ContractName;
}

const TransactionFilterHead = ({ setSortedTransactions, transactions, contractName }: TransactionFilterHeadProps) => {
  const [dateRangeTxs, setDateRangeTxs] = useState<ExtendedTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    let filteredTransactions = dateRangeTxs;
    if (searchTerm) {
      filteredTransactions = dateRangeTxs.filter(
        tx =>
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.to && tx.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
          getMethodName(tx.from, tx.to).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setSortedTransactions(filteredTransactions);
  }, [dateRangeTxs, searchTerm]);

  return (
    <div className="p-4 bg-base-300 rounded-t-xl">
      <h1 className="w-full font-bold lg:text-4xl md:text-2xl text-xl card-title  antialiased m-0">
        <span className="relative">
          {contractName.toUpperCase()} Transactions
          <span
            data-tip="Contract transactions (max 30s delay)"
            className="absolute tooltip tooltip-info tooltip-right top-0 -right-2 text-[0.35em] text-xs cursor-help text-center before:max-w-[120px] before:top-4"
          >
            ?
          </span>
        </span>
      </h1>
      {isLoggedIn && (
        <div className="flex justify-between w-full h-8 mt-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="input input-primary w-32 2xl:w-40 lg:w-36 md:focus-within:w-60 focus-within:w-[200px] rounded-md h-full truncate p-2 transition-all ease-in-out duration-500"
          />
          <DateFilterTransactions setDateRangeTxs={setDateRangeTxs} transactions={transactions} />
        </div>
      )}
    </div>
  );
};

export default TransactionFilterHead;
