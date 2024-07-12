import { Address, formatEther } from "viem";
import { ExtendedTransaction } from "~~/types/utils";
import { ChartDataType } from "./chartOptions";

type ExtendedChartDataType = ChartDataType & {
  receiversSet: Set<string>;
  sendersSet: Set<string>;
};

export function dailyGroupedData(allTransfers: ExtendedTransaction[]): Record<string, ExtendedChartDataType> {
  return allTransfers.reduce<Record<string, ExtendedChartDataType>>((acc, tx) => {
    const date = new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString().split("T")[0];
    const amount = parseFloat(formatEther(tx.value));

    if (!acc[date]) {
      acc[date] = {
        date: date,
        amount: 0,
        count: 0,
        uniqueReceivers: 0,
        uniqueSenders: 0,
        totalUniqueUsers: 0,
        receiversSet: new Set<Address>(),
        sendersSet: new Set<Address>(),
      };
    }
    acc[date].amount += amount;
    acc[date].count += 1;
    acc[date].receiversSet.add(tx.to as Address);
    acc[date].sendersSet.add(tx.from);
    acc[date].uniqueReceivers = acc[date].receiversSet.size;
    acc[date].uniqueSenders = acc[date].sendersSet.size;
    acc[date].totalUniqueUsers = new Set([...acc[date].receiversSet, ...acc[date].sendersSet]).size;
    return acc;
  }, {});
}

export function weeklyGroupedData(dataSet: Record<string, ChartDataType>): Record<string, ChartDataType> {
  return Object.entries(dataSet).reduce<Record<string, ChartDataType>>(
    (acc, [date, { amount, count, uniqueReceivers, uniqueSenders, totalUniqueUsers }]) => {
      const week = Math.floor(new Date(date).getTime() / (7 * 24 * 60 * 60 * 1000)).toString();

      if (!acc[week]) {
        acc[week] = {
          date: date,
          amount: 0,
          count: 0,
          uniqueReceivers: 0,
          uniqueSenders: 0,
          totalUniqueUsers: 0,
        };
      }
      acc[week].amount += amount;
      acc[week].count += count;
      acc[week].uniqueReceivers += uniqueReceivers;
      acc[week].uniqueSenders += uniqueSenders;
      acc[week].totalUniqueUsers += totalUniqueUsers;
      return acc;
    },
    {},
  );
}

export function twoDaysGroupedData(dataSet: Record<string, ChartDataType>): Record<string, ChartDataType> {
  return Object.entries(dataSet).reduce<Record<string, ChartDataType>>(
    (acc, [date, { amount, count, uniqueReceivers, uniqueSenders, totalUniqueUsers }]) => {
      const twoDays = Math.floor(new Date(date).getTime() / (2 * 24 * 60 * 60 * 1000)).toString();

      if (!acc[twoDays]) {
        acc[twoDays] = {
          date: date,
          amount: 0,
          count: 0,
          uniqueReceivers: 0,
          uniqueSenders: 0,
          totalUniqueUsers: 0,
        };
      }
      acc[twoDays].amount += amount;
      acc[twoDays].count += count;
      acc[twoDays].uniqueReceivers += uniqueReceivers;
      acc[twoDays].uniqueSenders += uniqueSenders;
      acc[twoDays].totalUniqueUsers += totalUniqueUsers;
      return acc;
    },
    {},
  );
}
