import { ChartOptions, LegendItem, LegendElement, TooltipItem, ChartEvent } from "chart.js";
import { Colors, color } from "./colors";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

const chartOptions = (
  chartData: ChartData,
  colors: Colors,
  maxDateTicks: number,
  contractName: ContractName,
): ChartOptions => {
  const datasetsWithColors = chartData.datasets.map(dataset => {
    const colorKey = dataset.label.charAt(0).toLowerCase() + dataset.label.slice(1).replace(/\s+/g, "");
    const color = colors[colorKey as keyof Colors] as color;

    if (color) {
      return {
        ...dataset,
        backgroundColor: color.backgroundColor,
        borderColor: color.borderColor,
      };
    } else {
      console.warn(`Color not found for key: ${colorKey}`);
      return dataset;
    }
  });

  chartData.datasets = datasetsWithColors;

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
          text: `Amount (${contractName.toUpperCase()}, thousand)`,
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
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
        onHover: !isTouchDevice()
          ? (event: ChartEvent, legendItem: LegendItem, legend: LegendElement<"line" | "bar">) => {
              const chart = legend.chart;
              const index = legendItem.datasetIndex || 0;
              if (chart.isDatasetVisible(index)) {
                chart.data.datasets.forEach((dataset, i: number) => {
                  if (i !== index) {
                    dataset.borderColor = "rgba(200, 200, 200, 0.2)";
                    dataset.backgroundColor = "rgba(200, 200, 200, 0.2)";
                  }
                });
                chart.update();
              }
            }
          : undefined,
        onLeave: !isTouchDevice()
          ? (event: ChartEvent, legendItem: LegendItem, legend: LegendElement<"line" | "bar">) => {
              const chart = legend.chart;
              chart.data.datasets.forEach(dataset => {
                if (dataset.label) {
                  const colorKey = dataset.label.charAt(0).toLowerCase() + dataset.label.slice(1).replace(/\s+/g, "");
                  const color = colors[colorKey as keyof Colors] as color;

                  if (color) {
                    dataset.borderColor = color.borderColor;
                    dataset.backgroundColor = color.backgroundColor;
                  }
                }
              });
              chart.update();
            }
          : undefined,
        onClick: !isTouchDevice()
          ? (event: ChartEvent, legendItem: LegendItem, legend: LegendElement<"line" | "bar">) => {
              const chart = legend.chart;
              const index = legendItem.datasetIndex || 0;

              if (chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                  if (dataset.label) {
                    const colorKey = dataset.label.charAt(0).toLowerCase() + dataset.label.slice(1).replace(/\s+/g, "");
                    const color = colors[colorKey as keyof Colors] as color;

                    if (color) {
                      dataset.borderColor = color.borderColor;
                      dataset.backgroundColor = color.backgroundColor;
                    }
                  }
                });
              }

              chart.update();
              if (chart.isDatasetVisible(index)) {
                chart.hide(index);
              } else {
                chart.show(index);
              }
            }
          : undefined,
      },
      tooltip: {
        mode: "index",
        axis: "x",
        intersect: false,
        yAlign: "center",
        callbacks: {
          title: function (tooltipItems: TooltipItem<"line" | "bar">[]) {
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
        maxBarThickness: 20,
        barThickness: "flex",
        borderWidth: 1,
      },
      line: {
        borderWidth: 2,
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
    backgroundColor?: string;
    borderColor?: string;
    type?: "line" | "bar";
    yAxisID?: string;
    pointStyle?: string;
  }[];
}

export type ChartDataType = {
  date: string;
  amount: number;
  count: number;
  uniqueReceivers: number;
  uniqueSenders: number;
  totalUniqueUsers: number;
};
