import { formatVariableName } from "./formatVariableName";

const getEmojiForName = (name: string) => {
  switch (name) {
    case "mint":
      return "💵";
    case "burn":
    case "burnFrom":
      return "🔥";
    case "transfer":
    case "transferFrom":
      return "💸";
    case "setFeeWalletAddress":
      return "🏦";
    default:
      return "";
  }
};

export const getCoolDisplayName = (name: string) => {
  const emoji = getEmojiForName(name);
  const displayName = formatVariableName(name);
  return `${emoji} ${displayName}`;
};
