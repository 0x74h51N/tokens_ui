"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useGlobalState } from "~~/services/store/store";
import { useAuth } from "~~/hooks/useAuth";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Login = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const setSessionStart = useGlobalState(state => state.setSessionStart);
  const { handleLogin, validateSession } = useAuth();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (validate) {
          setSessionStart(true);
          router.push("/");
        } else if (isConnected && address) {
          await handleLogin(address);
          setSessionStart(true);
          router.push("/nnn");
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };

    login();
  }, [isConnected, address, router, setSessionStart, validateSession, handleLogin]);

  useEffect(() => {
    if (openConnectModal) {
      openConnectModal();
    }
  }, [openConnectModal]);

  return <div className="flex flex-col items-center justify-center min-h-screen bg-base-100"></div>;
};

export default Login;
