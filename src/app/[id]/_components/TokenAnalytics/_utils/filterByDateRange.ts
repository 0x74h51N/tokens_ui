import { ChartDataType } from "../TokenAnalytics";

export const filterByDateRange = (data: Record<string, ChartDataType>, startDate: Date, endDate: Date) => {
  const filteredData: Record<string, ChartDataType> = {};
  Object.entries(data).forEach(([date, value]) => {
    const currentDate = new Date(date);
    if (currentDate >= startDate && currentDate <= endDate) {
      filteredData[date] = value;
    }
  });
  return filteredData;
};
