import Papa from "papaparse";
import { formatEther } from "viem";
import { ExtendedTransaction } from "~~/types/utils";

export const downloadCSV = (data: ExtendedTransaction[], fileName: string) => {
  const parseReadyTx = data.map(tx => {
    const formattedValue = formatEther(tx.value);
    const formattedTime = new Date(Number(tx.timeStamp) * 1000).toLocaleString("eu-EU");
    return {
      tokenSymbol: tx.tokenSymbol,
      hash: tx.hash,
      date: formattedTime,
      method: tx.method,
      from: tx.from,
      to: tx.to,
      quantity: formattedValue,
    };
  });
  const csv = Papa.unparse(parseReadyTx);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
