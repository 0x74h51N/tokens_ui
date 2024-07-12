import { ChartOptions } from "chart.js";
import { Colors } from "./colors";

const chartOptions = (chartData: ChartData, colors: Colors, maxDateTicks: number): ChartOptions => {
  return {
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: false,
        type: "time",
        ticks: {
          color: colors.xTicks as string,
          autoSkip: true,
          maxTicksLimit: maxDateTicks,
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          color: colors.xGrid as string,
        },
      },
      y1: {
        type: "linear",
        display: "auto",
        position: "left",
        title: {
          display: true,
          text: `Amount (NNN, thousand)`,
        },
        ticks: {
          color: colors.yTicks as string,
          callback: function (value) {
            const numericValue = typeof value === "string" ? parseFloat(value) : value;
            return (numericValue / 1000).toLocaleString();
          },
          font: {
            size: 12,
          },
        },
        grid: {
          color: colors.yGrid as string,
        },
      },
      y2: {
        type: "linear",
        suggestedMax: 100,
        display: "auto",
        position: "right",
        title: {
          display: true,
          text: "Transfer Count",
        },
        ticks: {
          color: colors.yTicks as string,
          callback: function (value) {
            return value.toLocaleString();
          },
          font: {
            size: 12,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        axis: "x",
        intersect: false,
        yAlign: "center",
        callbacks: {
          title: function (tooltipItems) {
            if (tooltipItems.length) {
              const dateLabel = tooltipItems[0].label;
              return dateLabel.split(",")[0] + dateLabel.split(",")[1];
            }
            return "";
          },
          label: function (tooltipItem) {
            const datasetIndex = tooltipItem.datasetIndex;
            const label = tooltipItem.dataset.label || "";
            const value = chartData.datasets[datasetIndex].data[tooltipItem.dataIndex] as number;
            return `${label}: ${value !== undefined && value !== null ? value.toLocaleString() : ""}`;
          },
        },
      },
    },
    datasets: {
      bar: {
        barThickness: "flex",
        borderWidth: 1,
      },
      line: {
        borderWidth: 1,
      },
    },
  };
};

export default chartOptions;

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    type?: "line" | "bar";
    yAxisID?: string;
  }[];
}

export type ChartDataType = {
  date: string;
  amount: number;
  count: number;
};
