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
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`bg-base-100 px-2 py-1 m-1 rounded-md text-xs ${i === currentPage ? "bg-base-200" : ""}`}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>,
        );
      }
    } else {
      pageNumbers.push(
        <button
          key={1}
          className={`bg-base-100 px-2 py-1 m-1 rounded-md text-xs ${currentPage === 1 ? "bg-base-200" : ""}`}
          onClick={() => handleClick(1)}
        >
          1
        </button>,
      );

      if (currentPage > 3) {
        pageNumbers.push(
          <span key="left-ellipsis" className="mx-2">
            ...
          </span>,
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`bg-base-100 px-2 py-1 m-1 rounded-md text-xs ${i === currentPage ? "bg-base-200" : ""}`}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>,
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <span key="right-ellipsis" className="mx-2">
            ...
          </span>,
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`bg-base-100 px-2 py-1 m-1 rounded-md text-xs ${currentPage === totalPages ? "bg-base-200" : ""}`}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  }, [totalPages, currentPage, handleClick]);

  return (
    <div className="flex justify-between px-3 items-center w-full bg-base-300 rounded-b-xl h-10 select-none">
      <div className="btn-group">{renderPageNumbers}</div>
      <span className="text-sm text-center italic">
        A total of {transactions.length.toLocaleString()} transactions found
      </span>
    </div>
  );
};

export default HandlePages;
