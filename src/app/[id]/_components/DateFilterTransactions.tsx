import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ExtendedTransaction } from "~~/types/utils";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface DateFilterTransactionsProps {
  setDateRangeTxs: Dispatch<SetStateAction<ExtendedTransaction[]>>;
  transactions: ExtendedTransaction[];
  col?: boolean | false;
}

const DateFilterTransactions = ({ setDateRangeTxs, transactions, col }: DateFilterTransactionsProps) => {
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
    startDate && setSelectedButton("date");
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
    startDate && setSelectedButton("date");
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

  const dateInputClass = `input input-primary h-full rounded-md truncate p-1 px-1.5 transition-all duration-500 ease-in-out text-sm ${selectedButton === "date" ? "bg-base-300" : "bg-base-100"}`;

  return (
    <div
      className={`flex  ${col ? "flex-col gap-2 items-end" : "sm:flex-row flex-col items-center max-sm:gap-3 max-sm:justify-center max-sm:mb-1 sm:h-[30px]"}`}
    >
      <div className=" flex h-full">
        {buttons.map(button => (
          <button
            key={button.type}
            onClick={() => handleClick(button.type)}
            className={`btn btn-primary btn-xs text-xs rounded-md w-8 !h-full p-0 mr-1 ${selectedButton === button.type ? "bg-base-300" : "bg-base-100"}`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="flex">
        <input
          type="date"
          value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
          onChange={handleStartDateChange}
          min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
          max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
          className={dateInputClass}
        />
        <ArrowLongRightIcon className="w-5 mx-1 " />
        <input
          type="date"
          value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
          onChange={handleEndDateChange}
          min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
          max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
          className={dateInputClass}
        />
      </div>
    </div>
  );
};

export default DateFilterTransactions;
