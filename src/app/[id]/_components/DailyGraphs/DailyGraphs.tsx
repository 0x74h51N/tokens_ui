import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { formatEther } from "viem";
import { useGlobalState } from "~~/services/store/store";
import getMethodName from "~~/utils/getMethodName";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const DailyGraphs = ({
  deployedContractData,
  contractName,
}: {
  deployedContractData: Contract<ContractName>;
  contractName: ContractName;
}) => {
  const sessionStart = useGlobalState(state => state.sessionStart);
  const isLoggedIn = sessionStart || false;

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const allTransactions = useGlobalState(state => state.transactions[deployedContractData.address]);

  useEffect(() => {
    if (allTransactions && allTransactions.length > 0) {
      console.log("All Transactions:", allTransactions);

      const transferTransactions = allTransactions.filter(
        tx => getMethodName(tx.from, tx.to).toLocaleLowerCase() === "transfer",
      );
      console.log("Transfer Transactions:", transferTransactions);

      const dailyTransferAmounts = transferTransactions.reduce<Record<string, number>>((acc, tx) => {
        const date = new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString().split("T")[0];
        const amount = parseFloat(formatEther(tx.value));

        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += amount;

        return acc;
      }, {});

      console.log("Daily Transfer Amounts:", dailyTransferAmounts);

      const groupedData = Object.entries(dailyTransferAmounts).reduce<
        Record<number, { startDate: string; totalAmount: number }>
      >((acc, [date, amount]) => {
        const week = Math.floor(new Date(date).getTime() / (7 * 24 * 60 * 60 * 1000));

        if (!acc[week]) {
          acc[week] = { startDate: date, totalAmount: 0 };
        }
        acc[week].totalAmount += amount;

        return acc;
      }, {});

      console.log("Grouped Data:", groupedData);

      const labels = Object.values(groupedData).map(group => group.startDate);
      const data = Object.values(groupedData).map(group => group.totalAmount);

      console.log("Labels:", labels);
      console.log("Data:", data);

      setChartData({
        labels,
        datasets: [
          {
            label: "Transfer Amount",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [allTransactions]);
  return (
    <div className=" w-full justify-center items-center h-full max-h-[65svh]">
      {isLoggedIn ? (
        chartData && (
          <div className="w-full h-full">
            <Bar
              data={chartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: "category",
                    title: {
                      display: true,
                      text: "Date",
                    },
                    ticks: {
                      callback: function (_value, index, _values) {
                        const date = new Date(chartData.labels[index]);
                        const month = date.toLocaleString("default", { month: "short" });
                        const year = date.getFullYear();
                        return `${month} ${year}`;
                      },
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: `Amount (${contractName.toUpperCase()})`,
                    },
                    ticks: {
                      callback: function (value) {
                        return value.toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )
      ) : (
        <div className="h-full flex items-center justify-center text-xl italic">
          Please connect your wallet for data request...
        </div>
      )}
    </div>
  );
};

export default DailyGraphs;
