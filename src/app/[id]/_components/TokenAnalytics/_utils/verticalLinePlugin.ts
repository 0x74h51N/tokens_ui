import { Chart, ChartOptions, ChartType } from "chart.js";
import { ChartData } from "./chartOptions";

const verticalLinePlugin = (color: string) => {
  return {
    id: "verticalLine",
    afterDraw: (chart: Chart<ChartType, ChartData, ChartOptions>) => {
      if (chart.tooltip?.getActiveElements().length) {
        const activeElement = chart.tooltip.getActiveElements()[0];
        const ctx = chart.ctx;
        const x = activeElement.element.x;
        const topY = chart.chartArea.top;
        const bottomY = chart.chartArea.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
      }
    },
  };
};

export default verticalLinePlugin;
