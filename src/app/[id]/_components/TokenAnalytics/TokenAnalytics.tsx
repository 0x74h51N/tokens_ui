import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { useGlobalState } from "~~/services/store/store";
import getMethodName from "~~/utils/getMethodName";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import chartOptions, { ChartData, ChartDataType } from "./_utils/chartOptions";
import verticalLinePlugin from "./_utils/verticalLinePlugin";
import { useTheme } from "next-themes";
import { Colors, getThemeColors, initialColors } from "./_utils/colors";
import "chartjs-adapter-date-fns";
import { ExtendedTransaction } from "~~/types/utils";
import { dailyGroupedData, twoDaysGroupedData, weeklyGroupedData } from "./_utils/dataGroupFuncs";
import DateFilterTransactions from "../DateFilterTransactions";
ChartJS.register(...registerables);

const TokenAnalytics = ({
  deployedContractData,
  contractName,
}: {
  deployedContractData: Contract<ContractName>;
  contractName: ContractName;
}) => {
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;
  const { resolvedTheme } = useTheme();

  const [colors, setColors] = useState<Colors>(initialColors);
  const [options, setOptions] = useState<ChartOptions | null>(null);
  const [maxDateTicks, setDateTicks] = useState<number>(10);

  /**Data states*/
  const globalTransactions = useGlobalState(state => state.transactions[deployedContractData.address]);
  const [allTransfers, setAllTransfers] = useState<ExtendedTransaction[]>([]);
  const [dateRangeTxs, setDateRangeTxs] = useState<ExtendedTransaction[]>([]);
  const [dataToUse, setDataToUse] = useState<Record<string, ChartDataType>>({});
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setColors(getThemeColors(resolvedTheme));
    }
  }, [resolvedTheme]);

  /**Filter transactions to only include valid transfer transactions */
  useEffect(() => {
    if (globalTransactions && globalTransactions.length > 0) {
      const transferTransactions = globalTransactions.filter(
        tx => getMethodName(tx.from, tx.to).toLowerCase() === "transfer",
      );
      setAllTransfers(transferTransactions);
    }
  }, [globalTransactions]);

  /**Select appropriate data grouping based on the number of days in filteredTransfers */
  useEffect(() => {
    const dailyGrouped = dailyGroupedData(dateRangeTxs);
    let selectedData: Record<string, ChartDataType> = {};
    const dataLength = Object.keys(dailyGrouped).length;
    if (dataLength > 365) {
      selectedData = weeklyGroupedData(dailyGrouped);
      setDateTicks(12);
    } else if (dataLength > 182) {
      selectedData = twoDaysGroupedData(dailyGrouped);
      setDateTicks(16);
    } else {
      selectedData = dailyGrouped;
      setDateTicks(30);
    }

    setDataToUse(selectedData);
  }, [dateRangeTxs]);

  useEffect(() => {
    const labels = Object.values(dataToUse).map(group => group.date);
    const data = Object.values(dataToUse).map(group => group.amount);
    const countData = Object.values(dataToUse).map(group => group.count);
    const uniqueReceivers = Object.values(dataToUse).map(group => group.uniqueReceivers);
    const uniqueSenders = Object.values(dataToUse).map(group => group.uniqueSenders);
    const uniqueTotal = Object.values(dataToUse).map(group => group.totalUniqueUsers);

    if (data && countData && labels) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Transfer Amount",
            data: data,
            yAxisID: "y1",
          },
          {
            label: "Transfer Count",
            data: countData,
            type: "line",
            yAxisID: "y2",
          },
          {
            label: "Unique Receivers",
            data: uniqueReceivers,
            type: "line",
            yAxisID: "y2",
            pointStyle: "triangle",
          },
          {
            label: "Unique Senders",
            data: uniqueSenders,
            type: "line",
            yAxisID: "y2",
            pointStyle: "cross",
          },
          {
            label: "Unique Total",
            data: uniqueTotal,
            type: "line",
            yAxisID: "y2",
            pointStyle: "rect",
          },
        ],
      });
    }

    const plugin = verticalLinePlugin(colors.lineColor as string);
    ChartJS.unregister(plugin);
    ChartJS.register(plugin);
  }, [colors, dataToUse]);

  useEffect(() => {
    if (chartData) {
      setOptions(chartOptions(chartData, colors, maxDateTicks, contractName));
    }
  }, [chartData, colors]);

  return (
    <div className="w-full justify-center items-center h-auto max-md:px-1 relative flex-grow pb-3">
      <div className="pt-4 px-8 h-auto">
        <h1 className="font-bold lg:text-4xl md:text-2xl text-xl card-title m-0 mb-4">
          {contractName.toUpperCase() + " Analytics"}
        </h1>
        {isLoggedIn && <DateFilterTransactions setDateRangeTxs={setDateRangeTxs} transactions={allTransfers} />}
      </div>
      {isLoggedIn ? (
        <div className="flex h-full md:min-h-[650px] md:max-h-[60vh] max-h-[400px]">
          {chartData && options ? (
            <Chart type="bar" data={chartData} options={options} />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-xl italic">
          Please connect your wallet for data request...
        </div>
      )}
    </div>
  );
};

export default TokenAnalytics;
