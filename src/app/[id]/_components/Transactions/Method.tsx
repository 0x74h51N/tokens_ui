interface MethodProps {
  from: `0x${string}` | null;
  to: `0x${string}` | null;
}

const PANCAKE_SWAP_ADDRESSES = ["0x67D8fdFba16Cc3300d34148217f25c50BDF31083"];

const Method: React.FC<MethodProps> = ({ from, to }) => {
  const getMethodName = (from: `0x${string}` | null, to: `0x${string}` | null): string => {
    if (from === "0x0000000000000000000000000000000000000000" || !from) {
      return "Mint";
    } else if (to === "0x0000000000000000000000000000000000000000" || !to) {
      return "Burn";
    } else if (PANCAKE_SWAP_ADDRESSES.includes(from) || PANCAKE_SWAP_ADDRESSES.includes(to)) {
      return "PnckSwap";
    } else {
      return "Transfer";
    }
  };

  const methodName = getMethodName(from, to);

  return <span>{methodName}</span>;
};

export default Method;
