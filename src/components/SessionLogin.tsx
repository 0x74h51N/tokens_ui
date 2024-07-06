import { useEffect } from "react";
import { useAccount } from "wagmi";

const SessionLogin = () => {
  const { address, isConnected } = useAccount();

  const handleLogin = async (address: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (response.ok) {
      console.log("Logged in");
    } else {
      console.log("Login failed");
    }
  };
  useEffect(() => {
    if (isConnected && address) {
      handleLogin(address);
    }
  }, [isConnected, address]);

  return null;
};

export default SessionLogin;
