export type color = { backgroundColor: string; borderColor: string };

export interface Colors {
  [type: string]: color | string;
}
const gridLight = "rgba(0, 0, 0, 0.2)";
const gridDark = "rgba(255, 255, 255, 0.2)";
const ticksLight = "gray";
const ticksDark = "#f7fafc";
export const initialColors: Colors = {
  transferCount: { backgroundColor: "rgba(88, 134, 209, 0.2)", borderColor: "rgba(88, 134, 209, 1)" },
  transferAmount: { backgroundColor: "rgba(35, 194, 194, 0.2)", borderColor: "rgba(35, 194, 194, 1)" },
  uniqueReceivers: { backgroundColor: "rgba(40, 186, 0, 0.2)", borderColor: "rgba(40, 186, 0, 1)" },
  uniqueSenders: { backgroundColor: "rgba(93, 0, 186, 0.2)", borderColor: "rgba(93, 0, 186, 1)" },
  uniqueTotal: { backgroundColor: "rgba(196, 88, 0, 0.2)", borderColor: "rgba(196, 88, 0, 1)" },

  yTicks: ticksLight,
  xTicks: ticksLight,
  yGrid: gridLight,
  xGrid: gridLight,
  lineColor: ticksLight,
};

export const getThemeColors = (resolvedTheme: string): Colors => {
  if (resolvedTheme === "dark") {
    return {
      transferCount: { backgroundColor: "rgba(147, 187, 251, 0.2)", borderColor: "rgba(147, 187, 251, 1)" },
      transferAmount: { backgroundColor: "rgba(128, 253, 255, 0.2)", borderColor: "rgba(128, 253, 255, 1)" },
      uniqueReceivers: { backgroundColor: "rgba(118, 250, 82, 0.2)", borderColor: "rgba(118, 250, 82, 1)" },
      uniqueSenders: { backgroundColor: "rgba(177, 99, 255, 0.2)", borderColor: "rgba(177, 99, 255, 1)" },
      uniqueTotal: { backgroundColor: "rgba(255, 152, 69, 0.2)", borderColor: "rgba(255, 152, 69, 1)" },
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
