import Papa from "papaparse";
import { useRef } from "react";
import { formatEther } from "viem";
import { useGlobalState } from "~~/services/store/store";
import { ExtendedTransaction } from "~~/types/utils";

const DownloadCSVButton = ({ data, fileName }: { data: ExtendedTransaction[]; fileName: string }) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { tags } = useGlobalState(state => ({
    tags: state.tags,
  }));

  const downloadCSV = () => {
    const parseReadyTx = data.map(tx => {
      const formattedValue = formatEther(tx.value);
      const formattedTime = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");
      return {
        token_symbol: tx.tokenSymbol,
        transaction_hash: tx.hash,
        date: formattedTime,
        method: tx.method,
        sender_tag: tags.get(tx.from.toLowerCase()),
        sender_address: tx.from,
        receiver_tag: tags.get((tx.to as string).toLowerCase()),
        receiver_address: tx.to,
        quantity: formattedValue,
      };
    });
    const csv = Papa.unparse(parseReadyTx);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.download = `${fileName}.csv`;
      linkRef.current.click();
    }

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button className="btn btn-primary btn-xs h-full rounded-md text-xs px-2 ml-2" onClick={downloadCSV}>
        Download CSV
      </button>
      <a ref={linkRef} style={{ display: "none" }}></a>
    </div>
  );
};

export default DownloadCSVButton;
