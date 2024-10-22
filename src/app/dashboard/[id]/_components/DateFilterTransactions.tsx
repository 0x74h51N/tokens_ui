import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ExtendedTransaction } from "~~/types/utils";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface DateFilterTransactionsProps {
  setDateRangeTxs: Dispatch<SetStateAction<ExtendedTransaction[]>>;
  transactions: ExtendedTransaction[];
  col?: boolean | false;
}
/**
 * DateFilterTransactions Component
 *
 * This component allows users to filter a list of transactions by a specified date range.
 * The filtered transactions are then passed to the parent component through the `setDateRangeTxs` prop.
 * Users can either select predefined date ranges (e.g., 1 month, 6 months, 1 year)
 * or specify a custom date range using date input fields.
 *
 * @param {DateFilterTransactionsProps} props - The props for the DateFilterTransactions component.
 * @param {Dispatch<SetStateAction<ExtendedTransaction[]>>} props.setDateRangeTxs - A state setter function to update the filtered transactions list based on the selected date range.
 * @param {ExtendedTransaction[]} props.transactions - The original list of transactions to be filtered.
 * @param {boolean | false} [props.col] - An optional prop that determines the layout direction (column or row) for the component.
 *
 * @returns {JSX.Element} The rendered component for filtering transactions by date range.
 */
const DateFilterTransactions = ({ setDateRangeTxs, transactions, col }: DateFilterTransactionsProps) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(() => "all");

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
  }, [minDate, maxDate, setDateRangeTxs, transactions]);

  // Function to handle changes in the custom start or end date input fields
  const handleDateChange =
    (setter: Dispatch<SetStateAction<Date | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value) : null;
      setter(date);
      setSelectedButton("date");
    };

  // Function to filter the transactions based on the selected date range
  const updateDateRange = useCallback(
    (start: Date, end: Date) => {
      const startTime = start.getTime() / 1000;
      const endTime = end.getTime() / 1000;
      const filteredTransactions = transactions.filter(
        tx => Number(tx.timeStamp) >= startTime && Number(tx.timeStamp) <= endTime,
      );
      setDateRangeTxs(filteredTransactions);
    },
    [transactions, setDateRangeTxs],
  );

  // Effect to update the filtered transactions when the start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      updateDateRange(startDate, endDate);
    }
  }, [startDate, endDate, updateDateRange]);

  // Function to handle the selection of predefined date ranges (e.g., 1 month, 6 months, 1 year, all)
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
          onChange={handleDateChange(setStartDate)}
          min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
          max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
          className={dateInputClass}
        />
        <ArrowLongRightIcon className="w-5 mx-1 " />
        <input
          type="date"
          value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : ""}
          onChange={handleDateChange(setEndDate)}
          min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
          max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
          className={dateInputClass}
        />
      </div>
    </div>
  );
};

export default DateFilterTransactions;
