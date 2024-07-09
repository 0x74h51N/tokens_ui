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
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [colors, setColors] = useState<Colors>(initialColors);
  const allTransactions = useGlobalState(state => state.transactions[deployedContractData.address]);
  const [options, setOptions] = useState<ChartOptions | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setColors(getThemeColors(resolvedTheme));
      console.log(resolvedTheme);
    }
  }, [resolvedTheme]);

  const dailyTransferStats = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) return {};

    const transferTransactions = allTransactions.filter(
      tx => getMethodName(tx.from, tx.to).toLocaleLowerCase() === "transfer",
    );

    return transferTransactions.reduce<Record<string, { amount: number; count: number }>>((acc, tx) => {
      const date = new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString().split("T")[0];
      const amount = parseFloat(formatEther(tx.value));

      if (!acc[date]) {
        acc[date] = { amount: 0, count: 0 };
      }
      acc[date].amount += amount;
      acc[date].count += 1;

      return acc;
    }, {});
  }, [allTransactions]);

  const groupedData = useMemo(() => {
    return Object.entries(dailyTransferStats).reduce<
      Record<number, { startDate: string; totalAmount: number; totalCount: number }>
    >((acc, [date, { amount, count }]) => {
      const week = Math.floor(new Date(date).getTime() / (7 * 24 * 60 * 60 * 1000));

      if (!acc[week]) {
        acc[week] = { startDate: date, totalAmount: 0, totalCount: 0 };
      }
      acc[week].totalAmount += amount;
      acc[week].totalCount += count;

      return acc;
    }, {});
  }, [dailyTransferStats]);

  useEffect(() => {
    const labels = Object.values(groupedData).map(group => group.startDate);
    const data = Object.values(groupedData).map(group => group.totalAmount);
    const countData = Object.values(groupedData).map(group => group.totalCount);

    if (data && countData && labels) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Transfer Amount",
            data,
            backgroundColor: (colors.amountBar as color).backgroundColor,
            borderColor: (colors.amountBar as color).borderColor,
            borderWidth: 1,
            yAxisID: "y1",
          },
          {
            label: "Transfer Count",
            data: countData,
            backgroundColor: (colors.countLine as color).backgroundColor,
            borderColor: (colors.countLine as color).borderColor,
            borderWidth: 1,
            type: "line",
            yAxisID: "y2",
          },
        ],
      });
    }
    if (chartData) {
      setOptions(chartOptions(chartData, colors));
    }

    const plugin = verticalLinePlugin(colors.lineColor as string);
    ChartJS.unregister(plugin);
    ChartJS.register(plugin);
  }, [colors, groupedData]);

  return (
    <div className="w-full justify-center items-center max-h-[62vh] min-h-[650px] max-md:px-2 relative flex-grow">
      <h1 className="font-bold lg:text-4xl md:text-2xl text-xl card-title pl-5 pt-3 m-0">
        {contractName.toUpperCase() + " Analytics"}
      </h1>
      {isLoggedIn ? (
        <>
          {chartData && options ? (
            <Chart type="bar" data={chartData} options={options} />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-xl italic">
          Please connect your wallet for data request...
        </div>
      )}
    </div>
  );
};

export default TokenAnalytics;
