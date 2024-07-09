import { ChartOptions } from "chart.js";
import { Colors } from "./colors";

const getUnitForDateRange = (dateRange: number) => {
  if (dateRange > 2 * 365 * 24 * 60 * 60 * 1000) {
    return "quarter";
  } else if (dateRange > 365 * 24 * 60 * 60 * 1000) {
    return "month";
  } else if (dateRange > 6 * 30 * 24 * 60 * 60 * 1000) {
    return "month";
  } else if (dateRange > 3 * 30 * 24 * 60 * 60 * 1000) {
    return "day";
  } else if (dateRange > 30 * 24 * 60 * 60 * 1000) {
    return "week";
  } else {
    return "day";
  }
};

const chartOptions = (chartData: ChartData, colors: Colors): ChartOptions => {
  const labels = chartData.labels.map(label => new Date(label).getTime());
  const dateRange = Math.max(...labels) - Math.min(...labels);
  const unit = getUnitForDateRange(dateRange);

  return {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: unit,
          displayFormats: {
            quarter: "MMM yyyy",
            month: "MMM yyyy",
            week: "MMM d",
            day: "MMM d",
          },
        },
        ticks: {
          color: colors.xTicks as string,
          autoSkip: true,
          maxTicksLimit: unit === "day" ? 30 : 12,
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          color: colors.xGrid as string,
        },
        offset: false,
        bounds: "data",
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
    borderWidth: number;
    type?: "line" | "bar";
    yAxisID?: string;
  }[];
}
