import React, { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { ExtendedTransaction } from "./TransactionTable";

const HandlePages = ({
  transactions,
  transactionsPerPage,
  setCurrentTransactions,
}: {
  transactions: ExtendedTransaction[];
  transactionsPerPage: number;
  setCurrentTransactions: Dispatch<ExtendedTransaction[]>;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(transactions.length / transactionsPerPage),
    [transactions, transactionsPerPage],
  );

  const handleClick = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const currentTransactions = useMemo(() => {
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    return transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  }, [currentPage, transactions, transactionsPerPage]);

  useEffect(() => {
    setCurrentTransactions(currentTransactions);
  }, [currentTransactions, setCurrentTransactions]);

  const renderPageNumbers = useMemo(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 4 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            className={`bg-base-100 px-2 py-1 m-1 rounded-md text-xs ${i === currentPage ? "bg-base-300" : ""}`}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>,
        );
      } else if (i === 5 || (i === currentPage + 2 && currentPage < totalPages - 3)) {
        pageNumbers.push(
          <span key={i} className="mx-4">
            ...
          </span>,
        );
      }
    }
    return pageNumbers;
  }, [totalPages, currentPage, handleClick]);

  return (
    <div className="flex justify-center w-full">
      <div className="btn-group">{renderPageNumbers}</div>
    </div>
  );
};

export default HandlePages;
