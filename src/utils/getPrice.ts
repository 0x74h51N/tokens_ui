"use server";
const tokenNameToIdMap: Record<string, string> = {
  nnntoken: "novem-gold",
  nvmtoken: "novem-pro",
  npttoken: "novem-silver",
  nxagtoken: "novem-platinum",
};

export interface CoinData {
  name: string;
  symbol: string;
  price: number;
  total_supply: number;
}
export const getPrice = async (name: string, currency: string): Promise<CoinData | null> => {
  const tokenId = tokenNameToIdMap[name.toLowerCase()] || name.toLowerCase();
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`, {
      cache: "force-cache",
      next: { revalidate: 60 },
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
