export type color = { backgroundColor: string; borderColor: string };

export interface Colors {
  [type: string]: color | string;
}
const gridLight = "rgba(0, 0, 0, 0.2)";
const gridDark = "rgba(255, 255, 255, 0.2)";
const ticksLight = "gray";
const ticksDark = "#f7fafc";
export const initialColors: Colors = {
  countLine: { backgroundColor: "rgba(88, 134, 209, 0.2)", borderColor: "rgba(88, 134, 209, 1)" },
  amountBar: { backgroundColor: "rgba(35, 194, 194, 0.2)", borderColor: "rgba(35, 194, 194, 1)" },
  yTicks: ticksLight,
  xTicks: ticksLight,
  yGrid: gridLight,
  xGrid: gridLight,
  lineColor: ticksLight,
};

export const getThemeColors = (resolvedTheme: string): Colors => {
  if (resolvedTheme === "dark") {
    return {
      countLine: { backgroundColor: "rgba(147, 187, 251, 0.2)", borderColor: "rgba(147, 187, 251, 1)" },
      amountBar: { backgroundColor: "rgba(128, 253, 255, 0.2)", borderColor: "rgba(128, 253, 255, 1)" },
      yTicks: ticksDark,
      xTicks: ticksDark,
      yGrid: gridDark,
      xGrid: gridDark,
      lineColor: "rgba(255, 255, 255, 0.5)",
    };
  } else {
    return initialColors;
  }
};
