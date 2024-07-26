import { useGlobalState } from "~~/services/store/store";
import { useSignMessage } from "wagmi";

export const useAuth = () => {
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { signMessageAsync } = useSignMessage();

  const validateSession = async () => {
    try {
      const response = await fetch("/api/validate-session");
      if (response.ok) {
        const data = await response.json();
        return data.isValid;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating session:", error);
      return false;
    }
  };

  const handleLogin = async (address: string) => {
    const message = `Please sign this message for a secure connection (no gas fee) with your wallet address: ${address}`;
    try {
      const signature = await signMessageAsync({ message });

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature }),
      });

      if (response.ok) {
        console.log("Logged in");
        setSessionStart(true);
      } else {
        console.log("Login failed");
        setSessionStart(false);
      }
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      console.log("Logout");
      setSessionStart(false);
    } else {
      console.log("Logout failed");
    }
  };

  return { handleLogin, handleLogout, validateSession };
};
