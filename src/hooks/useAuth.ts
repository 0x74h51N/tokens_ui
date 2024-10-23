import { useGlobalState } from "~~/services/store/store";
import { useSignMessage } from "wagmi";
import { useState } from "react";
import { loginAction, logoutAction, validateSessionAction } from "~~/actions";

export const useAuth = () => {
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  /**
   * Validates the current session by making an API call to check if the session is still valid.
   * @returns {Promise<boolean>} - Returns true if the session is valid, otherwise false.
   */
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

  /**
   * Handles the login process by signing a message with the user's wallet and verifying the signature.
   * If the signature is valid, the session is established.
   * @param {string} address - The wallet address of the user.
   * @returns {Promise<{ isLogin: boolean } | undefined>} - Returns an object indicating if the login was successful.
   */
  const handleLogin = async (address: string): Promise<{ isLogin: boolean } | undefined> => {
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
      return { isLogin: false };
    } finally {
      setIsSigning(false);
    }
  };

  /**
   * Handles the logout process by destroying the session.
   * After the session is destroyed, the global session state is updated to reflect that the user is logged out.
   */
  const handleLogout = async () => {
    setSessionStart(false);
    await logoutAction();
  };

  return { handleLogin, handleLogout, validateSession };
};
