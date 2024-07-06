import { isAddress } from "viem";

const PANCAKE_SWAP_ADDRESSES = ["0x67D8fdFba16Cc3300d34148217f25c50BDF31083"];

const getMethodName = (from: string | null, to: string | null): string => {
  if (from === "0x0000000000000000000000000000000000000000" || !from) {
    return "Mint";
  } else if (to === "0x0000000000000000000000000000000000000000" || !to) {
    return "Burn";
  } else if (isAddress(from) && isAddress(to)) {
    if (PANCAKE_SWAP_ADDRESSES.includes(from) || PANCAKE_SWAP_ADDRESSES.includes(to)) {
      return "PnckSwap";
    } else {
      return "Transfer";
    }
  } else {
    return "Unknown";
  }
};

export default getMethodName;
