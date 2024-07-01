export async function getBscTransactions(contractAddress: string, testnet: string) {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const offset = 250;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 29 },
    });
    const data = await response.json();
    if (data.status === "1") {
      return data.result;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("Error fetching data: " + error);
  }
}
