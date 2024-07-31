"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useGlobalState } from "~~/services/store/store";
import { useAuth } from "~~/hooks/useAuth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
const Login = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setSessionStart, sessionStart } = useGlobalState(state => ({
    setSessionStart: state.setSessionStart,
    sessionStart: state.sessionStart,
  }));
  const { handleLogin, validateSession } = useAuth();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const login = async () => {
      try {
        const validate = await validateSession();
        if (validate) {
          setSessionStart(true);
          router.push("/");
        } else if (isConnected && address) {
          const login = await handleLogin(address);
          if (login?.isLogin) {
            setSessionStart(true);
            router.push("/");
          } else {
            disconnect();
            setPending(false);
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };
    !connectModalOpen && !isConnected && setPending(false);
    login();
  }, [isConnected, address, router, connectModalOpen]);

  return (
    <div className="flex flex-1 items-center justify-center bg-base-300">
      <div className="flex flex-row gap-5 justify-end items-center relative min-w-[800px] max-sm:min-w-[350px]  bg-base-100 rounded-xl h-[320px] shadow-md overflow-y-hidden shadow-black">
        <div className="h-full w-[450px] relative">
          <Image
            fill
            src="/thumbnail.jpg"
            className="h-full w-full object-cover shadow-lg shadow-black"
            alt={"Novem Gold"}
          />
        </div>
        <div className="flex flex-col justify-between max-w-[400px] h-full p-7">
          <div>
            <h1 className="text-2xl font-bold whitespace-pre-wrap card-title">{`Welcome to\nNovem Gold Blockchain\nDashboard`}</h1>
            <p className="text-md stat-title whitespace-break-spaces m-0">
              Access and manage to NNN, NVM, NPT and NXAG tokens.
            </p>
          </div>
          <button
            className="btn btn-primary rounded-md"
            onClick={() => {
              setPending(true);
              openConnectModal && openConnectModal();
            }}
          >
            {pending ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : sessionStart ? (
              "Wallet Connected"
            ) : (
              "Sign in with Wallet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
