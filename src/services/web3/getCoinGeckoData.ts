"use server";

import scaffoldConfig from "~~/scaffold.config";

export interface CoinData {
  name: string;
  symbol: string;
  price: number;
  total_supply: number;
}
/**
 * Fetches data for a specific coin or token from the CoinGecko API.
 *
 * @param name - The name of the coin/token. It should match the keys in the scaffold config's `tokenNameToIdMap` object.
 * @param currency - The currency in which the coin/token price should be returned.
 * @returns A `CoinData` object containing the coin/token's name, symbol, current price, and total supply, or `null` if the data couldn't be fetched.
 */
export const getCoinGeckoData = async (name: string, currency: string): Promise<CoinData | null> => {
  const tokenName = name.toLowerCase();
  const tokenId =
    tokenName in scaffoldConfig.tokenNameToIdMap
      ? scaffoldConfig.tokenNameToIdMap[tokenName as keyof typeof scaffoldConfig.tokenNameToIdMap]
      : tokenName;
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`, {
      next: { revalidate: 29 },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const filteredData: CoinData = await {
      name: data.name,
      symbol: data.symbol,
      price: data.market_data.current_price[currency],
      total_supply: data.market_data.total_supply,
    };
    return filteredData;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
