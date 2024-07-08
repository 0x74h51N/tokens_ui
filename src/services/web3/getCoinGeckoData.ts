"use server";
const tokenNameToIdMap: Record<string, string> = {
  nnn: "novem-gold",
  nvm: "novem-pro",
  npt: "novem-silver",
  nxag: "novem-platinum",
};

export interface CoinData {
  name: string;
  symbol: string;
  price: number;
  total_supply: number;
}
export const getCoinGeckoData = async (name: string, currency: string): Promise<CoinData | null> => {
  const tokenId = tokenNameToIdMap[name.toLowerCase()] || name.toLowerCase();
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
