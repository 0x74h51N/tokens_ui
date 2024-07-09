import { ChartOptions } from "chart.js";
import { Colors } from "./colors";

const chartOptions = (chartData: ChartData, colors: Colors): ChartOptions => ({
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Date",
      },
      ticks: {
        color: colors.xTicks as string,
      },
      grid: {
        color: colors.xGrid as string,
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: `Amount (NNN)`,
      },
      ticks: {
        color: colors.yTicks as string,
        callback: function (value) {
          return value.toLocaleString();
        },
      },
      grid: {
        color: colors.yGrid as string,
      },
    },
    y2: {
      type: "linear",
      display: true,
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
      position: "nearest",
      yAlign: "center",
      callbacks: {
        label: function (tooltipItem) {
          const datasetIndex = tooltipItem.datasetIndex;
          const label = tooltipItem.dataset.label || "";
          const value = chartData.datasets[datasetIndex].data[tooltipItem.dataIndex] as number;
          return `${label}: ${value !== undefined && value !== null ? value.toLocaleString() : ""}`;
        },
      },
    },
  },
});

export default chartOptions;

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    type?: "line" | "bar";
    yAxisID?: string;
  }[];
}
