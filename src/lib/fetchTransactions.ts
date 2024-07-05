import { ExtendedTransaction } from "~~/services/web3/getBscTransactions";

export const fetchTransactions = async (
  address: string,
  testnet: boolean,
  all: boolean,
): Promise<ExtendedTransaction[]> => {
  const url = `/api/fetch-transactions?contractaddress=${address}&testnet=${testnet}&all=${all}`;
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error);
  }
};
