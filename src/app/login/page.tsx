"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useGlobalState } from "~~/services/store/store";
import { useAuth } from "~~/hooks/useAuth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import SignBtn from "./_components/SignBtn";
import AuthLogin from "~~/app/login/_components/AuthLogin";

/**
 * Login Page Component
 *
 * This component handles the user authentication process for the Novem Gold Blockchain Dashboard.
 * It allows users to connect their wallet, verify their session, and log in using Iron session and wagmi wallet.
 *
 * Key Features:
 * - Validates the existing Iron session on component mount.
 * - If no valid session is found, it attempts to log in the user by signing a message with their connected wallet.
 * - If the wallet is connected but the session is invalid, a new session is created using the user's wallet signature.
 * - Displays a loading state while the session validation or login process is in progress.
 * - If the login process fails due to issues with the wallet connection, the wallet is disconnected to prevent invalid states.
 * - Provides UI components for users to sign in with their wallet or through an Auth0 login (via `AuthLogin`).
 */
const Login = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setSessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
  }));
  const { handleLogin, validateSession } = useAuth();
  const { connectModalOpen, openConnectModal } = useConnectModal();
  const [walletPending, setWalletPending] = useState(false);

  /**
   * Handles the login process within the useEffect hook.
   *
   * - First, it validates the existing Iron session using `validateSession`.
   *   If the session is valid, the session start state is set to true.
   *
   * - If the Iron session is not valid but the wallet is connected with a valid address,
   *   it attempts to start a new Iron session by signing a message with the user's wallet
   *   using the `handleLogin` function.
   *
   * - If the login attempt fails (e.g., the signature is invalid), it disconnects the wallet
   *   to handle any issues with the Wagmi connection.
   *
   */
  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (validate) {
          setSessionStart(true);
        } else if (isConnected && address) {
          const login = await handleLogin(address);
          if (login?.isLogin) {
            setSessionStart(true);
          } else {
            disconnect();
            setWalletPending(false);
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };

    !connectModalOpen && !isConnected && setWalletPending(false);
    login();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, connectModalOpen]);

  return (
    <div className="flex flex-1 items-center justify-center bg-base-300">
      <div className="flex max-md:flex-col md:gap-5 justify-end items-center relative max-xs:w-full bg-base-100 md:rounded-xl md:h-[350px] shadow-md overflow-y-hidden shadow-black">
        <div className="md:h-full sm:h-[200px] h-[150px] md:w-[500px] w-full relative">
          <Image
            fill
            src="/thumbnail.jpg"
            className="h-full w-full object-cover shadow-lg shadow-black"
            alt={"Novem Gold"}
          />
        </div>
        <div className="flex flex-col justify-between max-md:gap-10 max-w-[400px] md:h-full p-7 max-md:px-10">
          <div>
            <h1 className="text-2xl font-bold whitespace-pre-wrap card-title">{`Welcome to\nNovem Gold Blockchain\nDashboard`}</h1>
            <p className="text-md stat-title whitespace-break-spaces m-0">
              Access and manage to NNN, NVM, NXAG and NPT tokens.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <AuthLogin />
            <SignBtn
              setPending={setWalletPending}
              pending={walletPending}
              signText={"Sign in with Wallet"}
              signedText={"Wallet Connected"}
              onClick={() => openConnectModal && openConnectModal()}
              wallet
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
