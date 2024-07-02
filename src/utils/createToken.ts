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
      console.log("Token set successfully:", result);
    } else {
      console.error("Error setting token:", result.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createToken:", error.message);
    }
  }
};
