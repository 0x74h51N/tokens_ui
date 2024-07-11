import { formatEther } from "viem";
import { ExtendedTransaction } from "~~/types/utils";
import { ChartDataType } from "./chartOptions";

export function dailyGroupedData(allTransfers: ExtendedTransaction[]): Record<string, ChartDataType> {
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
}

export function weeklyGroupedData(dataSet: Record<string, ChartDataType>): Record<string, ChartDataType> {
  return Object.entries(dataSet).reduce<Record<string, ChartDataType>>((acc, [date, { amount, count }]) => {
    const week = Math.floor(new Date(date).getTime() / (7 * 24 * 60 * 60 * 1000));

    if (!acc[week]) {
      acc[week] = { date: date, amount: 0, count: 0 };
    }
    acc[week].amount += amount;
    acc[week].count += count;

    return acc;
  }, {});
}

export function twoDaysGroupedData(dataSet: Record<string, ChartDataType>): Record<string, ChartDataType> {
  return Object.entries(dataSet).reduce<Record<string, ChartDataType>>((acc, [date, { amount, count }]) => {
    const biWeek = Math.floor(new Date(date).getTime() / (2 * 24 * 60 * 60 * 1000));

    if (!acc[biWeek]) {
      acc[biWeek] = { date: date, amount: 0, count: 0 };
    }
    acc[biWeek].amount += amount;
    acc[biWeek].count += count;

    return acc;
  }, {});
}
