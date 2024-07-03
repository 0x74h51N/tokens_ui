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
    return data as TokenResponse;
  } else {
    console.error("Error fetching protected data:", data.message);
    return null;
  }
};

export const createToken = async (data: string[], contractAddress: `0x${string}`) => {
  try {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, contractAddress }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(result.message);
    } else {
      console.error("Error setting token:", result.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createToken:", error.message);
    }
  }
};
