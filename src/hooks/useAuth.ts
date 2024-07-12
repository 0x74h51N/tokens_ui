import { Address } from "viem";
import { useGlobalState } from "~~/services/store/store";

export const useAuth = () => {
  const setSessionStart = useGlobalState(state => state.setSessionStart);

  const handleLogin = async (address: Address) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (response.ok) {
      console.log("Logged in");
      setSessionStart(true);
    } else {
      console.log("Login failed");
      setSessionStart(false);
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

  return { handleLogin, handleLogout };
};
