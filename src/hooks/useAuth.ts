import { useGlobalState } from "~~/services/store/store";
import { useSignMessage } from "wagmi";
import { useState } from "react";
import { loginAction, logoutAction, validateSessionAction } from "~~/actions";

export const useAuth = () => {
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const validateSession = async () => {
    try {
      const response = await validateSessionAction();
      if (response.isValid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating session:", error);
      return false;
    }
  };
  const handleLogin = async (address: string) => {
    if (isSigning) return;

    setIsSigning(true);
    const message = `Please sign to connection of Novem Gold Tokens Interface with, ${address}`;
    try {
      const signature = await signMessageAsync({ message });
      if (signature) {
        const login = await loginAction(address, signature, message);

        if (login?.error) {
          console.log("Login failed: ", login.error);
          setSessionStart(false);
          return { isLogin: false };
        } else {
          console.log("Logged in");
          return { isLogin: true };
        }
      } else return { isLogin: false };
    } catch (error) {
      console.error("Error signing message:", error);
    } finally {
      setIsSigning(false);
    }
  };

  const handleLogout = async () => {
    const response = await logoutAction();
    if (response?.success) {
      console.log("Logout successful");
      setSessionStart(false);
    } else {
      console.log("Logout failed");
    }
  };

  return { handleLogin, handleLogout, validateSession };
};
