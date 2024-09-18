import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { ExtendedTransaction } from "~~/types/utils";
import getMethodName from "~~/utils/getMethodName";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import DateFilterTransactions from "../DateFilterTransactions";
import { FunnelIcon } from "@heroicons/react/24/outline";
import DownloadCSVButton from "./DownloadCSVButton";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

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
  const [filteredTransactions, setFiltered] = useState<ExtendedTransaction[]>([]);
  const [filter, setFilter] = useState<boolean>(false);
  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
  };
  const { tags } = useGlobalState(state => ({
    tags: state.tags,
  }));
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDateRangeTxs(transactions);
  }, [transactions]);
  useOutsideClick(menuRef, () => filter && setFilter(false));

  useEffect(() => {
    if (dateRangeTxs) {
      setFiltered(dateRangeTxs);
      if (searchTerm) {
        const matchingAddresses = Array.from(tags.entries())
          .filter(([, tag]) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(([address]) => address.toLowerCase());

        setFiltered(
          dateRangeTxs.filter(tx => {
            return (
              tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (tx.to && tx.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
              getMethodName(tx.from, tx.to).toLowerCase().includes(searchTerm.toLowerCase()) ||
              matchingAddresses.includes(tx.from.toLowerCase()) ||
              (tx.to && matchingAddresses.includes(tx.to.toLowerCase()))
            );
          }),
        );
      }
    }
  }, [dateRangeTxs, searchTerm, tags]);
  useEffect(() => {
    setSortedTransactions(filteredTransactions);
  }, [filteredTransactions, setSortedTransactions]);
  return (
    <div className="p-4 bg-base-300 rounded-t-xl">
      <h1 className="w-full font-bold lg:text-4xl md:text-2xl text-xl card-title  antialiased m-0">
        <span className="relative">
          {contractName.toUpperCase()} Transactions
          <span
            data-tip="All transactions (max 30s delay)"
            className="absolute tooltip tooltip-info tooltip-right top-0 -right-2 text-[0.35em] text-xs cursor-help text-center before:max-w-[130px] before:top-6"
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
          <div className="flex relative" ref={menuRef}>
            <button
              className="btn btn-ghost btn-xs h-full rounded-md tooltip tooltip-top tooltip-primary"
              onClick={() => setFilter(!filter)}
              data-tip="Filter"
            >
              <FunnelIcon className="w-6 h-6 text-primary-content" />
            </button>
            {filter && (
              <div className="absolute border-[1px] border-base-100 h-auto right-0 -bottom-24 z-30 bg-base-200 p-2 py-3 rounded-md">
                <DateFilterTransactions col setDateRangeTxs={setDateRangeTxs} transactions={transactions} />
              </div>
            )}
            <DownloadCSVButton data={transactions} fileName={"transactions"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilterHead;
