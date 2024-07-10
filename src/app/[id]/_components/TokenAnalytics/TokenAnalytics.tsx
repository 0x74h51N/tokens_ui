import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { formatEther } from "viem";
import { useGlobalState } from "~~/services/store/store";
import getMethodName from "~~/utils/getMethodName";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import chartOptions, { ChartData } from "./_utils/chartOptions";
import verticalLinePlugin from "./_utils/verticalLinePlugin";
import { useTheme } from "next-themes";
import { color, Colors, getThemeColors, initialColors } from "./_utils/colors";
import "chartjs-adapter-date-fns";
import { ExtendedTransaction } from "~~/types/utils";
import TokenAnalyticsHead from "./TokenAnalyticsHead";
ChartJS.register(...registerables);

export type ChartDataType = {
  date: string;
  amount: number;
  count: number;
};

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
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [colors, setColors] = useState<Colors>(initialColors);
  const globalTransactions = useGlobalState(state => state.transactions[deployedContractData.address]);
  const [options, setOptions] = useState<ChartOptions | null>(null);
  const [allTransfers, setAllTransfers] = useState<ExtendedTransaction[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Record<string, ChartDataType>>({});
  const [dataToUse, setDataToUse] = useState<Record<string, ChartDataType>>({});
  const [maxDateTicks, setDateTicks] = useState<number>(10);
  useEffect(() => {
    if (resolvedTheme) {
      setColors(getThemeColors(resolvedTheme));
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (globalTransactions && globalTransactions.length > 0) {
      const transferTransactions = globalTransactions.filter(
        tx => getMethodName(tx.from, tx.to).toLocaleLowerCase() === "transfer",
      );
      setAllTransfers(transferTransactions);
    }
  }, [globalTransactions]);

  const dailyTransferStats = useMemo(() => {
    return allTransfers.reduce<Record<string, ChartDataType>>((acc, tx) => {
      const date = new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString().split("T")[0];
      const amount = parseFloat(formatEther(tx.value));
      if (!acc[date]) {
        acc[date] = { date: date, amount: 0, count: 0 };
      }
      acc[date].amount += amount;
      acc[date].count += 1;
      return acc;
    }, {});
  }, [allTransfers]);
  useEffect(() => setFilteredTransfers(dailyTransferStats), [dailyTransferStats]);
  const groupedData = useMemo(() => {
    return Object.entries(filteredTransfers).reduce<Record<string, ChartDataType>>((acc, [date, { amount, count }]) => {
      const week = Math.floor(new Date(date).getTime() / (7 * 24 * 60 * 60 * 1000));

      if (!acc[week]) {
        acc[week] = { date: date, amount: 0, count: 0 };
      }
      acc[week].amount += amount;
      acc[week].count += count;

      return acc;
    }, {});
  }, [filteredTransfers]);

  const groupByTwoDays = (data: ChartDataType[]) => {
    const result: Record<string, ChartDataType> = {};
    data.forEach(({ date, amount, count }, index) => {
      const groupIndex = Math.floor(index / 2).toString();
      if (!result[groupIndex]) {
        result[groupIndex] = { date, amount: 0, count: 0 };
      }
      result[groupIndex].amount += amount;
      result[groupIndex].count += count;
    });
    return result;
  };

  useEffect(() => {
    let selectedData: Record<string, ChartDataType> = {};
    const dataLength = Object.keys(filteredTransfers).length;

    if (dataLength > 365) {
      selectedData = groupedData;
      setDateTicks(12);
    } else if (dataLength > 182) {
      selectedData = groupByTwoDays(Object.values(filteredTransfers));
      setDateTicks(16);
    } else {
      selectedData = filteredTransfers;
      setDateTicks(30);
    }
    setDataToUse(selectedData);
  }, [filteredTransfers, groupedData]);

  useEffect(() => {
    const labels = Object.values(dataToUse).map(group => group.date);
    const data = Object.values(dataToUse).map(group => group.amount);
    const countData = Object.values(dataToUse).map(group => group.count);

    if (data && countData && labels) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Transfer Amount",
            data,
            backgroundColor: (colors.amountBar as color).backgroundColor,
            borderColor: (colors.amountBar as color).borderColor,
            yAxisID: "y1",
          },
          {
            label: "Transfer Count",
            data: countData,
            backgroundColor: (colors.countLine as color).backgroundColor,
            borderColor: (colors.countLine as color).borderColor,
            type: "line",
            yAxisID: "y2",
          },
        ],
      });
    }
    if (chartData) {
      setOptions(chartOptions(chartData, colors, maxDateTicks));
    }

    const plugin = verticalLinePlugin(colors.lineColor as string);
    ChartJS.unregister(plugin);
    ChartJS.register(plugin);
  }, [colors, dataToUse]);

  return (
    <div className="w-full justify-center items-center h-auto max-md:px-2 relative flex-grow pb-3">
      <TokenAnalyticsHead
        contractName={contractName}
        setFilteredTransfers={setFilteredTransfers}
        transfers={dailyTransferStats}
      />
      {isLoggedIn ? (
        <div className="flex h-full min-h-[650px]  max-h-[60vh]">
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
