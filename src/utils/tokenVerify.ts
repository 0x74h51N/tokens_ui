export interface TokenResponse {
  data: { data: string[] };
  iat: number;
  exp: number;
}

export const tokenVerify = async (contractAddress: `0x${string}`): Promise<TokenResponse | null> => {
  const response = await fetch(`/api/token?contractAddress=${contractAddress}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (response.ok) {
    console.log("Protected data:", data);
    return data as TokenResponse;
  } else {
    console.error("Error fetching protected data:", data.message);
    return null;
  }
};
