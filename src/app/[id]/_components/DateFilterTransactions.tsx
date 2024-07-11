import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ExtendedTransaction } from "~~/types/utils";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface DateFilterTransactionsProps {
  setDateRangeTxs: Dispatch<SetStateAction<ExtendedTransaction[]>>;
  transactions: ExtendedTransaction[];
}

const DateFilterTransactions = ({ setDateRangeTxs, transactions }: DateFilterTransactionsProps) => {
  const [selectedButton, setSelectedButton] = useState<string | null>("all");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (transactions.length > 0) {
      const dates = transactions.map(tx => new Date(Number(tx.timeStamp) * 1000));
      const min = new Date(Math.min(...dates.map(date => date.getTime())));
      const max = new Date(Math.max(...dates.map(date => date.getTime())));
      setMinDate(new Date(min.setDate(min.getDate() - 1)));
      setMaxDate(new Date(max.setDate(max.getDate() + 1)));
    }
  }, [transactions]);

  useEffect(() => {
    if (minDate && maxDate) {
      setStartDate(minDate);
      setEndDate(maxDate);
    }
    setDateRangeTxs(transactions);
  }, [transactions]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartDate(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
  };

  useEffect(() => {
    if (startDate && endDate) {
      updateDateRange(startDate, endDate);
    }
  }, [startDate, endDate]);

  const updateDateRange = (start: Date, end: Date) => {
    const startTime = start.getTime() / 1000;
    const endTime = end.getTime() / 1000;
    const filteredTransactions = transactions.filter(
      tx => Number(tx.timeStamp) >= startTime && Number(tx.timeStamp) <= endTime,
    );
    setDateRangeTxs(filteredTransactions);
  };

  const handleClick = (type: string) => {
    setSelectedButton(type);
    const now = new Date();
    let startDate: Date;
    const endDate = new Date();
    switch (type) {
      case "all":
        setDateRangeTxs(transactions);
        if (minDate && maxDate) {
          setStartDate(minDate);
          setEndDate(maxDate);
        }
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        setStartDate(startDate);
        setEndDate(endDate);
        break;
      case "sixMonth":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        setStartDate(startDate);
        setEndDate(endDate);
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        setStartDate(startDate);
        setEndDate(endDate);
        break;
      default:
        setDateRangeTxs(transactions);
    }
  };

  const buttons = [
    { label: "1M", type: "month" },
    { label: "6M", type: "sixMonth" },
    { label: "1Y", type: "year" },
    { label: "All", type: "all" },
  ];

  const dateInputClass = `input input-primary h-full rounded-md truncate max-w-20 p-1 px-1.5 focus:max-w-60 transition-all duration-500 ease-in-out text-sm ${selectedButton === "date" ? "bg-base-300" : "bg-base-100"}`;

  return (
    <div className="flex items-center">
      {buttons.map(button => (
        <button
          key={button.type}
          onClick={() => handleClick(button.type)}
          className={`btn btn-primary btn-xs text-xs rounded-md w-8 !h-full p-0 mr-1 ${selectedButton === button.type ? "bg-base-300" : "bg-base-100"}`}
        >
          {button.label}
        </button>
      ))}
      <input
        type="date"
        value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
        onChange={handleStartDateChange}
        min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
        max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
        className={dateInputClass}
      />
      <span className="text-primary-content">-</span>
      <input
        type="date"
        value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
        onChange={handleEndDateChange}
        min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
        max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
        className={dateInputClass}
      />
      {startDate && endDate && (
        <div className="absolute top-7 flex right-6 antialiased italic">
          <span>{startDate.toLocaleDateString()}</span>
          <ArrowLongRightIcon className="w-5 mx-1 self-end" />
          <span>{endDate.toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default DateFilterTransactions;
