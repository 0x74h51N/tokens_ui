import { Dispatch, useState } from "react";
import getMethodName from "../../../../utils/getMethodName";
import { ExtendedTransaction } from "./TransactionTable";
import { formatEther } from "viem";
import { ContractName } from "~~/utils/scaffold-eth/contract";

interface TheadProps {
  contractName: ContractName;
  sortTransactions: Dispatch<ExtendedTransaction[]>;
  sortedTransactions: ExtendedTransaction[];
}

const TableHead = ({ sortTransactions, sortedTransactions, contractName }: TheadProps) => {
  const [sortOrder, setSortOrder] = useState<{ [key: string]: string }>({});

  const handleSort = (column: string) => {
    const order = sortOrder[column] === "asc" ? "desc" : "asc";
    setSortOrder({ ...sortOrder, [column]: order });

    const sorted = [...sortedTransactions].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (column) {
        case "date":
          aValue = new Date(Number(a.timeStamp) * 1000);
          bValue = new Date(Number(b.timeStamp) * 1000);
          break;
        case "method":
          aValue = getMethodName(a.from, a.to);
          bValue = getMethodName(b.from, b.to);
          break;
        case "value":
          aValue = Number(formatEther(a.value));
          bValue = Number(formatEther(b.value));
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

    sortTransactions(sorted);
  };

  const getSortIcon = (column: string) => {
    if (!sortOrder[column]) {
      sortOrder[column] = "dsc";
    }
    return sortOrder[column] === "asc" ? "↑" : "↓";
  };

  return (
    <thead>
      <tr className="text-sm text-base-content h-16">
        <th className="bg-primary w-1/12 md:!px-4 !px-2 cursor-pointer" onClick={() => handleSort("date")}>
          Date {getSortIcon("date")}
        </th>
        <th className="bg-primary w-1/12 !px-2">Tx Hash</th>
        <th className="bg-primary w-1/12 !px-2 cursor-pointer" onClick={() => handleSort("method")}>
          Method {getSortIcon("method")}
        </th>
        <th className="bg-primary w-4/12 !px-2">From</th>
        <th className="bg-primary w-4/12 !px-2">To</th>
        <th
          className="bg-primary w-2/12 !px-2 max-w-28 whitespace-pre-line text-end cursor-pointer"
          onClick={() => handleSort("value")}
        >
          Quantity ({contractName.toUpperCase()}) {getSortIcon("value")}
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
