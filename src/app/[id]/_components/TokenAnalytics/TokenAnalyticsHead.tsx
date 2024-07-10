import React, { Dispatch, useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import { filterByDateRange } from "./_utils/filterByDateRange";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { ChartDataType } from "./TokenAnalytics";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import dayjs from "dayjs";
import { useGlobalState } from "~~/services/store/store";

interface TokenAnalyticsHeadProps {
  contractName: ContractName;
  setFilteredTransfers: Dispatch<React.SetStateAction<Record<string, ChartDataType>>>;
  transfers: Record<string, ChartDataType>;
}

const TokenAnalyticsHead: React.FC<TokenAnalyticsHeadProps> = ({ contractName, setFilteredTransfers, transfers }) => {
  const [selectedButton, setSelectedButton] = useState<string | null>("all");
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    const dates = Object.keys(transfers).map(date => new Date(date));
    if (dates.length > 0) {
      setMinDate(new Date(Math.min(...dates.map(date => date.getTime()))));
      setMaxDate(new Date(Math.max(...dates.map(date => date.getTime()))));
    }
  }, [transfers]);

  const handleClick = (type: string) => {
    setSelectedButton(type);
    const now = new Date();
    let startDate: Date;
    switch (type) {
      case "all":
        setFilteredTransfers(transfers);
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        setFilteredTransfers(filterByDateRange(transfers, startDate, new Date()));
        break;
      case "sixMonth":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        setFilteredTransfers(filterByDateRange(transfers, startDate, new Date()));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        setFilteredTransfers(filterByDateRange(transfers, startDate, new Date()));
        break;
      default:
        setFilteredTransfers(transfers);
    }
  };

  useEffect(() => {
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const startDate = dayjs(dateRange.startDate).toDate();
      const endDate = dayjs(dateRange.endDate).toDate();
      setFilteredTransfers(filterByDateRange(transfers, startDate, endDate));
      setSelectedButton(null);
    }
  }, [dateRange]);

  const buttons = [
    { label: "1M", type: "month" },
    { label: "6M", type: "sixMonth" },
    { label: "1Y", type: "year" },
    { label: "All", type: "all" },
  ];

  return (
    <div className="m-4 mx-8 ">
      <h1 className="font-bold lg:text-4xl md:text-2xl text-xl card-title m-0">
        {contractName.toUpperCase() + " Analytics"}
      </h1>
      {isLoggedIn && (
        <div className="flex h-7 my-2 relative">
          {buttons.map(button => (
            <button
              key={button.type}
              onClick={() => handleClick(button.type)}
              className={`text-xs rounded-md w-8 h-full p-0 mr-1 ${
                selectedButton === button.type ? "bg-base-300" : "bg-base-100"
              }`}
            >
              {button.label}
            </button>
          ))}

          <div className="z-10">
            <Datepicker
              value={dateRange}
              onChange={newValue => setDateRange(newValue)}
              displayFormat="YYYY-MM-DD"
              readOnly={false}
              primaryColor={"teal"}
              placeholder="Select date range"
              showFooter={true}
              minDate={minDate}
              maxDate={maxDate}
              inputClassName="input input-border text-primary-content w-24 focus:w-36 transition-all ease-in-out duration-500 rounded-md h-7 text-xs p-1 truncate"
              toggleClassName="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenAnalyticsHead;
